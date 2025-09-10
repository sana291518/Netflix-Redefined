import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import PropTypes from "prop-types";
export const DefaultLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};