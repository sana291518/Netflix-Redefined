export const getGenres = (genres) => {
  return genres.map((genre) => genre.name).join(", ");
};
