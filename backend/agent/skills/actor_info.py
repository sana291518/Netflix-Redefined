from fastapi import APIRouter, Query, HTTPException
import os
import time
import requests_cache
from datetime import datetime
from dotenv import load_dotenv
import re

load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
GOOGLE_CSE_API_KEY = os.getenv("GOOGLE_CSE_API_KEY")
GOOGLE_CSE_ID = os.getenv("GOOGLE_CSE_ID")
if not all([TMDB_API_KEY, GOOGLE_CSE_API_KEY, GOOGLE_CSE_ID]):
    raise RuntimeError("Missing API keys in environment variables.")

# Create a single cached session instance used for all requests
session = requests_cache.CachedSession('actor_info_cache', expire_after=300)

router = APIRouter()

def safe_get(url, params=None, retries=3, backoff=1):
    for attempt in range(retries):
        try:
            response = session.get(url, params=params, timeout=5)
            response.raise_for_status()
            return response
        except Exception:
            if attempt == retries - 1:
                raise
            time.sleep(backoff * (2 ** attempt))

def google_search(query: str, num: int = 1):
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": GOOGLE_CSE_API_KEY,
        "cx": GOOGLE_CSE_ID,
        "q": query,
        "num": num
    }
    response = safe_get(url, params)
    return response.json()

def calculate_age(birthdate):
    try:
        birth = datetime.strptime(birthdate, "%Y-%m-%d")
        today = datetime.today()
        return today.year - birth.year - ((today.month, today.day) < (birth.month, birth.day))
    except Exception:
        return None

def get_google_age_hint(actor_name: str):
    try:
        items = google_search(f"{actor_name} age", num=1).get("items", [])
        if not items:
            return None
        snippet = items[0].get("snippet", "")
        match = re.search(r"age\s(\d{1,3})", snippet, re.IGNORECASE)
        return match.group(1) if match else None
    except Exception:
        return None

@router.get("/actor_info")
async def get_actor_info(
    name: str = Query(..., description="Actor or actress name"),
    include_details: bool = Query(False, description="Whether to include age and biography")
):
    base_url = "https://api.themoviedb.org/3"
    name = name.strip()
    try:
        search_resp = safe_get(f"{base_url}/search/person", params={
            "api_key": TMDB_API_KEY,
            "query": name,
            "language": "en-US",
            "page": 1
        })
        search_data = search_resp.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TMDb actor search failed: {e}")

    if not search_data.get("results"):
        return {"error": f"Sorry, I couldn't find anyone named '{name}' on Netflix."}

    actor = search_data["results"][0]
    actor_id = actor["id"]

    try:
        shows_resp = safe_get(f"{base_url}/discover/tv", params={
            "api_key": TMDB_API_KEY,
            "with_cast": actor_id,
            "with_watch_providers": "8",
            "watch_region": "US",
            "language": "en-US",
            "sort_by": "popularity.desc",
            "page": 1
        })
        shows_data = shows_resp.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TMDb show discovery failed: {e}")

    filtered_shows = []
    for show in shows_data.get("results", [])[:20]:
        show_id = show["id"]
        try:
            show_details = safe_get(f"{base_url}/tv/{show_id}", params={"api_key": TMDB_API_KEY, "language": "en-US"}).json()
        except Exception:
            continue
        if not any(net.get("name") == "Netflix" for net in show_details.get("networks", [])):
            continue
        try:
            credits = safe_get(f"{base_url}/tv/{show_id}/credits", params={"api_key": TMDB_API_KEY, "language": "en-US"}).json()
        except Exception:
            continue
        cast_ids = {member["id"] for member in credits.get("cast", [])}
        if actor_id in cast_ids:
            filtered_shows.append(show["name"])
        if len(filtered_shows) == 5:
            break

    response = {
        "actor_name": name,
        "netflix_shows": filtered_shows,
        "source": "Netflix data powered by TMDb"
    }

    if include_details:
        try:
            details = safe_get(
                f"{base_url}/person/{actor_id}",
                params={"api_key": TMDB_API_KEY, "language": "en-US"}
            ).json()
        except Exception:
            details = {}

        age_val = calculate_age(details.get("birthday")) if details.get("birthday") else None
        age = f"{age_val} years old" if age_val is not None else None
        if age is None:
            google_age = get_google_age_hint(name)
            if google_age:
                age = f"around {google_age} years old"
        if age is None:
            age = "Age info is currently unavailable"
        biography = details.get("biography", "").strip()

        # Properly formatted message
        friendly_msg_lines = [
            f"Hey Bestiee! 👋",
            f"{name} is {age}.",
            f"\nNetflix Originals:",
        ]
        if filtered_shows:
            for idx, show in enumerate(filtered_shows, 1):
                friendly_msg_lines.append(f"  • {show}")
        else:
            friendly_msg_lines.append("  • No Netflix originals found.")

        if age and "around" in age:
            friendly_msg_lines.append(
                "\nBut honestly, they look so pretty and young still, ergh kinda something!"
            )
        if biography:
            friendly_msg_lines.append(f"\nAbout {name}: {biography}")

        # Join all lines
        friendly_msg = "\n".join(friendly_msg_lines)

        response.update({
            "age": age,
            "biography": biography,
            "friendly_message": friendly_msg
        })

    return response
