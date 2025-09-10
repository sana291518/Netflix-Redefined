import { useState, useEffect } from 'react';
import api from '../../../services/api';

export const useWatch = ({ movieId }) => {
  const [movieData, setMovieData] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [sceneData, setSceneData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWatchData = async () => {
      try {
        setIsLoading(true);

        // Fetch movie details from TMDb
        const movieResponse = await api.get(`/movie/${movieId}`);

        // For "Bhaag Milkha Bhaag" (TMDb ID 206324), use custom video URL; otherwise no direct URL
       const augmentedMovieData = {
  ...movieResponse.data,
  videoUrl: String(movieId) === '206324'
    ? "/videos/bhaag-milkha-bhaag.mp4" 
    : null,
};

        setMovieData(augmentedMovieData);

        // Fetch trailers/videos from TMDb
        const videosResponse = await api.get(`/movie/${movieId}/videos`);
        const videos = videosResponse.data.results || [];

        // Find the best YouTube video (trailer preferred)
        const trailer =
          videos.find(
            (video) => video.type === 'Trailer' && video.site === 'YouTube'
          ) ||
          videos.find((video) => video.site === 'YouTube') ||
          videos[0] ||
          null;

        setVideoData(trailer);

       // In useWatch.js - Update the sampleSceneData:
// Update scene data to match the video timing:
const sampleSceneData = [
  {
    id: 1,
    startTime: 527,    // 8:4 - Start of vulgar scene
    endTime: 598,      // 9:58 - End of vulgar scene  
    type: 'intimate',
    severity: 'strong',
    description: 'Inappropriate romantic scene',
  },
  {
    id: 2,
    startTime: 600,    // Another test scene at 6:40
    endTime: 620,      // Skip to 7:00
    type: 'language',
    severity: 'moderate',
    description: 'Strong language scene',
  },
  {
    id: 3,
    startTime: 700,    // Test scene at 5:00
    endTime: 715,      // Skip to 5:15
    type: 'violence',
    severity: 'mild',
    description: 'Action violence scene',
  },
];


        setSceneData(sampleSceneData);
      } catch (error) {
        console.error('Error fetching watch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      fetchWatchData();
    }
  }, [movieId]);

  return {
    movieData,    // includes direct videoUrl for Bhaag Milkha Bhaag
    videoData,    // best YouTube trailer (or fallback)
    sceneData,
    isLoading,
  };
};
