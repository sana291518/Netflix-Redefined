from fastapi import APIRouter, Query
import os
import requests
from dotenv import load_dotenv
import time
from functools import lru_cache

load_dotenv()

router = APIRouter()

OMDB_API_KEY = os.getenv("OMDB_API_KEY")
GOOGLE_CSE_API_KEY = os.getenv("GOOGLE_CSE_API_KEY")
GOOGLE_CSE_ID = os.getenv("GOOGLE_CSE_ID")

def safe_get(url, params=None, retries=3, backoff=1):
    for attempt in range(retries):
        try:
            response = requests.get(url, params=params, timeout=5)
            response.raise_for_status()
            return response
        except requests.RequestException:
            if attempt == retries - 1:
                raise
            time.sleep(backoff * (2 ** attempt))

@lru_cache(maxsize=256)
def get_omdb_details(title: str):
    if not title:
        return {}
    url = "http://www.omdbapi.com/"
    params = {"t": title, "apikey": OMDB_API_KEY}
    try:
        resp = safe_get(url, params)
        data = resp.json()
        if data.get("Response") == "True":
            return {
                "title": data.get("Title"),
                "plot": data.get("Plot"),
                "imdb_rating": data.get("imdbRating"),
                "runtime": data.get("Runtime"),
                "director": data.get("Director"),
                "actors": data.get("Actors"),
                "url": f"https://www.imdb.com/title/{data.get('imdbID')}/" if data.get("imdbID") else None
            }
    except Exception:
        return {}
    return {}

def google_search(query: str, start: int = 1, num: int = 7):
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": GOOGLE_CSE_API_KEY,
        "cx": GOOGLE_CSE_ID,
        "q": query + " site:netflix.com",
        "start": start,
        "num": num
    }
    response = safe_get(url, params)
    return response.json()

@router.get("/recommend")
async def recommend_netflix_content(
    actor: str = Query(None),
    genre: str = Query(None),
    mood: str = Query(None)
):
    search_terms = []
    if genre:
        search_terms.append(genre)
    if mood:
        search_terms.append(mood)
    if actor:
        search_terms.append(actor)
    if not search_terms:
        search_terms.append("Netflix original shows")

    query = " ".join(search_terms)

    try:
        search_results = google_search(query, num=10)
    except Exception as e:
        return {"error": f"Google Custom Search failed: {e}"}

    recommendations = []
    items = search_results.get("items", [])
    filtered_count = 0

    for item in items:
        title = item.get("title", "")
        snippet = item.get("snippet", "")
        link = item.get("link", "")
        # Skip overly generic or irrelevant results
        skip_phrases = ["netflix home", "netflix official", "visit netflix", "netflix apps", "help.netflix"]
        if any(phrase in title.lower() for phrase in skip_phrases):
            continue
        if "- Netflix" in title:
            title = title.replace("- Netflix", "").strip()
        if not title or not link:
            continue

        omdb_info = get_omdb_details(title)
        desc_parts = []
        if omdb_info.get("plot"):
            desc_parts.append(omdb_info["plot"])
        elif snippet:
            desc_parts.append(snippet.strip())
        else:
            desc_parts.append("An interesting Netflix title to check out.")

        if omdb_info.get("imdb_rating"):
            desc_parts.append(f"IMDB Rating: {omdb_info['imdb_rating']}")

        url = omdb_info.get("url") or link

        recommendations.append({
            "title": title,
            "description": "\n".join(desc_parts),
            "link": url,
            "runtime": omdb_info.get("runtime"),
            "director": omdb_info.get("director"),
            "actors": omdb_info.get("actors")
        })
        filtered_count += 1
        if filtered_count >= 5:
            break

    if not recommendations:
        return {
            "message": "Sorry, no Netflix-related recommendations found for your criteria.",
            "criteria": {"actor": actor, "genre": genre, "mood": mood},
            "recommendations": []
        }

    return {
        "criteria": {"actor": actor, "genre": genre, "mood": mood},
        "recommendations": recommendations,
        "source": "Live Netflix data powered by Google Custom Search and OMDb"
    }
