import api from "../../../services/api";


export const getFeaturedDetails = async (movieId, type) => {
  if (type === "movie") {
    return await api.get(`/movie/${movieId}`);
  }

  return await api.get(`/tv/${movieId}`);
};
