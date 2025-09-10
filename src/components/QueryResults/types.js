export const QueryResultsProps = {
  DataSearch: {
    pages: [
      {
        page: "number",
        results: [
          {
            id: "number",
            title: "string",
            media_type: "string",
            poster_path: "string",
          },
        ],
      },
    ],
    pageParams: "unknown[]",
  },

  onOpenDetails: {
    id: "number",
    media_type: "string (optional)",
    title: "string (optional)",
  },

  SearchData: {
    query: "string",
    data: "DataSearch (optional)",
    openSearchBox: "boolean",
    fetchNextPage: "function",
  },

  Default: {
    onOpenDetails: "function accepting onOpenDetails object",
  },
};
