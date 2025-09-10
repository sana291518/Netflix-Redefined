// src/pages/Watch/components/VideoPlayer/VideoPlayer.jsx
import React, { useRef, useEffect, useState } from 'react';
import { BsPlay, BsPause } from 'react-icons/bs';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import { RiShieldCheckLine } from 'react-icons/ri';
import styles from './styles.module.css';
import { HeartPulse } from './HeartPulse/HeartPulse';

export const VideoPlayer = ({
  videoData,
  movieData,
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  duration,
  setDuration,
  volume,
  setVolume,
  isMuted,
  setIsMuted,
  isFullscreen,
  setIsFullscreen,
  familySafeMode,
  setFamilySafeMode,
  showControls,
  onSeekTo
}) => {
  const videoRef = useRef(null);
  const [skipIndicator, setSkipIndicator] = useState({ show: false, direction: '', text: '' });
  const [showHeartPulse, setShowHeartPulse] = useState(false); // ✅ HeartPulse state

  // Get video URL
  const getVideoUrl = () => {
    if (movieData?.videoUrl) {
      return movieData.videoUrl;
    }
    return null;
  };

  const videoUrl = getVideoUrl();
  console.log('Playback videoUrl:', videoUrl);

  // ✅ HTML5 VIDEO EVENT HANDLERS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      console.log('📏 Video duration:', video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => {
      console.log('▶️ Video started playing');
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('⏸️ Video paused');
      setIsPlaying(false);
    };

    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    const handleEnded = () => {
      console.log('🎬 Video finished');
      setShowHeartPulse(true); // ✅ Show rating component when video ends
    };

    // Add event listeners
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('ended', handleEnded); // ✅ Added ended event

    return () => {
      // Cleanup event listeners
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoUrl]);

  // ✅ CONTROL VIDEO PLAYBACK
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play();
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // ✅ CONTROL VOLUME
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;
    video.muted = isMuted;
  }, [volume, isMuted]);

  // ✅ SCENE SKIPPING - SEEK TO TIME
  useEffect(() => {
    const video = videoRef.current;
    if (!video || currentTime === undefined) return;

    // Only seek if there's a significant difference (avoid infinite loops)
    if (Math.abs(video.currentTime - currentTime) > 1) {
      video.currentTime = currentTime;
      console.log('🎯 Seeked to:', currentTime);
    }
  }, [currentTime]);

  // ✅ KEYBOARD SHORTCUTS - Netflix Style
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (document.activeElement?.tagName === 'INPUT') return;

      const key = event.key.toLowerCase();
      
      switch (key) {
        case ' ':
        case 'k':
          event.preventDefault();
          togglePlayPause();
          break;
        case 'arrowleft':
        case 'j':
          event.preventDefault();
          skipBackward();
          break;
        case 'arrowright':
        case 'l':
          event.preventDefault();
          skipForward();
          break;
        case 'arrowup':
          event.preventDefault();
          if (volume < 1) {
            setVolume(Math.min(1, volume + 0.1));
            if (isMuted) setIsMuted(false);
          }
          break;
        case 'arrowdown':
          event.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case 'm':
          event.preventDefault();
          setIsMuted(!isMuted);
          break;
        case 'f':
          event.preventDefault();
          toggleFullscreen();
          break;
        case '0':
          event.preventDefault();
          if (onSeekTo) {
            onSeekTo(0);
          } else {
            setCurrentTime(0);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, volume, isMuted, currentTime, duration]);

  // Play/Pause toggle
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    const newTime = Math.min(currentTime + 10, duration);
    if (onSeekTo) {
      onSeekTo(newTime);
    } else {
      setCurrentTime(newTime);
    }
    showSkipIndicator('right', '+10s');
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    const newTime = Math.max(currentTime - 10, 0);
    if (onSeekTo) {
      onSeekTo(newTime);
    } else {
      setCurrentTime(newTime);
    }
    showSkipIndicator('left', '-10s');
  };

  // Show skip indicator animation
  const showSkipIndicator = (direction, text) => {
    setSkipIndicator({ show: true, direction, text });
    setTimeout(() => {
      setSkipIndicator({ show: false, direction: '', text: '' });
    }, 1000);
  };

  // Progress bar click handler
  const handleProgressClick = (e) => {
    if (!videoRef.current || duration === 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    if (onSeekTo) {
      onSeekTo(newTime);
    } else {
      setCurrentTime(newTime);
    }
  };

  // Volume control
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  // Mute toggle
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Family Safe toggle
  const toggleFamilySafe = () => {
    setFamilySafeMode(!familySafeMode);
  };

  // ✅ HeartPulse handler
  const handleAppreciation = (appreciation) => {
    console.log('User appreciation:', appreciation);
    // Store user's rating in localStorage
    localStorage.setItem(
      `heart_pulse_${movieData.id}`, 
      JSON.stringify(appreciation)
    );
    // Auto-hide after 3 seconds
    setTimeout(() => setShowHeartPulse(false), 3000);
  };

  // Format time display
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Fallback if no video URL
  if (!videoUrl) {
    const fallbackImage = movieData?.backdrop_path
      ? `https://image.tmdb.org/t/p/w500${movieData.backdrop_path}`
      : movieData?.poster_path
      ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
      : 'https://via.placeholder.com/500x750/1a1a1a/ffffff?text=No+Preview+Available';

    return (
      <div className={styles.noVideo}>
        <div className={styles.posterContainer}>
          <img
            src={fallbackImage}
            alt={movieData?.title || movieData?.name}
            className={styles.poster}
            onError={e => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/500x750/1a1a1a/ffffff?text=No+Preview+Available';
            }}
          />
          <div className={styles.noVideoMessage}>
            <h2>Preview Not Available</h2>
            <p>Full movie playback would be available with streaming rights</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ MAIN VIDEO PLAYER - HTML5 VIDEO ELEMENT
  return (
    <div className={`${styles.videoContainer} ${isFullscreen ? styles.fullscreen : ''}`}>
      {/* HTML5 Video - NATIVE BROWSER SUPPORT */}
      <video
        ref={videoRef}
        src={videoUrl}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          backgroundColor: '#000'
        }}
        preload="auto"
        playsInline
        onLoadStart={() => console.log('🎬 Video load started')}
        onCanPlay={() => console.log('✅ Video can play')}
        onError={(e) => console.error('❌ Video error:', e)}
      />

      {/* Netflix-style Video Overlay */}
      {showControls && (
        <div className={styles.videoOverlay}>
          {/* Center Controls - Only Play/Pause */}
          <div className={styles.centerControls}>
            <button className={styles.playButton} onClick={togglePlayPause}>
              {isPlaying ? <BsPause /> : <BsPlay />}
            </button>
          </div>

          {/* Bottom Controls */}
          <div className={styles.bottomControls}>
            {/* Progress Bar */}
            <div className={styles.progressContainer} onClick={handleProgressClick}>
              <div 
                className={styles.progressBar} 
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
              />
            </div>

            {/* Controls Row */}
            <div className={styles.controlsRow}>
              <div className={styles.leftControls}>
                <button className={styles.controlButton} onClick={togglePlayPause}>
                  {isPlaying ? <BsPause /> : <BsPlay />}
                </button>

                <div className={styles.volumeControl}>
                  <button className={styles.controlButton} onClick={toggleMute}>
                    {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className={styles.volumeSlider}
                  />
                </div>

                <div className={styles.timeDisplay}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className={styles.rightControls}>
                <button 
                  className={`${styles.familySafeButton} ${familySafeMode ? styles.active : ''}`}
                  onClick={toggleFamilySafe}
                >
                  <RiShieldCheckLine />
                  Family Safe
                </button>

                <button className={styles.fullscreenButton} onClick={toggleFullscreen}>
                  {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skip Indicators */}
      {skipIndicator.show && (
        <div className={`${styles.skipIndicator} ${styles[skipIndicator.direction]} ${styles.show}`}>
          {skipIndicator.text}
        </div>
      )}

      {/* ✅ HeartPulse Rating Component - Shows when video ends */}
      {showHeartPulse && (
        <HeartPulse
          isVisible={showHeartPulse}
          movieData={movieData}
          onAppreciation={handleAppreciation}
        />
      )}
    </div>
  );
};
