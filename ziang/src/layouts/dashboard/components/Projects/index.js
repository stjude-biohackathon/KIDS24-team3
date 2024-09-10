/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useRef, useContext, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { fetchData } from "components/Datasource";

// Data

function Projects() {
  const [queueConfig, setQueueConfig] = useState([]);
  const [queueLoad, setQueueLoad] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData("lsf/queue_config").then((data) => {
      let queueConfig = {};
      data.forEach((item) => {
        queueConfig[item.queueName] = item;
      });
      console.log(queueConfig);
      fetchData("lsf/queue_load").then((data) => {
        setQueueLoad(
          data.map((item) => {
            item.queueName = item.metadata.name;
            item.cpus = queueConfig[item.queueName].cpu_cores;
            item.gpus = queueConfig[item.queueName].gpus;
            item.mem_total = queueConfig[item.queueName].mem;
            item.num_hosts = queueConfig[item.queueName].num_hosts;
            item.cpus_available = queueConfig[item.queueName].cpu_cores - item.cpu_cores_allocated;
            item.gpus_available = queueConfig[item.queueName].gpus - item.gpu_allocated;
            item.cpu_cores_ratio = item.cpu_cores_allocated / item.cpus;
            item.id = item.queueName;
            return item;
          })
        );
        setLoading(false);
      });
      setQueueConfig(queueConfig);
    });
  }, []);
  if (loading) {
    return (
      <Card>
        <MDBox p={2}>
          <MDTypography> Loading... </MDTypography>
        </MDBox>
      </Card>
    );
  }

  const columns = [
    { field: "queueName", headerName: "Queue", width: 200 },
    { field: "cpus", headerName: "CPU Cores", width: 200 },
    { field: "cpu_cores_allocated", headerName: "Used CPU Cores", width: 200 },
    { field: "gpus", headerName: "GPUs", width: 200 },
    { field: "gpu_allocated", headerName: "Used GPUs", width: 200 },
    { field: "running_jobs", headerName: "Jobs Running", width: 200 },
    { field: "pending_jobs", headerName: "Jobs Pending", width: 200 },
  ];
  return (
    <Card>
      <MDBox p={2}>
        <MDTypography variant="h5">Queue Available Resources</MDTypography>
      </MDBox>
      <DataGrid
        rows={queueLoad}
        columns={columns}
        pageSize={10}
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </Card>
  );
}

export default Projects;
