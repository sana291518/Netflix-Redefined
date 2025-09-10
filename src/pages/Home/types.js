export const HomeProps = {
  Genres: {
    id: "number",
    name: "string",
  },

  Item: {
    id: "number",
    name: "string (optional)",
    title: "string (optional)",
    overview: "string",
    media_type: "string (optional)",
    poster_path: "string",
  },

  MovieList: {
    slug: "string",
    items: "Item[]",
    title: "string",
  },

  FeaturedMovie: {
    id: "number",
    genres: "Genres[]",
    backdrop_path: "string",
    first_air_date: "string",
    number_of_seasons: "number",
    vote_average: "number",
    overview: "string",
    name: "string (optional)",
  },

  ListMovie: {
    list: [
      {
        slug: "string",
        items: "Item[]",
        title: "string",
      },
    ],
  },
};
