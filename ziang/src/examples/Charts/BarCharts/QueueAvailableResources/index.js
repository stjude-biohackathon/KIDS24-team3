/*
 * Created on Thu Sep 05 2024
 *
 * Copyright (c) 2024 St. Jude Children"s Research Hospital
 *
 * High Performance Computing Center
 *
 * Ziang Zhang
 *
 *                             :---:                          
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
 *
=========================================================
* Based on Material Dashboard 2  React - v2.2.0
=========================================================
*/

import { useState, useEffect, useRef, useContext } from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Bar } from "react-chartjs-2";
import { Grid, CircularProgress } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { GlobalRefreshContext } from "components/GlobalRefresh";
import { fetchData } from "components/Datasource";
// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// ReportsBarChart configurations
import { configs, options } from "examples/Charts/BarCharts/ReportsBarChart/configs";

// enable legend
ChartJS.register(CategoryScale, LinearScale, LogarithmicScale, BarElement, Title, Tooltip, Legend);

function ReportsBarChart({ color, title, description }) {
  //date, chart }) {
  //const { data, options } = configs(chart.labels || [], chart.datasets || {});
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const lastUpdate = useRef("null");
  var refreshKey = useContext(GlobalRefreshContext);
  useEffect(() => {
    fetchData("lsf/latestBatch?col=queue_load").then((queueLoad) => {
      fetchData("lsf/latestBatch?col=queue_config")
        .then((queueConfig) => {
          var labels = queueLoad.map((el) => el.metadata.name);
          var datasets = queueConfig.map((el) => {
            return {
              label: el.queue,
              data: queueLoad.map((el2) => el2[el.queue]),
            };
          });
          var data = configs(labels, datasets);
          setData(data);
          setLoading(false);
          lastUpdate.current = new Date().toLocaleString();
        })
        .catch((error) => {
          console.error("Error fetching data", error);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data", error);
          setLoading(false);
        });
    });
  }, [refreshKey]);

  return (
    <Card sx={{ height: "21rem" }}>
      <MDBox padding="1rem">
        <MDBox
          variant="gradient"
          bgColor={color}
          borderRadius="lg"
          coloredShadow={color}
          py={2}
          pr={0.5}
          mt={-2}
          height="18.5rem"
        >
          {loading && (
            <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress color="inherit" />
            </MDBox>
          )}
          {!loading && <Bar data={data} options={options} redraw />}
        </MDBox>
        <MDBox pt={1} pb={1} px={1}>
          <MDTypography variant="h6" textTransform="capitalize">
            {title}
          </MDTypography>
          <MDTypography component="div" variant="button" color="text" fontWeight="light">
            {description}
          </MDTypography>
          <Divider />
          <MDBox display="flex" alignItems="center">
            <MDTypography variant="button" color="text" lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
              <Icon>schedule</Icon>
            </MDTypography>
            <MDTypography variant="button" color="text" fontWeight="light">
              {`last update: ${lastUpdate.current}`}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of ReportsBarChart
ReportsBarChart.defaultProps = {
  color: "info",
  description: "",
};

// Typechecking props for the ReportsBarChart
ReportsBarChart.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  //apiUrl: PropTypes.string.isRequired,
  //process: PropTypes.func.isRequired,
};

export default ReportsBarChart;
