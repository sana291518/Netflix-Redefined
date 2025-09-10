import { Show } from "../../../../directives/Show";

import { Card } from "./components/Card";
import { NoResults } from "./components/NoResults";

import styles from "./styles.module.css";
import PropTypes from "prop-types";

export const Recommend = ({
  id,
  list,
  label,
  title,
  showNoResults = false,
}) => {
  return (
    <div className={styles.recommend}>
      <div className={styles.recommendContentHead}>
        <p>{label}</p>
      </div>

      <div className={styles.recommendContentList}>
        <Show when={list.length > 0}>
          <div>
            {list.map((value) => (
              <Card key={value.id} idParent={id} item={value} />
            ))}
          </div>
        </Show>

        <Show when={list.length === 0 && showNoResults}>
          <NoResults title={title} />
        </Show>
      </div>
    </div>
  );
};
Recommend.propTypes = {
  id: PropTypes.number.isRequired,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      date: PropTypes.string,
      title: PropTypes.string,
      media_type: PropTypes.string,
      vote_average: PropTypes.number,
      overview: PropTypes.string,
      backdrop_path: PropTypes.string,
    })
  ).isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string,
  showNoResults: PropTypes.bool,
};