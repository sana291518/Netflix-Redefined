
# Netflix Clone – Full Stack React & Trellis

## Overview

This project is a full-stack Netflix-style UI clone with a **React (Vite)** frontend and a **FastAPI (Trellis)** backend. It allows browsing movies by categories, provides intelligent recommendations, and includes **family-friendly viewing controls**.

## Key Features

* Browse movies and series by genre with recommendations
* Interactive video player with **Scene Skipper** (auto/manual skipping of filtered scenes)
* **Family Safe Mode** to filter intimate, violent, or strong language content
* Dynamic UI with countdowns, scene icons, and filter controls
* FastAPI backend providing recommendation, actor info, co-actor data, and show details

## About Trellis – Backend

**Trellis** is the FastAPI backend powering recommendations and dynamic content APIs.
It organizes endpoints into "skills," including:

* Movie recommendations
* Actor details
* Co-actor relations
* Show metadata
* plot
* reviews
* subscriptions related help can be added 

## Tech Stack

**Frontend:** React.js, Vite, React Icons, Sass, React Player, React Query
**Backend:** FastAPI, Uvicorn, Pydantic, Requests, python-dotenv
**APIs Integrated:** TMDB, OMDB, Reddit, Google Custom Search

## Environment Variables

**Backend `.env`**

```
TMDB_API_KEY=your_tmdb_key  
REDDIT_CLIENT_ID=your_reddit_client_id  
REDDIT_CLIENT_SECRET=your_reddit_secret  
REDDIT_USERNAME=your_username  
OMDB_API_KEY=your_omdb_key  
GOOGLE_CSE_API_KEY=your_google_cse_key  
GOOGLE_CSE_ID=your_google_cse_id  
RECOMMEND_URL=http://localhost:8000/skills/recommend/recommend  
ACTOR_INFO_URL=  
CO_ACTOR_URL=  
SHOW_DETAILS_URL=  
```

**Frontend `.env`**

```
VITE_TMDB_API_KEY=your_tmdb_key  
VITE_TMDB_API_BASE=https://api.themoviedb.org/3  
VITE_TMDB_API_LANGUAGE=en-US  
```

## Getting Started

1. Clone the repository
2. **Frontend Setup**

   ```bash
   npm install
   npm run dev
   ```
3. **Backend Setup**

   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
4. Configure `.env` files with your API keys
5. Open frontend at [http://localhost:]


## Usage

* Browse movies by category or search
* Watch with **Scene Skipper** for family-safe filtering
* Adjust content filters directly from the Watch page
* Query backend for recommendations, actor, and show details

## License

MIT License
