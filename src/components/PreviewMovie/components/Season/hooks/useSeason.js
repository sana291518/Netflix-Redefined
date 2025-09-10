import { useLayoutEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import api from "../../../../../services/api";

export const useSeason = ({ episodes, id }) => {
  const [numberSeason, setNumberSeason] = useState(0);

  const [episodesSeason, setEpisodesSeason] = useState(episodes);

  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["seasonData", numberSeason, id],
    queryFn: async () => {
      const { data } = await api.get(`tv/${id}/season/${numberSeason}`);
      return data;
    },
    enabled: !!numberSeason,
  });

  const handleSeason = (numberSeason) => {
    setNumberSeason(numberSeason);
  };

  useLayoutEffect(() => {
    if (data) {
      setEpisodesSeason(data.episodes);
    }
  }, [data]);

  return {
    isSuccess,
    isLoading,
    handleSeason,
    numberSeason,
    episodesSeason,
  };
};
