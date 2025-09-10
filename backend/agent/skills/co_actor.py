from fastapi import APIRouter, Query, HTTPException
import os
import requests
import requests_cache
from dotenv import load_dotenv

load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
if not TMDB_API_KEY:
    raise RuntimeError("Missing TMDB_API_KEY in environment variables.")

# Optional: add a cache like your main agent
session = requests_cache.CachedSession('co_actor_cache', expire_after=300)

router = APIRouter()

def get_actor_id(base_url, api_key, name):
    try:
        resp = session.get(f"{base_url}/search/person", params={
            "api_key": api_key,
            "query": name,
            "language": "en-US",
            "page": 1
        })
        resp.raise_for_status()
        data = resp.json()
        if data.get("results"):
            return data["results"][0]["id"]
        return None
    except Exception:
        return None

@router.get("/co_actor")
async def get_co_actors(actor1: str = Query(...), actor2: str = Query(...)):
    base_url = "https://api.themoviedb.org/3"

    # Get IDs and fail clearly if not found
    actor1_id = get_actor_id(base_url, TMDB_API_KEY, actor1)
    actor2_id = get_actor_id(base_url, TMDB_API_KEY, actor2)

    if not actor1_id or not actor2_id:
        return {
            "error": f"Could not find both actors. Please check their names.",
            "actor1_found": bool(actor1_id),
            "actor2_found": bool(actor2_id),
            "co_starring_shows": [],
            "friendly_message": f"Sorry, couldn't find both actors with the names provided.",
            "source": "Netflix data powered by TMDb"
        }

    try:
        shows_resp = session.get(f"{base_url}/discover/tv", params={
            "api_key": TMDB_API_KEY,
            "with_cast": actor1_id,
            "with_watch_providers": "8",  # Netflix provider
            "watch_region": "US",
            "language": "en-US",
            "page": 1,
            "sort_by": "popularity.desc"
        })
        shows_resp.raise_for_status()
        shows_data = shows_resp.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TMDb show discovery failed: {e}")

    co_starring_shows = []

    # Only add shows both actors appear in AND that are on Netflix
    for show in shows_data.get("results", [])[:20]:
        show_id = show["id"]
        try:
            show_details = session.get(f"{base_url}/tv/{show_id}", params={
                "api_key": TMDB_API_KEY,
                "language": "en-US"
            }).json()
            if not any(net.get("name") == "Netflix" for net in show_details.get("networks", [])):
                continue
            credits = session.get(f"{base_url}/tv/{show_id}/credits", params={
                "api_key": TMDB_API_KEY,
                "language": "en-US"
            }).json()
        except Exception:
            continue
        cast_ids = {member["id"] for member in credits.get("cast", [])}
        if actor2_id in cast_ids:
            co_starring_shows.append(show["name"])
        if len(co_starring_shows) == 5:
            break

    # Friendly and accurate messaging
    if not co_starring_shows:
        friendly_msg = (
            f"Looks like {actor1} and {actor2} have not co-starred together in any Netflix originals yet. "
            f"But maybe they'll team up someday! 😉"
        )
    else:
        shows_list = ", ".join(co_starring_shows)
        friendly_msg = (
            f"{actor1} and {actor2} have appeared together in Netflix originals like {shows_list}. "
            f"Perfect binge-watch material! 🍿"
        )

    return {
        "actor1": actor1,
        "actor2": actor2,
        "co_starring_shows": co_starring_shows,
        "friendly_message": friendly_msg,
        "source": "Netflix data powered by TMDb"
    }
