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

const timeScale2epoch = (timeScale) => {
  // returns start, end, and interval in epoch time
  var end = new Date();
  var endEpoch = Math.floor(end.getTime() / 1000);
  var startEpoch = 0;
  var interval = 0;
  var timeString = (dateObj) => {
    return dateObj.toLocaleString();
  };

  switch (timeScale) {
    case "hour": // scale 1 hour, interval 2 minute
      startEpoch = endEpoch - 3600;
      interval = 120;
      timeString = (dateObj) => {
        return dateObj.toLocaleTimeString();
      };
      break;
    case "day": // scale 1 day, interval 1 hour
      startEpoch = endEpoch - 86400;
      interval = 3600;
      timeString = (dateObj) => {
        return dateObj.toLocaleTimeString();
      };
      break;
    case "week": // scale 1 week, interval 1 day
      startEpoch = endEpoch - 604800;
      interval = 86400;
      timeString = (dateObj) => {
        var options = { weekday: "short", month: "short", day: "numeric" };
        var timestring = dateObj.toLocaleDateString(undefined, options);
        return timestring;
      };
      break;
    case "month": // scale 1 month, interval 1 day
      startEpoch = endEpoch - 2592000;
      interval = 86400;
      timeString = (dateObj) => {
        return dateObj.toLocaleDateString();
      };
      break;
    case "year": // scale 1 year, interval 1 month
      startEpoch = endEpoch - 31536000;
      interval = 2592000;
      timeString = (dateObj) => {
        return dateObj.toLocaleDateString();
      };
      break;
    default: // scale 1 day, interval 1 hour
      startEpoch = endEpoch - 86400;
      interval = 3600;
  }
  return { start: startEpoch, end: endEpoch, interval: interval, timeString: timeString };
};
function ReportsBarChart({ color, title, description, apiUrl, process }) {
  //date, chart }) {
  //const { data, options } = configs(chart.labels || [], chart.datasets || {});
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeScale, setTimeScale] = useState("week");
  const lastUpdate = useRef("null");
  const timeFunction = useRef((dateObj) => {
    dateObj.toLocaleString();
  });
  var refreshKey = useContext(GlobalRefreshContext);
  useEffect(() => {
    var { start, end, interval, timeString } = timeScale2epoch(timeScale);
    var url = apiUrl + `start=${start}&end=${end}&interval=${interval}`;
    timeFunction.current = timeString;
    setLoading(true);
    fetchData(url)
      .then((data) => {
        data = process(data);
        data = configs(data.labels, data.datasets, timeFunction.current, 0);
        apiUrl = "lsf/job_count?timefield=startTime&";
        fetchData(apiUrl + `start=${start}&end=${end}&interval=${interval}`)
          .then((raw) => {
            var processed = process(raw);
            var dataset = processed.datasets[0];
            dataset.label = "jobs disbatched";
            var pdataset = configs(processed.labels, [dataset], timeFunction.current, 2);
            data.datasets.push(pdataset.datasets[0]);
            setData(data);
            setLoading(false);
            lastUpdate.current = new Date().toLocaleString();
          })
          .catch((error) => {
            console.error("Error fetching job count data: ", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [timeScale, refreshKey]);

  return (
    <Card sx={{ height: "41rem" }}>
      <MDBox padding="1rem">
        <MDBox
          variant="gradient"
          bgColor={color}
          borderRadius="lg"
          coloredShadow={color}
          py={2}
          pr={0.5}
          mt={-5}
          height="32.5rem"
        >
          {loading && (
            <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress color="inherit" />
            </MDBox>
          )}
          {!loading && <Bar data={data} options={options} redraw />}
        </MDBox>
        <MDBox pt={1} pb={1} px={1}>
          <Grid container justifyContent="flex-end">
            <MDButton
              size="small"
              variant={timeScale === "hour" ? "outlined" : "text"}
              color="info"
              onClick={() => setTimeScale("hour")}
            >
              Hour
            </MDButton>
            <MDButton
              size="small"
              variant={timeScale === "day" ? "outlined" : "text"}
              color="info"
              onClick={() => setTimeScale("day")}
            >
              Day
            </MDButton>
            <MDButton
              size="small"
              variant={timeScale === "week" ? "outlined" : "text"}
              color="info"
              onClick={() => setTimeScale("week")}
            >
              Week
            </MDButton>
            <MDButton
              size="small"
              variant={timeScale === "month" ? "outlined" : "text"}
              color="info"
              onClick={() => setTimeScale("month")}
            >
              Month
            </MDButton>
          </Grid>
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
  apiUrl: PropTypes.string.isRequired,
  process: PropTypes.func.isRequired,
};

export default ReportsBarChart;
