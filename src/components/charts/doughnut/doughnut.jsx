"use client";
// src/PieChart.tsx

import React from "react";
import { Doughnut } from "react-chartjs-2";

//register the elements for the Doughnut Chart. More info here: https://www.chartjs.org/docs/latest/getting-started/integration.html
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
ChartJS.register(ArcElement, Tooltip);

const DoughnutChart = ({
  xValues,
  yValues,
  label,
  labelStatus,
  singleColor,
  multiColor,
  colorStatus,
  backgroundColor,
  fillSingleColor,
  fillMultiColor,
  fillColorStatus,
}) => {
  var fillColor;

  const data = {
    labels: xValues,
    datasets: [
      {
        data: yValues,
        backgroundColor: multiColor,
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const options = {
    // You can customize chart options here
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
