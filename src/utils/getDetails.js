import { isPast } from "date-fns";
import { getQueryResults } from "./getQueryResults";

import api from "../services/api";

import {
  getSerializeDetails,
  getSerializeRecommend,
} from "./getSerializeData";

export const getDetails = async (type, id) => {
  if (type === "movie") {
    const { data: details } = await api.get(`movie/${id}`);
    const videos = await getQueryResults(`movie/${id}/videos`);

    const recommendations = await getQueryResults(`movie/${id}/recommendations`);

    const collection =
      details.belongs_to_collection?.id &&
      (await api.get(`collection/${details.belongs_to_collection.id}`));

    const contentRatings = await getQueryResults(`movie/${id}/release_dates`);

    const contentRatingsBR = contentRatings
      .find((item) => item.iso_3166_1 === "BR")
      ?.release_dates.at(-1).certification;

    const contentRatingsUS = contentRatings
      .find((item) => item.iso_3166_1 === "US")
      ?.release_dates.at(-1).certification;

    const {
      data: { cast, crew },
    } = await api.get(`movie/${id}/credits`);

    return {
      ...getSerializeDetails(details),
      recommends: recommendations.map((recommendation) =>
        getSerializeRecommend(recommendation)
      ),
      collection:
        collection?.data.parts.length &&
        {
          id: collection?.data.id,
          name: collection?.data.name,
          parts: collection?.data.parts
            .reduce(function (res, option) {
              const data = getSerializeRecommend(option);

              if (data.date && isPast(new Date(data.date))) {
                res.push(data);
              }

              return res;
            }, [])
            .sort((prev, next) => Number(new Date(prev.date)) - Number(new Date(next.date))),
        },
      videoId: videos.length
        ? videos.find(
            (item) => item.type === "Trailer" || item.type === "Teaser"
          )?.key
        : null,
      contentRatings: contentRatingsBR?.length ? contentRatingsBR : contentRatingsUS,
      crew: crew.filter(({ job }) => job === "Writer" || job === "Director"),
      cast: cast.slice(0, 8),
    };
  }

  // For TV shows
  const { data: details } = await api.get(`tv/${id}`);
  const { data: season } = await api.get(`tv/${id}/season/1`);

  const videos = await getQueryResults(`tv/${id}/videos`);

  const recommendations = await getQueryResults(`tv/${id}/recommendations`);
  const contentRatings = await getQueryResults(`tv/${id}/content_ratings`);

  const contentRatingsBR = contentRatings.find(
    (item) => item.iso_3166_1 === "BR"
  )?.rating;

  const contentRatingsUS = contentRatings.find(
    (item) => item.iso_3166_1 === "US"
  )?.rating;

  const {
    data: { cast, crew },
  } = await api.get(`tv/${id}/credits`);

  return {
    ...getSerializeDetails(details),
    recommends: recommendations.map((recommendation) =>
      getSerializeRecommend(recommendation)
    ),
    videoId: videos.length
      ? videos.find(
          (item) => item.type === "Trailer" || item.type === "Teaser"
        )?.key
      : null,
    contentRatings: contentRatingsBR?.length ? contentRatingsBR : contentRatingsUS,
    season: {
      id: season.id,
      episodes: season.episodes,
      numberOfSeasons: season.number_of_seasons,
    },
    crew: crew.filter(({ job }) => job === "Producer"),
    cast: cast.slice(0, 8),
  };
};
