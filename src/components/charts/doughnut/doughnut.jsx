"use client";
// src/PieChart.tsx

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useState, useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({
  xValues,
  yValues,
  label,
  labelStatus,
  lineSingleColor,
  lineMultiColor,
  colorStatus,
  fillSingleColor,
  fillMultiColor,
  backgroundColor,
  fillColorStatus,
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [lineColor, setLineColor] = useState([]);
  const [fillColor, setFillColor] = useState([]);

  useEffect(() => {
    if (colorStatus == "lineSingle") {
      setLineColor(lineSingleColor);
    } else {
      setLineColor(lineMultiColor);
    }
  }, [colorStatus, lineSingleColor, lineMultiColor]);

  useEffect(() => {
    if (backgroundColor != "#ffffff") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, [backgroundColor]);

  const hex2rgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // return {r, g, b}
    const rgba = `rgba(${r}, ${g}, ${b})`;
    console.log(rgba);
    return rgba;
  };

  useEffect(() => {
    const newFillColor = [];
    if (fillColorStatus === "fillSingle") {
      newFillColor.push(hex2rgb(fillSingleColor));
    } else if (fillColorStatus === "fillMulti") {
      fillMultiColor.forEach((color) => {
        newFillColor.push(hex2rgb(color));
      });
    }
    setFillColor(newFillColor);
  }, [fillColorStatus, fillSingleColor, fillMultiColor]);
  return (
    <Doughnut
      data={{
        labels: xValues,
        datasets: [
          {
            label: label,
            data: yValues,
            backgroundColor: fillColor,
            borderColor: lineColor,
            borderWidth: 1,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRation: true,
        legend: {
          // display false makes the dataset label hide
          display: true,
        },

        title: {
          display: true,
          text: "Pie Chart",
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
};

export default DoughnutChart;
