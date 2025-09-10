import React, { useState, useEffect } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { DefaultLayout } from '../../layout/DefaultLayout';
import { Show } from '../../directives/Show';
import { PreviewMovie } from '../../components/PreviewMovie';
import { CircularProgress } from '../../components/Loading/CircularProgress';
import { ListMovies } from './components/ListMovies';
import { QueryResults } from '../../components/QueryResults';
import { FeaturedMovie } from './components/FeaturedMovie';
import { SkeletonNetflix } from '../../components/Loading/SkeletonNetflix';
import { usePreview } from '../../context/PreviewContext';
import { useSearch } from '../../context/SearchContext';
import { useMovies } from './hooks/useMovies';
import PropTypes from 'prop-types';
import { TrellisChatbox } from '../../components/TrellisChatbox';

const PerfectTrellisButton = () => {
  // WORKING smooth pulse animation
  const pulseAnimation = useSpring({
    loop: true,
    to: [{ scale: 1.08, opacity: 0.9 }, { scale: 1, opacity: 1 }],
    from: { scale: 1, opacity: 1 },
    config: { duration: 1500, ...config.easeInOut },
  });

  // Gentle floating animation
  const floatAnimation = useSpring({
    loop: true,
    to: [{ translateY: -2 }, { translateY: 2 }],
    from: { translateY: 0 },
    config: { duration: 2500, ...config.gentle },
  });

  return (
    <animated.div
      style={{
        position: 'relative',
        width: '70px',
        height: '70px',
        ...pulseAnimation,
        ...floatAnimation,
      }}
    >
      <svg
        width="70"
        height="70"
        viewBox="0 0 70 70"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Beautiful red-black gradient bubble */}
          <radialGradient id="dreamBubble" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF4757" />
            <stop offset="60%" stopColor="#E50914" />
            <stop offset="100%" stopColor="#2c0e0f" />
          </radialGradient>
          
          {/* Enhanced glow filter */}
          <filter id="bubbleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#E50914" floodOpacity="0.8" />
          </filter>

          {/* Inner glow for depth */}
          <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FF4757" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Perfect gradient bubble */}
        <circle 
          cx="35" 
          cy="35" 
          r="32" 
          fill="url(#dreamBubble)" 
          filter="url(#bubbleGlow)"
        />

        {/* Inner highlight for 3D effect */}
        <circle 
          cx="35" 
          cy="32" 
          r="26" 
          fill="none" 
          stroke="rgba(255,255,255,0.15)" 
          strokeWidth="1"
        />

        {/* PERFECTLY ALIGNED T letter */}
        <text
          x="35"
          y="35"
          textAnchor="middle"
          fontSize="32"
          fontWeight="700"
          fontFamily="'Netflix Sans', 'Helvetica Neue', Arial, sans-serif"
          fill="#ffffff"
          dominantBaseline="central"
          filter="url(#innerGlow)"
        >
          T
        </text>
      </svg>
    </animated.div>
  );
};

export const Home = () => {
  const { previewMovie, isLoading: previewIsLoading, onUpdatePreview } = usePreview();
  const { openSearchBox } = useSearch();
  const { isEntryLoading, isLoading, featuredData, movieList } = useMovies({ previewMovie });

  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  const chatButtonAnimation = useSpring({
    opacity: introDone && !isChatboxOpen ? 1 : 0,
    transform: introDone && !isChatboxOpen ? 'translateY(0)' : 'translateY(20px)',
    config: { tension: 200, friction: 20 },
  });

  useEffect(() => {
    if (!isEntryLoading && !previewIsLoading && !isLoading) {
      setIntroDone(true);
    } else {
      setIntroDone(false);
    }
  }, [isEntryLoading, previewIsLoading, isLoading]);

  const toggleChatbox = () => {
    setIsChatboxOpen(prev => !prev);
  };

  return (
    <>
      <Show when={isEntryLoading}>
        <SkeletonNetflix />
      </Show>

      <Show when={!isLoading && !isEntryLoading}>
        <DefaultLayout>
          <Show when={!!featuredData}>
            <FeaturedMovie {...featuredData} />
          </Show>

          <Show when={movieList.length > 0}>
            <ListMovies list={movieList} />
          </Show>

          <Show when={!!previewMovie}>
            <PreviewMovie {...previewMovie} openedSearch={openSearchBox} />
          </Show>

          <QueryResults onOpenDetails={onUpdatePreview} />
        </DefaultLayout>
      </Show>

      <Show when={previewIsLoading || isLoading}>
        <CircularProgress fullScreen={true} />
      </Show>

      {/* Perfect Trellis button with animations */}
      <animated.div
        style={{
          ...chatButtonAnimation,
          position: 'fixed',
          bottom: 32,
          right: 32,
          cursor: 'pointer',
          zIndex: 1100,
        }}
        onClick={toggleChatbox}
      >
        <PerfectTrellisButton />
      </animated.div>

      <Show when={isChatboxOpen}>
        <TrellisChatbox onClose={toggleChatbox} />
      </Show>
    </>
  );
};

const ItemPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  title: PropTypes.string,
  overview: PropTypes.string.isRequired,
  media_type: PropTypes.string,
  poster_path: PropTypes.string.isRequired,
});

const GenresPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
});

Home.propTypes = {
  movieList: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(ItemPropType).isRequired,
    title: PropTypes.string.isRequired,
  }),
  featuredMovie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    genres: PropTypes.arrayOf(GenresPropType).isRequired,
    backdrop_path: PropTypes.string.isRequired,
    first_air_date: PropTypes.string.isRequired,
    number_of_seasons: PropTypes.number.isRequired,
    vote_average: PropTypes.number.isRequired,
    overview: PropTypes.string.isRequired,
    name: PropTypes.string,
  }),
  listMovie: PropTypes.shape({
    list: PropTypes.arrayOf(
      PropTypes.shape({
        slug: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(ItemPropType).isRequired,
        title: PropTypes.string.isRequired,
      })
    ).isRequired,
  }),
};
