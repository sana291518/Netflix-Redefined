// src/pages/Watch/Watch.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoPlayer } from './components/VideoPlayer';
import { SceneSkipper } from './components/SceneSkipper';
import { useWatch } from './hooks/useWatch';
import { BsArrowLeft } from 'react-icons/bs';
import styles from './styles.module.css';

export const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movieData, videoData, isLoading, sceneData } = useWatch({ movieId: id });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [familySafeMode, setFamilySafeMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const [contentFilters, setContentFilters] = useState({
    intimate: true,
    violence: false,
    language: true
  });

  useEffect(() => {
    let timeout;
    if (isPlaying && showControls) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  useEffect(() => {
    if (movieData) {
      console.log('Movie data loaded:', movieData.title);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    }
  }, [movieData]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleSeekTo = (newTime) => {
    console.log('Seeking to time:', newTime);
    if (duration > 0 && newTime >= 0 && newTime <= duration) {
      setCurrentTime(newTime);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading movie...</p>
      </div>
    );
  }

  if (!movieData) {
    return (
      <div className={styles.errorContainer}>
        <p>Movie not found</p>
        <button onClick={handleBackToHome}>Back to Browse</button>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.watchContainer} ${isFullscreen ? styles.fullscreen : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Back Button */}
      {showControls && !isFullscreen && (
        <button 
          className={styles.backButton}
          onClick={handleBackToHome}
        >
          <BsArrowLeft size={24} />
          <span>Back to Browse</span>
        </button>
      )}

      {/* Video Player with Built-in Netflix Controls */}
      <VideoPlayer
        videoData={videoData}
        movieData={movieData}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        duration={duration}
        setDuration={setDuration}
        volume={volume}
        setVolume={setVolume}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        familySafeMode={familySafeMode}
        setFamilySafeMode={setFamilySafeMode}
        showControls={showControls}
        onSeekTo={handleSeekTo}
      />

      {/* Scene Skipper */}
      <SceneSkipper
        sceneData={sceneData}
        currentTime={currentTime}
        familySafeMode={familySafeMode}
        contentFilters={contentFilters}
        onSkipScene={handleSeekTo}
        onUpdateFilters={setContentFilters}
      />

      {/* Movie Info Overlay */}
      {showControls && !isFullscreen && (
        <div className={styles.movieInfo}>
          <h1>{movieData?.title || movieData?.name}</h1>
          <div className={styles.movieMeta}>
            <span>{movieData?.release_date?.split('-')[0] || movieData?.first_air_date?.split('-')[0]}</span>
            <span>•</span>
            <span>{Math.floor((movieData?.runtime || 150) / 60)}h {(movieData?.runtime || 150) % 60}m</span>
            <span>•</span>
            <span>HD</span>
            {familySafeMode && <span className={styles.familySafeBadge}>Family Safe</span>}
          </div>
        </div>
      )}
    </div>
  );
};
