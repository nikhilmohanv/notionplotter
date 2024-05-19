"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);
import "./area.css";
import { SetStateAction, useEffect, useState } from "react";

const AreaChart = ({
  xValues,
  yValues,
  label,
  labelStatus,

  backgroundColor,
  fillSingleColor,
  fillMultiColor,
  fillColorStatus,

  yAxisName,
  xAxisName,
  legend,
  legendPosition,
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [lineColor, setLineColor] = useState([]);
  const [fillColor, setFillColor] = useState([]);

  useEffect(() => {
    if (backgroundColor.trim().toLowerCase() == "#ffffff") {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
  }, [backgroundColor]);
  console.log(backgroundColor);
  const hex2rgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = parseInt(hex.slice(8, 9), 16);

    // return {r, g, b}
    const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;
    return rgba;
  };
  console.log(fillSingleColor);

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

  // creating datasets

  // function createDatasets(xValues,yValues){

  // }

  return (
    <Line
      data={{
        labels: xValues,
        datasets: [
          {
            tension: 0.5,
            label: yAxisName,
            data: yValues,

            borderColor: lineColor, //it is the color of line in the cahrt
            pointBorderColor: lineColor,
            pointRadius: 3,
            pointStyle: "circle",

            pointHoverBorderColor: lineColor,
            // pointBackgroundColor: lineColor,
            pointHoverBackgroundColor: lineColor,
            pointBorderWidth: 2,
            fill: {
              target: "origin",
              above: fillColor, //it is the area fill under the line
            },
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRation: true,
        plugins: {
          legend: {
            display: legend,
            position: legendPosition,
            labels: {
              color: darkMode ? "white" : "black",
            },
            // labels: {
            //   usePointStyle: true,
            // },
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
        scales: {
          x: {
            grid: {
              drawTicks: false,
              drawBorder: true,
              borderDash: [4, 4],
              color: darkMode
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.1)",
            },
            ticks: {
              align: "inner",

              autoSkipPadding: 3,

              color: darkMode ? "rgba(255, 255, 255, 0.9)" : "#43424D", //"#9494A4" : "#D3D3D6"
              padding: 16,
              font: {
                size: 13,
              },
            },
          },
          y: {
            // if want to remove the y axis values then make display false
            display: true,

            beginAtZero: !0,
            ticks: {
              color: darkMode ? "rgba(255, 255, 255, 0.9)" : "#43424D",
            },
            grid: {
              color: darkMode
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.1)",
            },
          },
        },
        elements: {
          line: {
            borderWidth: 2,
          },
          point: {
            radius: 1,
            backgroundColor: "transparent", // #29D
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
  );
};
export default AreaChart;
