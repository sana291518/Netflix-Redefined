import { getTime } from "./getTime";

export const getSerializeDetails = (details) => {
  const { runtime, number_of_seasons } = details;

  const auxDetails = {
    duration: runtime
      ? getTime(runtime)
      : number_of_seasons === 1
      ? `${number_of_seasons} season`
      : `${number_of_seasons} seasons`,
    number_of_seasons,
  };

  return {
    ...auxDetails,
    id: details.id,
    genres: details.genres,
    status: details.status,
    overview: details.overview ?? null,
    vote_average: details.vote_average,
    title: details.title ?? details.name,
    backdrop_path: details.backdrop_path ?? null,
    production_companies: details.production_companies,
    date: details.release_date ? details.release_date : details.first_air_date,
  };
};

export const getSerializeRecommend = (info) => {
  const {
    id,
    name,
    title,
    overview,
    vote_average,
    release_date,
    backdrop_path,
    first_air_date,
  } = info;

  const media_type = title ? "movie" : "tv";
  const date = release_date ?? first_air_date;

  return {
    id,
    vote_average,
    title: title ?? name,
    backdrop_path: backdrop_path ?? null,
    overview: overview ?? null,
    media_type,
    date,
  };
};
