/**
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

=========================================================
* Based On Material Dashboard 2 React - v2.2.0
=========================================================
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import RadarChart from "examples/Charts/RadarChart";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import QueueAvailableResources from "examples/Charts/BarCharts/QueueAvailableResources";
import { fetchData } from "components/Datasource";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import { useRef, useEffect, useState, useContext } from "react";
import { GlobalRefreshContext } from "components/GlobalRefresh";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [hostLoad, setHostLoad] = useState([]);
  const [loading, setLoading] = useState(true);
  const hostConfigRef = useRef(null);
  const { refreshKey } = useContext(GlobalRefreshContext);
  const running_jobs = useRef(0);
  const cpu_cores_allocated = useRef(0);
  const gpu_allocated = useRef(0);
  const cpu_total = useRef(0);
  const gpu_total = useRef(0);

  fetchData("lsf/latestBatch?col=host_config")
    .then((res) => {
      hostConfigRef.current = res;
      cpu_total.current = res.reduce((ac, el) => ac + el.cpu_cores, 0);
      gpu_total.current = res.reduce((ac, el) => ac + el.gpus, 0);
    })
    .catch((error) => {
      hostConfigRef.current = null;
      console.error("Error fetching data", error);
    });
  useEffect(() => {
    fetchData("lsf/latestBatch?col=host_load")
      .then((data) => {
        setHostLoad(data);
        setLoading(false);
        cpu_cores_allocated.current = data.reduce((ac, el) => ac + el.cpu_cores_allocated, 0);
        gpu_allocated.current = data.reduce((ac, el) => ac + el.gpu_allocated, 0);
        running_jobs.current = data.reduce((ac, el) => ac + el.running_jobs, 0);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
        setLoading(false);
      });
  }, [refreshKey]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Running Jobs"
                count={running_jobs.current}
                percentage={{
                  color: "success",
                  amount: "",
                  label: ")",
                }}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="CPU Cores Allocated"
                count={cpu_cores_allocated.current}
                percentage={{
                  color: "info",
                  amount: `${Math.round((cpu_cores_allocated.current / cpu_total.current) * 100)}%`,
                  label: `of total ${cpu_total.current}`,
                }}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="GPUs Allocated"
                count={gpu_allocated.current / 2}
                percentage={{
                  color: "info",
                  amount: `${Math.round((gpu_allocated.current / gpu_total.current) * 50)}%`,
                  label: `of total ${gpu_total.current}`,
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Job Submission"
                  description="Job Submitted to HPC"
                  apiUrl="lsf/job_count?timefield=submitTime&"
                  process={(data) => {
                    return {
                      labels: data.map((ele) => new Date(ele._id * 1000)),
                      datasets: [
                        {
                          label: "jobs submitted",
                          data: data.map((ele) => ele.count),
                        },
                      ],
                    };
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={8}>
              <MDBox mb={3}>
                <RadarChart
                  color="dark"
                  title="Normalized System Resources"
                  description="Queue resources normalized"
                  height="30rem"
                  apiUrl="lsf/queue_load"
                  process={(data) => {
                    var processedData = {
                      labels: data.map((ele) => ele.metadata.name),
                      datasets: [
                        {
                          label: "CPU Cores Allocated",
                          data: data.map((ele) => ele.cpu_cores_allocated),
                        },
                        {
                          label: "GPUs Allocated",
                          data: data.map((ele) => ele.gpu_allocated),
                        },
                        {
                          label: "Running Jobs",
                          data: data.map((ele) => ele.running_jobs),
                        },
                        {
                          label: "Pending Jobs",
                          data: data.map((ele) => ele.pending_jobs),
                        },
                        {
                          label: "Pending Cpu Cores",
                          data: data.map((ele) => ele.cpu_cores_pending),
                        },
                        //{
                        //  label: "Utilization(cpu)",
                        //  data: data.map((ele) => ele.cpu_ut),
                        //},
                        {
                          label: "Memory",
                          data: data.map((ele) => ele.jobs_mem),
                        },
                      ],
                    };
                    // normalize the data
                    processedData.datasets.forEach((dataset) => {
                      var max = Math.max(...dataset.data);
                      dataset.data = dataset.data.map((ele) => (ele / max) * 100);
                    });
                    return processedData;
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} lg={12}>
              <Projects />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
