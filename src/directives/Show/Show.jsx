import PropTypes from "prop-types";

export const Show = ({ when, children }) => {
  return when ? (
    <>{typeof children === "function" ? children() : children}</>
  ) : (
    <></>
  );
};

Show.propTypes = {
  when: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
};
