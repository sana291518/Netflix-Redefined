import { MaturityLevel } from "../MaturityLevel";
import { Show } from "../../../../directives/Show";

import { useAbout } from "./hooks/useAbout";

import styles from "./styles.module.css";

export const About = ({
  crew,
  cast,
  title,
  genres,
  companies,
  contentRatings,
}) => {
  const { directors, writers } = useAbout({ crew });

  return (
    <div className={styles.aboutWrapper}>
      <div className={styles.aboutHeader}>
        <h3>
          About <strong>{title}</strong>
        </h3>
      </div>

      <div className={styles.aboutContainer}>
        <Show when={directors.length > 0}>
          <div className={styles.item}>
            <span className={styles.label}>Direction: </span>

            <span className={styles.tag}>
              {directors.map(({ name }) => name).join(", ")}
            </span>
          </div>
        </Show>

        <Show when={cast.length > 0}>
          <div className={styles.item}>
            <span className={styles.label}>Cast: </span>

            <span className={styles.tag}>
              {cast.map(({ name }) => name).join(", ")}
            </span>
          </div>
        </Show>

        <Show when={writers.length > 0}>
          <div className={styles.item}>
            <span className={styles.label}>Screenplay: </span>

            <span className={styles.tags}>
              {writers.map(({ name }) => name).join(", ")}
            </span>
          </div>
        </Show>

        <Show when={genres.length > 0}>
          <div className={styles.item}>
            <span className={styles.label}>Genres: </span>

            <span className={styles.tag}>
              {genres.map(({ name }) => name).join(", ")}
            </span>
          </div>
        </Show>

        <Show when={companies.length > 0}>
          <div className={styles.item}>
            <span className={styles.label}>Production Companies: </span>

            <span className={styles.tag}>
              {companies.map(({ name }) => name).join(", ")}
            </span>
          </div>
        </Show>

        <div className={`${styles.item} ${styles.maturity}`}>
          <span className={styles.label}>Age Rating: </span>
          <MaturityLevel ratings={contentRatings} />
        </div>
      </div>
    </div>
  );
};
