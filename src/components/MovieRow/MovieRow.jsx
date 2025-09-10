import { Card } from "../Card";
import PropTypes from "prop-types";
import { HiChevronRight } from "react-icons/hi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { useMovieRow } from "./hooks/useMovieRow";

import styles from "./styles.module.css";

export const MovieRow = ({ title, onOpenDetails, items }) => {
  const { scrollX, handleLeftArrow, handleRightArrow } = useMovieRow({ items });

  return (
    <div className={styles.movieRow}>
      <div className={styles.movieRowHeader}>
        <div className={styles.movieRowTitle}>
          <h2>{title}</h2>

          <div className={styles.movieRowMore}>
            <HiChevronRight />
            <span>See all</span>
          </div>
        </div>
      </div>

      <div
        className={styles.movieRowLeft}
        onClick={handleLeftArrow}
        role="left-button"
      >
        <FiChevronLeft style={{ fontSize: 50 }} />
      </div>

      <div
        className={styles.movieRowRight}
        onClick={handleRightArrow}
        role="right-button"
      >
        <FiChevronRight style={{ fontSize: 50 }} />
      </div>

      <div className={styles.movieRowListArea}>
        <div
          className={styles.movieRowList}
          style={{
            marginLeft: scrollX,
            width: items.length * 200,
          }}
        >
          {items.map((item, index) => (
            <Card
              key={`${item.id}_${index}`}
              poster_path={item.poster_path}
              onClick={() => onOpenDetails(item)}
              title={item.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
MovieRow.propTypes = {
  title: PropTypes.string.isRequired,
  onOpenDetails: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      title: PropTypes.string,
      overview: PropTypes.string.isRequired,
      media_type: PropTypes.string,
      poster_path: PropTypes.string.isRequired,
    })
  ).isRequired,
};