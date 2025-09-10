import { createContext, useState, useContext } from "react";
import { getDetails } from "../utils/getDetails";

const PreviewContext = createContext({});

const PreviewProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewMovie, setPreviewMovie] = useState(null);

  const onUpdatePreview = async ({ id, media_type, title }) => {
    setIsLoading(true);
    setPreviewMovie(null);

    const type = media_type || (title ? "movie" : "tv");
    const data = await getDetails(type, id);

    setPreviewMovie(data);
    setIsLoading(false);
  };

  return (
    <PreviewContext.Provider
      value={{
        isLoading,
        previewMovie,
        onUpdatePreview,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
};

function usePreview() {
  const context = useContext(PreviewContext);
  return context;
}

export { PreviewProvider, usePreview };
