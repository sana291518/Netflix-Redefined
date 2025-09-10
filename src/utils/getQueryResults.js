import api from "../services/api";

export const getQueryResults = async (endpoint, params) => {
  const { data } = await api.get(endpoint, {
    params: {
      ...params,
    },
  });

  return data.results;
};
