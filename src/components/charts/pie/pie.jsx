import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Chart } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);
export default function PieChart({
  xValues,
  yValues,
  label,
  labelStatus,

  backgroundColor,
  fillSingleColor,
  fillMultiColor,
  fillColorStatus,

  legend,
  legendPosition,
  yAxisName,
  xAxisName,
}) {
  console.log(fillMultiColor);
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
  console.log("bg color ", backgroundColor.substring(0, 6));
  // useEffect(() => {
  //   if (backgroundColor.substring(0, 7).toLowerCase() == "#ffffff") {
  //     setDarkMode(false);
  //   } else {
  //     setDarkMode(true);
  //   }
  // }, [backgroundColor]);
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
      // console.log(rgbaValues);

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
    <>
      <Pie
        data={{
          labels: xValues,
          datasets: [
            {
              label: yAxisName,
              data: yValues,
              backgroundColor: fillColor,
              borderColor: "#FFFFFF",
              borderWidth: 1,
              hoverOffset: 3,
              // borderRadius: 10,
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
              labels: {
                color: darkMode ? "white" : "black",
                font: {
                  family: "Arial",
                },
              },
            },

            title: {
              display: labelStatus ? false : true,
              text: !labelStatus && label,
              align: "center",
              color: darkMode ? "white" : "black",

              font: {
                size: 18,
                weight: "bolder",
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
    </>
  );
}
