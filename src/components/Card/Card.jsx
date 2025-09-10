import { useState } from "react";
import { Show } from "../../directives/Show";
import { Hide } from "../../directives/Hide";
import { AiOutlinePicture } from "react-icons/ai";
import styles from "./styles.module.css";
import PropTypes from "prop-types";

export const Card = ({ title, poster_path, onClick }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={styles.cardContainer} role="button" onClick={onClick}>
      <Show when={poster_path != null}>
        <Show when={isLoading}>
          <div className={styles.skeleton} />
        </Show>

        <img
          style={!isLoading ? { display: "block" } : { display: "none" }}
          src={`https://image.tmdb.org/t/p/w300${poster_path}`}
          onLoad={() => setIsLoading(false)}
          alt={title}
          loading="eager"
        />
      </Show>

      <Hide when={poster_path != null}>
        <div className={styles.error}>
          <div>
            <p>{title ?? "Title not found..."}</p>
            <AiOutlinePicture />
          </div>
        </div>
      </Hide>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  poster_path: PropTypes.string,
};
