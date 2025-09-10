import { getGenres } from "../../../../utils/getGenres";

export const Genres = ({ list }) => {
  return (
    <div>
      <span>Genres: </span>
      <span>{getGenres(list)}</span>
    </div>
  );
};
