import { enableBodyScroll } from "body-scroll-lock";
import { useEffect, useRef, useState } from "react";

export const usePreviewMovie = ({ openedSearch }) => {
  const overviewEl = useRef(null);

  const [visibleModal, setVisibleModal] = useState(true);
  const [soundReleased, setSoundReleased] = useState(false);

  const onClose = () => {
    setVisibleModal(false);
    if (!openedSearch) {
      enableBodyScroll(document.querySelector("body"));
    }
  };

  const onHandleSound = () => {
    setSoundReleased((prevState) => !prevState);
  };

  useEffect(() => {
    const element = overviewEl?.current;

    if (element) {
      const { offsetHeight, scrollHeight } = element;

      if (offsetHeight < scrollHeight) {
        element.parentNode.setAttribute("data-overflow", "true");
      }
    }
  }, []);

  return {
    overviewEl,
    visibleModal,
    soundReleased,
    onHandleSound,
    onClose,
  };
};
