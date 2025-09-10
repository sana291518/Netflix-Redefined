import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import styles from './HeartPulse.module.css';

export const HeartPulse = ({ isVisible, movieData, onAppreciation }) => {
  const [intensity, setIntensity] = useState(0);
  const [isGlowing, setIsGlowing] = useState(false);
  const [showMessage, setShowMessage] = useState('');

  const handleHeartClick = () => {
    const newIntensity = Math.min(intensity + 1, 3);
    setIntensity(newIntensity);
    setIsGlowing(true);

    // Messages that appreciate the user's taste and choices
    const messages = [
      '', 
      'excellent choice', 
      'your taste is impeccable', 
      'clearly a favorite'
    ];
    setShowMessage(messages[newIntensity]);

    // Save appreciation
    onAppreciation && onAppreciation({
      movieId: movieData.id,
      intensity: newIntensity,
      timestamp: Date.now()
    });

    // Reset glow
    setTimeout(() => setIsGlowing(false), 300);
    
    // Hide message
    setTimeout(() => setShowMessage(''), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.pulseContainer}>
      <div className={styles.movieTitle}>
        <h2>{movieData?.title}</h2>
        <p>How much did you enjoy this?</p>
      </div>

      {showMessage && (
        <div className={styles.vibeMessage}>
          {showMessage}
        </div>
      )}

      <div 
        className={`${styles.heartZone} ${isGlowing ? styles.glowing : ''}`}
        onClick={handleHeartClick}
      >
        <FaHeart 
          className={`${styles.heart} ${styles[`intensity${intensity}`]}`}
        />
        <div className={styles.pulseRings}>
          {Array.from({ length: intensity }).map((_, i) => (
            <div 
              key={i}
              className={styles.pulseRing}
              style={{ 
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${1.5 + i * 0.3}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className={styles.instruction}>
        <p>tap to rate</p>
        <div className={styles.intensityDots}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div 
              key={i}
              className={`${styles.dot} ${i < intensity ? styles.active : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
