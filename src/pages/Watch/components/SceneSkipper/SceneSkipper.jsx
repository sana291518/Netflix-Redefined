// src/pages/Watch/components/SceneSkipper/SceneSkipper.jsx
import { useState, useEffect } from 'react';
import { BsSkipForward, BsEye, BsGear } from 'react-icons/bs';
import { FaHeart, FaFistRaised, FaCommentSlash } from 'react-icons/fa';
import styles from './styles.module.css';

export const SceneSkipper = ({
  sceneData,
  currentTime,
  familySafeMode,
  contentFilters, // New prop for filter settings
  onSkipScene,
  onUpdateFilters
}) => {
  const [currentScene, setCurrentScene] = useState(null);
  const [skipCountdown, setSkipCountdown] = useState(0);
  const [userDecision, setUserDecision] = useState(null);
  const [showFilterSettings, setShowFilterSettings] = useState(false);

  // Enhanced detection logic with filter preferences
  useEffect(() => {
    if (!familySafeMode || !sceneData.length) return;

    const activeScene = sceneData.find(scene => {
      const inTimeRange = currentTime >= scene.startTime && currentTime <= scene.endTime;
      const shouldFilter = contentFilters[scene.type]; // Check if this type should be filtered
      
      return inTimeRange && shouldFilter;
    });

    if (activeScene && activeScene !== currentScene) {
      setCurrentScene(activeScene);
      setSkipCountdown(5);
      setUserDecision(null);
    } else if (!activeScene && currentScene) {
      setCurrentScene(null);
      setSkipCountdown(0);
      setUserDecision(null);
    }
  }, [currentTime, sceneData, familySafeMode, currentScene, contentFilters]);

  // Auto-skip countdown logic
  useEffect(() => {
    if (skipCountdown > 0 && familySafeMode && !userDecision) {
      const timer = setTimeout(() => {
        if (skipCountdown === 1) {
          handleSkipScene();
        } else {
          setSkipCountdown(skipCountdown - 1);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [skipCountdown, familySafeMode, userDecision]);

  const handleSkipScene = () => {
    if (currentScene) {
      onSkipScene(currentScene.endTime + 1);
      setUserDecision('skip');
    }
  };

  const handleWatchScene = () => {
    setUserDecision('watch');
    setSkipCountdown(0);
  };

  const handleFilterToggle = (filterType) => {
    const newFilters = {
      ...contentFilters,
      [filterType]: !contentFilters[filterType]
    };
    onUpdateFilters(newFilters);
  };

  const getSceneIcon = (type) => {
    switch (type) {
      case 'intimate': return <FaHeart />;
      case 'violence': return <FaFistRaised />;
      case 'language': return <FaCommentSlash />;
      default: return null;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return '#ffc107';
      case 'moderate': return '#ff9800';
      case 'strong': return '#f44336';
      default: return '#2196f3';
    }
  };

  // Filter Settings Panel
  const FilterSettings = () => (
    <div className={styles.filterSettings}>
      <h4>Content Filtering Options</h4>
      
      <div className={styles.filterOptions}>
        <label className={styles.filterOption}>
          <input
            type="checkbox"
            checked={contentFilters.intimate}
            onChange={() => handleFilterToggle('intimate')}
          />
          <FaHeart className={styles.filterIcon} />
          <span>Intimate/Romantic Scenes</span>
        </label>
        
        <label className={styles.filterOption}>
          <input
            type="checkbox"
            checked={contentFilters.violence}
            onChange={() => handleFilterToggle('violence')}
          />
          <FaFistRaised className={styles.filterIcon} />
          <span>Violence/Fighting Scenes</span>
        </label>
        
        <label className={styles.filterOption}>
          <input
            type="checkbox"
            checked={contentFilters.language}
            onChange={() => handleFilterToggle('language')}
          />
          <FaCommentSlash className={styles.filterIcon} />
          <span>Strong Language</span>
        </label>
      </div>
      
      <button 
        className={styles.closeSettings}
        onClick={() => setShowFilterSettings(false)}
      >
        Done
      </button>
    </div>
  );

  if (!familySafeMode) {
    return null;
  }

  // Show filter settings
  if (showFilterSettings) {
    return (
      <div className={styles.sceneSkipperContainer}>
        <FilterSettings />
      </div>
    );
  }

  // Show skip notification for active scene
  if (currentScene && userDecision !== 'watch') {
    return (
      <div className={styles.sceneSkipperContainer}>
        <div className={styles.skipNotification}>
          <div className={styles.skipHeader}>
            <div className={styles.sceneType}>
              {getSceneIcon(currentScene.type)}
              <span>{currentScene.type.toUpperCase()}</span>
            </div>
            <div 
              className={styles.severityIndicator}
              style={{ backgroundColor: getSeverityColor(currentScene.severity) }}
            >
              {currentScene.severity}
            </div>
          </div>
          
          <div className={styles.skipContent}>
            <p className={styles.sceneDescription}>
              {currentScene.description}
            </p>
            
            <div className={styles.skipActions}>
              <button 
                className={styles.skipButton}
                onClick={handleSkipScene}
              >
                <BsSkipForward />
                {userDecision ? 'Skipped' : `Auto Skip (${skipCountdown}s)`}
              </button>
              
              <button 
                className={styles.watchButton}
                onClick={handleWatchScene}
              >
                <BsEye />
                Watch Anyway
              </button>
            </div>
          </div>
          
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${((5 - skipCountdown) / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show settings button when family mode is on but no active scene
  return (
    <div className={styles.familyModeIndicator}>
      <button 
        className={styles.settingsButton}
        onClick={() => setShowFilterSettings(true)}
      >
        <BsGear />
        <span>Content Filters</span>
      </button>
    </div>
  );
};
