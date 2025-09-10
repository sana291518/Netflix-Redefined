import { Show } from "../../../../../../directives/Show";
import BackError from "../../../../../../assets/error-back.png";

import styles from "./styles.module.css";

export const NoResults = ({ title }) => {
  return (
    <div className={styles.noRecommend}>
      <img src={BackError} alt={title ?? "No title"} />

      <div>
        <strong>Oops... Unfortunately, we couldn't find related titles</strong>

        <Show when={!!title}>
          <span>for: {title}</span>
        </Show>
      </div>
    </div>
  );
};
