import { useState } from "react";
import { usePreview } from "../../../../../../../context/PreviewContext";

export const useCard = () => {
  const { onUpdatePreview } = usePreview();
  const [isLoading, setIsLoading] = useState(true);

  const onHandlePreview = (item) => {
    onUpdatePreview({
      id: item.id,
      title: item.title,
      media_type: item.media_type,
    });
  };

  const onHideLoading = () => {
    setIsLoading(false);
  };

  return {
    isLoading,
    onHideLoading,
    onHandlePreview,
  };
};
