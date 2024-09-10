import { createContext, useState } from "react";
const GlobalRefreshContext = createContext();
import { PropTypes } from "prop-types";

const GlobalRefreshProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };
  return (
    <GlobalRefreshContext.Provider value={{ refreshKey, refreshData }}>
      {children}
    </GlobalRefreshContext.Provider>
  );
};

GlobalRefreshProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { GlobalRefreshProvider, GlobalRefreshContext };
