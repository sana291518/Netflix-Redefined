import { MovieRow } from "../../../../components/MovieRow";
import { usePreview } from "../../../../context/PreviewContext";

import styles from "./styles.module.css";

export const ListMovies = ({ list }) => {
  const { onUpdatePreview } = usePreview();

  return (
    <section className={styles.container}>
      {list.map(({ slug, title, items }) =>
        items.length > 0 ? (
          <MovieRow
            key={slug}
            title={title}
            onOpenDetails={onUpdatePreview}
            items={items}
          />
        ) : null
      )}
    </section>
  );
};
