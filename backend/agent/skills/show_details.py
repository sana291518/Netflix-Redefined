from fastapi import APIRouter, Query, HTTPException
import os
import requests
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")

if not TMDB_API_KEY:
    raise RuntimeError("Missing TMDB_API_KEY in environment variables.")

reddit_access_token = None

def get_reddit_access_token():
    global reddit_access_token
    if reddit_access_token:
        return reddit_access_token
    if not REDDIT_CLIENT_ID or not REDDIT_CLIENT_SECRET:
        return None
    auth = requests.auth.HTTPBasicAuth(REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET)
    data = {'grant_type': 'client_credentials'}
    headers = {'User-Agent': 'NetflixBot/0.1 by YourUsername'}
    response = requests.post('https://www.reddit.com/api/v1/access_token', auth=auth, data=data, headers=headers)
    response.raise_for_status()
    token_json = response.json()
    reddit_access_token = token_json['access_token']
    return reddit_access_token

@router.get("/show_details")
async def get_show_details(
    show_name: str = Query(..., description="Netflix show or movie name"),
    info: str = Query('all', description="Info type: plot, review, trivia or all")
):
    base_url = "https://api.themoviedb.org/3"

    # Search for TV show by name
    search_resp = requests.get(f"{base_url}/search/tv", params={
        "api_key": TMDB_API_KEY,
        "query": show_name,
        "language": "en-US",
        "page": 1
    })
    search_resp.raise_for_status()
    data = search_resp.json()
    if not data.get("results"):
        return {"error": f"No Netflix show found named '{show_name}'."}

    tv_show = data["results"][0]
    show_id = tv_show["id"]

    # Fetch detailed show info
    show_details_resp = requests.get(f"{base_url}/tv/{show_id}", params={"api_key": TMDB_API_KEY, "language": "en-US"})
    show_details_resp.raise_for_status()
    show_details = show_details_resp.json()

    # Confirm Netflix original
    if not any(net.get("name") == "Netflix" for net in show_details.get("networks", [])):
        return {"error": f"'{show_name}' is not a Netflix original."}

    result = {"show_name": show_name, "source": "Netflix data powered by TMDb and Reddit"}

    # Plot
    if info in ('plot', 'all'):
        plot_summary = show_details.get("overview", "").strip()
        plot_summary = plot_summary if plot_summary else "Plot summary currently unavailable."
        plot_msg = (
            f"Ergh! '{show_name}', so the plot goes like this:\n{plot_summary}\n"
            "Isn't it intriguing to watch the story unfold?"
        )
        result['plot_summary'] = plot_summary
        result['plot_message'] = plot_msg
        result['first_air_date'] = show_details.get("first_air_date", "Unknown")

    # Reviews
    if info in ('review', 'all'):
        tmdb_reviews_resp = requests.get(
            f"{base_url}/tv/{show_id}/reviews",
            params={"api_key": TMDB_API_KEY, "language": "en-US", "page": 1}
        )
        tmdb_reviews_resp.raise_for_status()
        tmdb_reviews = tmdb_reviews_resp.json().get("results", [])
        filtered_reviews = []
        for r in tmdb_reviews:
            content_clean = r.get("content", "").replace('\r\n', ' ').replace('\n', ' ').strip()
            if content_clean:
                filtered_reviews.append({
                    "author": r.get("author", "Unknown"),
                    "content": content_clean[:300] + ("..." if len(content_clean) > 300 else ""),
                    "url": r.get("url")
                })
            if len(filtered_reviews) >= 3:
                break

        result['tmdb_reviews'] = filtered_reviews

        if filtered_reviews:
            bullet_reviews = [f"{i+1}. From {rev['author']}: {rev['content']}" for i, rev in enumerate(filtered_reviews)]
            review_msg = "Here's the tea you were looking for —\n" + "\n".join(bullet_reviews) + "\n\nWanna see if the reviews are true?"
        else:
            review_msg = "No reviews found at the moment. Maybe be the first to share your thoughts!"

        # Reddit discussions search
        reddit_discussions = []
        reddit_error = None
        access_token = None
        try:
            access_token = get_reddit_access_token()
        except Exception as e:
            reddit_error = f"Failed to get Reddit access token: {e}"

        if access_token:
            try:
                headers = {'Authorization': f'bearer {access_token}', 'User-Agent': 'NetflixBot/0.1'}
                reddit_search_params = {'q': f'"{show_name}"', 'limit': 5, 'sort': 'relevance', 'type': 'link'}
                reddit_resp = requests.get("https://oauth.reddit.com/search", params=reddit_search_params, headers=headers)
                reddit_resp.raise_for_status()
                reddit_posts = reddit_resp.json().get('data', {}).get('children', [])
                for post in reddit_posts:
                    data = post.get('data', {})
                    title = data.get('title', '').strip()
                    if title:
                        reddit_discussions.append({
                            'title': title,
                            'url': f"https://www.reddit.com{data.get('permalink', '')}",
                            'score': data.get('score', 0),
                            'num_comments': data.get('num_comments', 0)
                        })
            except Exception as e:
                reddit_error = f"Reddit API error: {e}"

        if reddit_discussions:
            result['reddit_discussions'] = reddit_discussions
        elif reddit_error:
            result['reddit_discussions'] = []
            result['reddit_error'] = reddit_error

        result['review_message'] = review_msg

    # Trivia
    if info in ('trivia', 'all'):
        trivia_data = {
            "tagline": show_details.get("tagline", "No tagline available."),
            "homepage": show_details.get("homepage", ""),
            "overview": show_details.get("overview", "")
        }
        trivia_msg = f"Here's some trivia about '{show_name}': Tagline - {trivia_data['tagline']}"
        if trivia_data["homepage"]:
            trivia_msg += f"\nCheck it out here: {trivia_data['homepage']}"

        result['trivia'] = trivia_data
        result['trivia_message'] = trivia_msg

    return result
