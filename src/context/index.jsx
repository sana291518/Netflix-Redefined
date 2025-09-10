import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../services/queryClient";
import { PreviewProvider } from "./PreviewContext";
import { SearchProvider } from "./SearchContext";

const AppProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <SearchProvider>
      <PreviewProvider>{children}</PreviewProvider>
    </SearchProvider>
  </QueryClientProvider>
);

export default AppProvider;
