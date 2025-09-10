import { useState } from "react";

export const useCard = () => {
  const [isLoading, setIsLoading] = useState(true);

  const onHideLoading = () => {
    setIsLoading(false);
  };

  return {
    isLoading,
    onHideLoading,
  };
};
