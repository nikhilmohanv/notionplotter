"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);
import { useEffect, useState } from "react";

const BarChart = ({
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
  aggregation,
}) => {
  console.log("aggregation ", aggregation);
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
    return rgba;
  };

  useEffect(() => {
    const newFillColor = [];
    if (fillColorStatus === "fillSingle") {
      const rgbaValues = fillSingleColor
        .substring(5)
        .split(",")
        .map((v) => parseFloat(v));
      console.log(rgbaValues);

      // Set the alpha value to 1
      if (rgbaValues.length == 3) {
        //if 3 values in the array then not 100% alpha so
        setLineColor(fillSingleColor);
      } else {
        rgbaValues[3] = 1;

        // Rebuild the rgba string with the new alpha
        setLineColor(`rgba(${rgbaValues.join(",")})`);
      }
      newFillColor.push(fillSingleColor);
    } else if (fillColorStatus === "fillMulti") {
      setLineColor(fillMultiColor);
      newFillColor.push(fillMultiColor);
      // fillMultiColor.forEach((color) => {
      //   newFillColor.push(hex2rgb(color));
      // });
    }
    setFillColor(newFillColor);
  }, [fillColorStatus, fillSingleColor, fillMultiColor]);

  var chartColors = {
    red: "rgb(255, 99, 132,0.5)",
    orange: "rgb(255, 159, 64,0.5)",
    yellow: "rgb(255, 205, 86,0.5)",
    green: "rgb(75, 192, 192,0.5)",
    blue: "rgb(54, 162, 235,0.5)",
    purple: "rgb(153, 102, 255,0.5)",
    grey: "rgb(231,233,237,0.5)",
  };

  return (
    <Bar
      data={{
        labels: xValues,
        datasets: [
          {
            label: yAxisName,
            backgroundColor: fillColor, //["#c41c1c","#11a248","#ec5555","#11a248"],
            borderColor: lineColor,
            borderWidth: 1,
            data: yValues,
            borderRadius: 5,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRation: true,
        legend: {
          // display false makes the dataset label hide
          display: legend,
          position: legendPosition,
          labels: {
            color: darkMode ? "white" : "black",
          },
        },

        title: {
          display: true,
          text: "Bar Chart",
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
export default BarChart;
