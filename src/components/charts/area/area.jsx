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
  lineSingleColor,
  lineMultiColor,
  colorStatus,
  backgroundColor,
  fillSingleColor,
  fillMultiColor,
  fillColorStatus,
  height,
  width,
}) => {
  console.log("area cahrt here")
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
    if (backgroundColor.trim().toLowerCase() == "#ffffff") {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
  }, [backgroundColor]);

  const hex2rgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // return {r, g, b}
    const rgba = `rgba(${r}, ${g}, ${b}, 0.1)`;
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
    <div id="chart" >
      <Line
        data={{
          labels: xValues,
          datasets: [
            {
              tension: 0.5,
              label: "Dataset 1",
              data: yValues,

              borderColor: lineColor, //it is the color of line in the cahrt
              pointBorderColor: lineColor,
              pointRadius: 3,
              pointStyle: "circle",

              pointHoverBorderColor: lineColor,
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
              position: "top",
              display: false,
              labels: {
              
                usePointStyle: true,
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
    </div>
  );
};
export default AreaChart;
