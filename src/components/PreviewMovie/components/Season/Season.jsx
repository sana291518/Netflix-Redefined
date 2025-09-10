import { Show } from "../../../../directives/Show";
import { Hide } from "../../../../directives/Hide";

import { Card } from "./components/Card";
import { Skeleton } from "./components/Skeleton";

import { useSeason } from "./hooks/useSeason";

import styles from "./styles.module.css";
import PropTypes from "prop-types";

export const Season = ({ id, episodes, numberOfSeasons }) => {
  const { episodesSeason, isLoading, numberSeason, handleSeason } = useSeason({
    episodes,
    id,
  });

  return (
    <div className={styles.season}>
      <div className={styles.seasonContentHead}>
        <p>Episodes</p>

        <Show when={!!numberOfSeasons && numberOfSeasons > 1}>
          <select
            role="combobox"
            onChange={(e) => handleSeason(Number(e.target.value))}
          >
            {new Array(numberOfSeasons).fill("").map((_item, index) => (
              <option key={index} value={index + 1}>
                Season {index + 1}
              </option>
            ))}
          </select>
        </Show>
      </div>

      <div className={styles.seasonContentList}>
        <Show when={isLoading && !!numberSeason}>
          {new Array(episodes.length).fill("").map((_, index) => (
            <Skeleton key={index} />
          ))}
        </Show>

        <Hide when={isLoading && !!numberSeason}>
          <Show when={episodesSeason.length > 0}>
            {episodesSeason.map((value) => (
              <Card key={value.id} item={value} />
            ))}
          </Show>

          <Hide when={episodesSeason.length > 0}>
            <span>
              Oops... Unfortunately, we couldn't find episodes for this season.
            </span>
          </Hide>
        </Hide>
      </div>
    </div>
  );
};
Season.propTypes = {
  id: PropTypes.number.isRequired,
  episodes: PropTypes.arrayOf(
    PropTypes.shape({
      air_date: PropTypes.string,
      episode_number: PropTypes.number,
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      overview: PropTypes.string,
      runtime: PropTypes.number,
      still_path: PropTypes.string,
      vote_average: PropTypes.number,
    })
  ).isRequired,
  numberOfSeasons: PropTypes.number.isRequired,
};