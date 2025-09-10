import PropTypes from "prop-types";

export const cardPropTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  poster_path: PropTypes.string,
};
