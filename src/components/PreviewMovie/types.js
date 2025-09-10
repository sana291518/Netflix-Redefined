export const PreviewMovieProps = {
  Cast: {
    name: "string",
  },

  Crew: {
    job: "string",
    name: "string",
  },

  Companies: {
    name: "string",
  },

  Episode: {
    id: "number",
    name: "string",
    runtime: "number (optional)",
    air_date: "string",
    overview: "string",
    still_path: "string",
    vote_average: "number",
    episode_number: "number",
  },

  Movie: {
    id: "number",
    date: "string",
    title: "string",
    media_type: "string (optional)",
    vote_average: "number",
    overview: "string or null",
    backdrop_path: "string or null",
  },

  Genres: {
    list: [
      {
        id: "number",
        name: "string",
      },
    ],
  },

  About: {
    crew: "array of Crew",
    cast: "array of Cast",
    title: "string (optional)",
    genres: "array of genre objects (Genres.list)",
    contentRatings: "string",
    companies: "array of Companies",
  },

  Collection: {
    id: "number",
    name: "string",
    parts: "array of Movie",
  },

  MaturityLevel: {
    ratings: "string",
  },

  Media: {
    title: "string (optional)",
    soundReleased: "boolean",
    videoId: "string or null (optional)",
    backdropPath: "string or null",
  },

  ProductionCompanies: {
    companies: "array of Companies",
  },

  Recommend: {
    id: "number",
    label: "string",
    list: "array of Movie",
    title: "string (optional)",
    showNoResults: "boolean (optional)",
  },

  Season: {
    id: "number",
    episodes: "array of Episode",
    numberOfSeasons: "number (optional)",
  },

  Status: {
    status: "string",
  },

  Default: {
    id: "number",
    cast: "array of Cast",
    crew: "array of Crew",
    date: "string (optional)",
    season: "Season",
    status: "string",
    title: "string (optional)",
    duration: "string",
    recommends: "array of Movie",
    vote_average: "number",
    openedSearch: "boolean (optional)",
    genres: "array of genre objects (Genres.list)",
    contentRatings: "string",
    collection: "Collection (optional)",
    overview: "string or null",
    videoId: "string or null (optional)",
    number_of_seasons: "number (optional)",
    backdrop_path: "string or null",
    production_companies: "array of Companies",
  },
};
PreviewMovie.propTypes = {
  id: PropTypes.number.isRequired,
  cast: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  crew: PropTypes.arrayOf(
    PropTypes.shape({
      job: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  date: PropTypes.string,
  season: PropTypes.shape({
    id: PropTypes.number.isRequired,
    episodes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        runtime: PropTypes.number,
        air_date: PropTypes.string.isRequired,
        overview: PropTypes.string.isRequired,
        still_path: PropTypes.string.isRequired,
        vote_average: PropTypes.number.isRequired,
        episode_number: PropTypes.number.isRequired,
      })
    ).isRequired,
    numberOfSeasons: PropTypes.number,
  }).isRequired,
  status: PropTypes.string.isRequired,
  title: PropTypes.string,
  duration: PropTypes.string.isRequired,
  recommends: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      date: PropTypes.string,
      title: PropTypes.string,
      media_type: PropTypes.string,
      vote_average: PropTypes.number.isRequired,
      overview: PropTypes.string,
      backdrop_path: PropTypes.string,
    })
  ).isRequired,
  vote_average: PropTypes.number.isRequired,
  openedSearch: PropTypes.bool,
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  contentRatings: PropTypes.string.isRequired,
  collection: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    parts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        date: PropTypes.string,
        title: PropTypes.string,
        media_type: PropTypes.string,
        vote_average: PropTypes.number.isRequired,
        overview: PropTypes.string,
        backdrop_path: PropTypes.string,
      })
    ).isRequired,
  }),
  overview: PropTypes.string,
  videoId: PropTypes.string,
  number_of_seasons: PropTypes.number,
  backdrop_path: PropTypes.string,
  production_companies: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};
