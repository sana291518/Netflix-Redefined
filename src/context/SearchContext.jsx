import { createContext, useContext, useReducer } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";

import { searchReducer } from "../reducers/search/reducer";
import { setQuerySearch } from "../reducers/search/actions";

import api from "../services/api";

const SearchContext = createContext({});

const SearchProvider = ({ children }) => {
  const [searchState, dispatch] = useReducer(searchReducer, {
    query: "",
    openSearchBox: false,
  });

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ["seasonData", searchState.query],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get(
        `search/multi?query=${searchState.query}&page=${pageParam}`
      );
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.total_pages > lastPage.page) {
        return lastPage.page + 1;
      }
      return undefined; // Explicitly return undefined when no next page
    },
    enabled: !!searchState.query.length,
  });

  const debounceOnChange = debounce((e) => {
    dispatch(setQuerySearch(e?.target?.value));
  }, 500);

  return (
    <SearchContext.Provider
      value={{
        data,
        debounceOnChange,
        query: searchState.query,
        openSearchBox: searchState.openSearchBox,
        fetchNextPage,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

function useSearch() {
  const context = useContext(SearchContext);
  return context;
}

export { SearchProvider, useSearch };
