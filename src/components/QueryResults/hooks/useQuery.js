import { useCallback, useEffect } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

export const useQuery = ({ inView, openSearchBox, fetchNextPage }) => {
  const inViewScroll = useCallback(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const onViewScroll = useCallback(() => {
    const body = document.querySelector("body");
    if (!openSearchBox) {
      enableBodyScroll(body);
    } else {
      disableBodyScroll(body);
    }
  }, [openSearchBox]);

  useEffect(() => {
    inViewScroll();
  }, [inViewScroll]);

  useEffect(() => {
    onViewScroll();
  }, [onViewScroll]);
};
