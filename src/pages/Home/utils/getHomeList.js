import { getQueryResults } from "../../../utils/getQueryResults";

export const getHomeList = async () => {
  return [
    {
      slug: "originals",
      title: "Netflix Originals",
      items: await getQueryResults("/discover/tv", {
        with_networks: "213",
      }),
    },
    {
      slug: "trending",
      title: "Recommended for You",
      items: await getQueryResults("/trending/all/week"),
    },
    {
      slug: "toprated",
      title: "Top Rated",
      items: await getQueryResults("/movie/top_rated"),
    },
    {
      slug: "action",
      title: "Action",
      items: await getQueryResults("/discover/movie", {
        with_genres: "28",
      }),
    },
    {
      slug: "comedy",
      title: "Comedy",
      items: await getQueryResults("/discover/movie", {
        with_genres: "35",
      }),
    },
    {
      slug: "horror",
      title: "Horror",
      items: await getQueryResults("/discover/movie", {
        with_genres: "27",
      }),
    },
    {
      slug: "romance",
      title: "Romance",
      items: await getQueryResults("/discover/movie", {
        with_genres: "10749",
      }),
    },
    {
      slug: "documentary",
      title: "Documentaries",
      items: await getQueryResults("/discover/movie", {
        with_genres: "99",
      }),
    },
  ];
};
