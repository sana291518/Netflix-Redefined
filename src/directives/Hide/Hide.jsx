import PropTypes from "prop-types";

export const Hide = ({ when, children }) => {
  return when ? (
    <></>
  ) : (
    <>{typeof children === "function" ? children() : children}</>
  );
};

Hide.propTypes = {
  when: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
};
