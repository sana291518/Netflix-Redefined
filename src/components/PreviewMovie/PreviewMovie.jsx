import { Hide } from "../../directives/Hide";
import { Show } from "../../directives/Show";

import { About } from "./components/About";
import { Media } from "./components/Media";
import { Season } from "./components/Season";

import { Genres } from "./components/Genres";
import { Status } from "./components/Status";
import { Recommend } from "./components/Recommend";

import { MaturityLevel } from "./components/MaturityLevel";
import { ProductionCompanies } from "./components/ProductionCompanies";

import { CgClose } from "react-icons/cg";
import { BiDislike, BiLike } from "react-icons/bi";
import { BsPlayFill, BsPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai"; 

import { ReactComponent as SoundOn } from "../../assets/icons/sound-on.svg";
import { ReactComponent as SoundOff } from "../../assets/icons/sound-off.svg";

import { usePreviewMovie } from "./hooks/usePreviewMovie";
import { getFullYear } from "../../utils/getFullYear";
import PropTypes from "prop-types";
import styles from "./styles.module.css";

export const PreviewMovie = (item) => {
  const {
    id,
    cast,
    date,
    title,
    season,
    status,
    duration,
    recommends,
    backdrop_path,
    contentRatings,
    number_of_seasons,
    production_companies,
    vote_average,
    openedSearch,
    collection,
    overview,
    videoId,
    genres,
    crew,
  } = item;

  const { visibleModal, onClose, soundReleased, onHandleSound, overviewEl } =
    usePreviewMovie({ openedSearch });

  
  const handleWatch = () => {
    
    window.location.href = `/watch/${id}`;
  };

  return (
    <Show when={visibleModal}>
      <div
        className={styles.previewMovie}
        role="dialog-preview"
        onClick={onClose}
      >
        <div
          className={styles.previewMovieModal}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.previewMovieHeader}>
            <div className={styles.previewMovieBackdrop}>
              <Media
                title={title}
                videoId={videoId}
                backdropPath={backdrop_path}
                soundReleased={soundReleased}
              />

              <div className={styles.background}>
                <div className={styles.previewMovieGeneral}>
                  <div className={styles.previewMovieTitle}>
                    <div>{title}</div>
                    <span>{title}</span>
                  </div>

                  <div className={styles.previewMovieOptions}>
                    {/* Enhanced Watch Button */}
                    <button 
                      className={styles.previewMovieWatch}
                      onClick={handleWatch}
                    >
                      <div className={styles.previewMovieWhatchButton}>
                        <BsPlayFill />
                        <span>Watch</span>
                      </div>
                    </button>

                    <button className={styles.previewMovieAddList}>
                      <BsPlus />
                      <span>Add to My List</span>
                    </button>

                    {/* Enhanced Reaction Buttons */}
                    <button className={styles.previewMovieLike}>
                      <BiLike />
                      <span>Like</span>
                    </button>

                    <button className={styles.previewMovieDislike}>
                      <BiDislike />
                      <span>Not for Me</span>
                    </button>

                    {/* New Love Reaction */}
                    <button className={styles.previewMovieLove}>
                      <AiOutlineHeart />
                      <span>Love</span>
                    </button>
                  </div>
                </div>

                <div className={styles.previewMovieClose}>
                  <button onClick={onClose}>
                    <CgClose />
                  </button>
                </div>

                <div className={styles.previewMovieSound}>
                  <button onClick={onHandleSound} role="sound-button">
                    <Show when={soundReleased}>
                      <SoundOn role="sound-on" />
                    </Show>

                    <Hide when={soundReleased}>
                      <SoundOff role="sound-off" />
                    </Hide>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.previewMovieBody}>
            <div className={styles.previewMovieBodyContent}>
              <div className={styles.previewMovieBodyDetails}>
                <div className={styles.previewMovieBodyDetailsLeft}>
                  <div>
                    <div className={styles.tagsRelevance}>
          
                    </div>

                    <Show when={!!date}>
                      <div className={styles.tagsYear}>
                        {getFullYear(date)}
                      </div>
                    </Show>

                    <MaturityLevel ratings={contentRatings} />
                    <div className={styles.tagsDuration}>{duration}</div>
                  </div>

                  <Show when={!!overview}>
                    <div className={styles.overview}>
                      <input type="checkbox" id="show-less" name="show-less" />
                      <label htmlFor="show-less" />

                      <p ref={overviewEl}>{overview}</p>
                    </div>
                  </Show>

                  <Hide when={!!overview}>
                    <p>{title} has no synopsis available.</p>
                  </Hide>
                </div>

                <div className={styles.previewMovieBodyDetailsRight}>
                  <ProductionCompanies companies={production_companies} />
                  <Genres list={genres} />
                  <Status status={status} />
                </div>
              </div>

              <Show when={!!season}>
                {() => (
                  <Season
                    id={id}
                    episodes={season.episodes}
                    numberOfSeasons={number_of_seasons}
                  />
                )}
              </Show>

              <Show when={!!collection}>
                {() => (
                  <Recommend
                    id={id}
                    label={collection.name}
                    list={collection.parts}
                  />
                )}
              </Show>

              <Show when={!!recommends}>
                {() => (
                  <Recommend
                    id={id}
                    list={recommends}
                    label="Similar Titles"
                    showNoResults={true}
                    title={title}
                  />
                )}
              </Show>

              <About
                crew={crew}
                cast={cast}
                title={title}
                genres={genres}
                contentRatings={contentRatings}
                companies={production_companies}
              />
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};
PreviewMovie.propTypes = {
  id: PropTypes.number.isRequired,
  cast: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  crew: PropTypes.arrayOf(
    PropTypes.shape({
      job: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  date: PropTypes.string,
  season: PropTypes.shape({
    id: PropTypes.number.isRequired,
    episodes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        runtime: PropTypes.number,
        air_date: PropTypes.string.isRequired,
        overview: PropTypes.string.isRequired,
        still_path: PropTypes.string.isRequired,
        vote_average: PropTypes.number.isRequired,
        episode_number: PropTypes.number.isRequired,
      })
    ).isRequired,
    numberOfSeasons: PropTypes.number,
  }).isRequired,
  status: PropTypes.string.isRequired,
  title: PropTypes.string,
  duration: PropTypes.string.isRequired,
  recommends: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      date: PropTypes.string,
      title: PropTypes.string,
      media_type: PropTypes.string,
      vote_average: PropTypes.number.isRequired,
      overview: PropTypes.string,
      backdrop_path: PropTypes.string,
    })
  ).isRequired,
  vote_average: PropTypes.number.isRequired,
  openedSearch: PropTypes.bool,
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  contentRatings: PropTypes.string.isRequired,
  collection: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    parts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        date: PropTypes.string,
        title: PropTypes.string,
        media_type: PropTypes.string,
        vote_average: PropTypes.number.isRequired,
        overview: PropTypes.string,
        backdrop_path: PropTypes.string,
      })
    ).isRequired,
  }),
  overview: PropTypes.string,
  videoId: PropTypes.string,
  number_of_seasons: PropTypes.number,
  backdrop_path: PropTypes.string,
  production_companies: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};
