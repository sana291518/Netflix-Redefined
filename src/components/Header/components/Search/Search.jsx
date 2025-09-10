import { useSearch } from "../../../../context/SearchContext";
import { Show } from "../../../../directives/Show";
import { Hide } from "../../../../directives/Hide";
import { BsX } from "react-icons/bs";
import { CgSearch } from "react-icons/cg";
import {
  setClearSearch,
  setToggleSearch,
} from "../../../../reducers/search/actions";
import styles from "./styles.module.css";

export const Search = () => {
  const { debounceOnChange, dispatch, openSearchBox, query } = useSearch();
  
  const handleOpenSearch = () => {
    dispatch(setToggleSearch(true));
  };

  const handleCloseSearch = () => {
    dispatch(setClearSearch());
  };

  return (
    <div className={styles.searchContainer}>
      <Show when={openSearchBox}>
        <div className={styles.searchInput}>
          <CgSearch size={18} className={styles.searchIcon} />
          
          <input
            type="text"
            onChange={debounceOnChange}
            placeholder="Titles, people, genres"
            autoFocus
            defaultValue={query}
            className={styles.searchField}
          />
          
          <button
            className={styles.closeButton}
            onClick={handleCloseSearch}
            aria-label="Close search"
          >
            <BsX size={22} />
          </button>
        </div>
      </Show>

      <Hide when={openSearchBox}>
        <button 
          className={styles.searchIconButton}
          onClick={handleOpenSearch}
          aria-label="Search movies and TV shows"
        >
          <CgSearch size={18} />
        </button>
      </Hide>
    </div>
  );
};
