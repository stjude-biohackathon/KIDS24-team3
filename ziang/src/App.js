/* *                             :---:                          
 *                          =#######=                        
 *                         *##########-                      
 *                        :############.                     
 *                        =###########=                      
 *                         +########+                        
 *                        :*#######*:                        
 *                        #######+.                          
 *                       =########+                          
 *                       +##*--=+##:  :===                   
 *                       +##**#####*+###*-                   
 *                       +############=          :.          
 *                 .:-==++++++=====++++++==-:.   ..          
 *           .::---:.                      ..:--::.          
 *          .                                      .         
*
=========================================================
* Based on Material Dashboard 2 React - v2.2.0
=========================================================
*/

import { useState, useEffect, useMemo, useRef, useContext } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
//import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
//import themeDarkRTL from "assets/theme-dark/theme-rtl";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/serverlogo48.png";
import brandDark from "assets/images/serverlogo48mono.png";
//import brandWhite from "assets/images/logo-ct.png";
//import brandDark from "assets/images/logo-ct-dark.png";

import "./App.css";
import { GlobalRefreshProvider, GlobalRefreshContext } from "components/GlobalRefresh";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  //const [onMouseEnter, setOnMouseEnter] = useState(false);
  ////const [rtlCache, setRtlCache] = useState(null);
  //const { pathname } = useLocation();

  //// Open sidenav when mouse enter on mini sidenav
  //const handleOnMouseEnter = () => {
  //  if (miniSidenav && !onMouseEnter) {
  //    setMiniSidenav(dispatch, false);
  //    setOnMouseEnter(true);
  //  }
  //};

  //// Close sidenav when mouse leave mini sidenav
  //const handleOnMouseLeave = () => {
  //  if (onMouseEnter) {
  //    setMiniSidenav(dispatch, true);
  //    setOnMouseEnter(false);
  //  }
  //};

  // Setting page scroll to 0 when changing the route
  //useEffect(() => {
  //  document.documentElement.scrollTop = 0;
  //  document.scrollingElement.scrollTop = 0;
  //}, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  function ConfigsButton() {
    const { refreshKey, refreshData } = useContext(GlobalRefreshContext);
    return (
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="3.25rem"
        height="3.25rem"
        bgColor="white"
        shadow="sm"
        borderRadius="50%"
        position="fixed"
        right="2rem"
        bottom="2rem"
        zIndex={99}
        color="dark"
        sx={{ cursor: "pointer" }}
        onClick={refreshData}
      >
        <Icon fontSize="small" color="inherit">
          refresh
        </Icon>
      </MDBox>
    );
  }

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <GlobalRefreshProvider>
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="St. Jude HPC Usage"
              routes={routes}
            />
            <Configurator />
            <ConfigsButton />
          </>
        )}
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/adminview" />} />
        </Routes>
      </GlobalRefreshProvider>
    </ThemeProvider>
  );
}
