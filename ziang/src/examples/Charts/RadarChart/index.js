/**
=========================================================
* Material Dashboard 2  React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useMemo, useState, useRef, useContext, useEffect } from "react";
import { GlobalRefreshContext } from "components/GlobalRefresh";
import { fetchData } from "components/Datasource";
import { Grid } from "@mui/material";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// RadarChart configurations
import { configs, options } from "examples/Charts/RadarChart/configs";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function RadarChart({ icon, title, description, height, apiUrl, process }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { refreshKey } = useContext(GlobalRefreshContext);
  useEffect(() => {
    fetchData(apiUrl)
      .then((response) => {
        const processedData = process(response);
        console.log("processedData: ", processedData);
        setData(configs(processedData));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [refreshKey]);

  const renderChart = (
    <MDBox py={2} pr={2} pl={icon.component ? 1 : 2}>
      <Grid container spacing={2} height="40rem">
        <Grid item xs={12} md={6} lg={10}>
          {!loading && <Radar data={data} options={options} redraw />}
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          {title && <MDTypography variant="h6">{title}</MDTypography>}
          <MDBox mb={2}>
            <MDTypography component="div" variant="button" color="text">
              {description}
            </MDTypography>
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}

// Setting default values for the props of RadarChart
RadarChart.defaultProps = {
  icon: { color: "info", component: "refresh" },
  title: "",
  description: "",
};

// Typechecking props for the RadarChart
RadarChart.propTypes = {
  icon: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "light",
      "dark",
    ]),
    component: PropTypes.node,
  }),
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  apiUrl: PropTypes.string.isRequired,
  process: PropTypes.func.isRequired,
};

export default RadarChart;
