import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";

export const useMedia = ({ soundReleased }) => {
  const [isVisibleVideo, setIsVisibleVideo] = useState(false);
  const [loadedMain, setLoadedMain] = useState(false);

  const soundElement = useRef(null);

  useEffect(() => {
    if (isVisibleVideo && soundElement.current) {
      if (!soundReleased) {
        soundElement.current.getInternalPlayer().mute();
      } else {
        soundElement.current.getInternalPlayer().unMute();
      }
    }
  }, [isVisibleVideo, soundReleased]);

  const onPlayerReady = () => {
    setIsVisibleVideo(true);
  };

  const onPlayerEnd = (event) => {
    setIsVisibleVideo(false);
    event.target.destroy();
  };

  const onPlayerError = () => {
    setIsVisibleVideo(false);
  };

  const onHideLoading = () => {
    setLoadedMain(true);
  };

  return {
    onPlayerEnd,
    onPlayerReady,
    onPlayerError,
    isVisibleVideo,
    onHideLoading,
    soundElement,
    loadedMain,
  };
};
