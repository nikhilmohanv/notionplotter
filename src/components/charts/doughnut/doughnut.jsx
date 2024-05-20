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

  fillSingleColor,
  fillMultiColor,
  backgroundColor,
  fillColorStatus,
  legend,
  legendPosition,
  yAxisName,
  xAxisName,
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [lineColor, setLineColor] = useState([]);
  const [fillColor, setFillColor] = useState([]);

  // useEffect(() => {
  //   if (colorStatus == "lineSingle") {
  //     setLineColor(lineSingleColor);
  //   } else {
  //     setLineColor(lineMultiColor);
  //   }
  // }, [colorStatus, lineSingleColor, lineMultiColor]);

 
  const hex2rgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // return {r, g, b}
    const rgba = `rgba(${r}, ${g}, ${b})`;
    return rgba;
  };
  const convertForLineColor = (rgba) => {
    const rgbaValues = rgba
      .substring(5)
      .split(",")
      .map((v) => parseFloat(v));
    if (rgbaValues.length == 3) {
      //if 3 values in the array then not 100% alpha so
      return rgba;
    } else {
      rgbaValues[3] = 1;

      // Rebuild the rgba string with the new alpha
      return `rgba(${rgbaValues.join(",")})`;
    }
  };
  useEffect(() => {
    if (backgroundColor.trim().toLowerCase() == "#ffffff") {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
  }, [backgroundColor]);
  useEffect(() => {
    const newFillColor = [];
    if (fillColorStatus === "fillSingle") {
      // const rgbaValues = fillSingleColor
      //   .substring(5)
      //   .split(",")
      //   .map((v) => parseFloat(v));

      // Set the alpha value to 1
      // if (rgbaValues.length == 3) {
      //if 3 values in the array then not 100% alpha so
      //   setLineColor(fillSingleColor);
      // } else {
      //   rgbaValues[3] = 1;

      // Rebuild the rgba string with the new alpha
      setLineColor(convertForLineColor(fillSingleColor));

      setFillColor(fillSingleColor);
    } else if (fillColorStatus === "fillMulti") {
      setLineColor(convertForLineColor(fillMultiColor[0]));
      setFillColor(fillMultiColor);
      // fillMultiColor.forEach((color) => {
      //   newFillColor.push(convertForLineColor(color));
      // });
    }
    // setFillColor(newFillColor);
  }, [fillColorStatus, fillSingleColor, fillMultiColor]);
  return (
    // <div
    // style={{
    //   position: "relative",
    //   width: window.innerWidth,
    //   height: window.innerHeight,
    // }}
    // >
    <Doughnut
      data={{
        labels: xValues,
        datasets: [
          {
            label: yAxisName,
            data: yValues,
            backgroundColor: fillColor,
            borderColor: "#FFFFFF",
            borderWidth: 1,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRation: true,
        plugins: {
          legend: {
            position: legendPosition,
            display: legend,
            title: {
              color: darkMode ? "#FFFFFF" : "#000000",
            },
            labels: {
              color: darkMode ? "white" : "black",
            },
          },

          title: {
            display: labelStatus ? false : true,
            text: !labelStatus && label,
            align: "center",
            color: darkMode ? "white" : "black",

            font: {
              size: 20,
              weight: 8,
            },
          },
        },

        elements: {
          line: {
            borderWidth: 2,
          },
          point: {
            radius: 1,
            backgroundColor: "transparent",
            borderWidth: 0,
            hoverBackgroundColor: "#212027",
            hoverRadius: 4,
            hoverBorderWidth: 2,
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        animation: {
          duration: 1500,
        },
      }}
    />
    // </div>
  );
};

export default DoughnutChart;
