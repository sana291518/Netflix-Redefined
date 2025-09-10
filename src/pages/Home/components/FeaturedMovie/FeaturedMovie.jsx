import { BsPlayFill, BsPlus } from "react-icons/bs";

import { getFullYear } from "../../../../utils/getFullYear";
import { getGenres } from "../../../../utils/getGenres";

import styles from "./styles.module.css";

export const FeaturedMovie = ({
  id,
  name,
  vote_average,
  number_of_seasons,
  first_air_date,
  backdrop_path,
  overview,
  genres,
}) => {
  const handleWatch = () => {
    // Navigate to video player with scene-skipping capability
    window.location.href = `/watch/${id}`;
  };

  return (
    <section
      className={styles.featured}
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop_path})`,
      }}
    >
      <div className={styles.featuredVertical}>
        <div className={styles.featuredHorizontal}>
          <div className={styles.featuredName}>{name}</div>

          <div className={styles.featuredInfo}>
            <div className={styles.featuredPoints}>
            
            </div>

            <div className={styles.featuredYear}>{getFullYear(first_air_date)}</div>

            <div className={styles.featuredSeasons}>
              {number_of_seasons} season{number_of_seasons > 1 ? "s" : ""}
            </div>
          </div>

          <div className={styles.featuredDescription}>{overview}</div>

          <div className={styles.featuredButtons}>
            <button 
              onClick={handleWatch} 
              className={styles.featuredWatchButton}
            >
              <div className={styles.featuredButton}>
                <BsPlayFill />
                <span>Watch</span>
              </div>
            </button>

            <a href={`/list/${id}`} className={styles.featuredMyListButton}>
              <div className={styles.featuredButton}>
                <BsPlus />
                <span>My List</span>
              </div>
            </a>
          </div>

          <div className={styles.featuredGenres}>
            <strong>Genres:</strong> {getGenres(genres)}
          </div>
        </div>
      </div>
    </section>
  );
};
