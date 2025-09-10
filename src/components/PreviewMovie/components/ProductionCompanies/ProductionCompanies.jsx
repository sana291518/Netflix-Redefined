import { Hide } from "../../../../directives/Hide";
import { Show } from "../../../../directives/Show";

import { getCompanies } from "../../../../utils/getCompanies";

export const ProductionCompanies = ({ companies }) => {
  return (
    <div>
      <span>Production Companies: </span>
      <span>
        <Show when={companies.length > 0}>{getCompanies(companies)}</Show>

        <Hide when={companies.length > 0}>
          Oops, it was not possible to find the production companies for this title.
        </Hide>
      </span>
    </div>
  );
};
