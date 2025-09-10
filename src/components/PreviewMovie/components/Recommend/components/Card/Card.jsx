import { Show } from "../../../../../../directives/Show";
import { Hide } from "../../../../../../directives/Hide";

import { CircularProgress } from "../../../../../Loading/CircularProgress";
import { useCard } from "./hooks/useCard";

import { BsPlus } from "react-icons/bs";
import BackError from "../../../../../../assets/error-back.png";

import { ReactComponent as Player } from "../../../../../../assets/icons/player.svg";
import { getFullYear } from "../../../../../../utils/getFullYear";

import styles from "./styles.module.css";
import PropTypes from "prop-types";
export const Card = ({ item, idParent }) => {
  const { onHandlePreview, onHideLoading, isLoading } = useCard();

  return (
    <div
      role="card"
      className={styles.simpleCard}
      onClick={() => item.id !== idParent && onHandlePreview(item)}
      style={{
        cursor: item.id === idParent ? "not-allowed" : "pointer",
      }}
    >
      <div className={styles.simpleImageWrapper}>
        <Show when={!!item.backdrop_path}>
          <Hide when={!isLoading}>
            <div className={styles.loading}>
              <CircularProgress />
            </div>
          </Hide>

          <img
            style={!isLoading ? {} : { display: "none" }}
            src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
            onLoad={onHideLoading}
            alt={item.title}
          />
        </Show>

        <Hide when={!!item.backdrop_path}>
          <img src={BackError} alt={item.title} className={styles.img} />
        </Hide>

        <div className={styles.icon}>
          <Player />
        </div>

        <Show when={!!item.date}>
          <span>{getFullYear(item.date)}</span>
        </Show>
      </div>

      <div className={styles.simpleInfo}>
        <div className={styles.simpleHeader}>
          <div>
            <div className={styles.relevance}>
            
            </div>

            <div className={styles.title}>{item.title}</div>
          </div>

          <button className={styles.addList}>
            <BsPlus />
            <span>Add to My List</span>
          </button>
        </div>

        <div className={styles.simpleDetails}>
          <Show when={!!item.overview}>
            <p>{item.overview}</p>
          </Show>

          <Hide when={!!item.overview}>
            <p>Oops... The title in question does not have a description.</p>
          </Hide>
        </div>
      </div>
    </div>
  );
};
Card.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    vote_average: PropTypes.number,
    title: PropTypes.string,
    backdrop_path: PropTypes.string,
    media_type: PropTypes.string,
    date: PropTypes.string,
    overview: PropTypes.string,
  }).isRequired,
  idParent: PropTypes.number.isRequired,
};