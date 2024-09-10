/*
 * index.js - ${description}
 *
 * (c) 2024 St. Jude Children's Research Hospital
 *
 * Written by Ziang Zhang <ZIANG.ZHANG@STJUDE.ORG>
 *
 * The code is licensed under the GNU GPLv3 license.
 * Fri Sep 06 2024
=========================================================
* Based on Material Dashboard 2  React - v2.2.0
=========================================================

*/
import ColorArray from "components/ColorArray";

function configs(datasets) {
  return {
    labels: datasets.labels,
    datasets: datasets.datasets.map((dataset, index) => {
      return {
        label: dataset.label,
        data: dataset.data,
        tension: 0.4,
        borderWidth: 0,
        borderRadius: 4,
        borderSkipped: false,
        pointBackgroundColor: ColorArray[index],
        backgroundColor: ColorArray[index],
        maxBarThickness: 6,
      };
    }),
  };
}
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
    },
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
};

export { configs, options };
