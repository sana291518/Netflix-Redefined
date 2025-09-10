// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_TMDB_API_BASE,
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: import.meta.env.VITE_TMDB_API_LANGUAGE,
    include_adult: false, // ✅ Global filter for adult content
  },
});

export default api;
