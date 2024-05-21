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
  dataType,
  currencyType,
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

  const hex2rgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // return {r, g, b}
    const rgba = `rgba(${r}, ${g}, ${b})`;
    return rgba;
  };

  useEffect(() => {
    if (backgroundColor.trim().toLowerCase() == "#ffffff") {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
  }, [backgroundColor]);
  useEffect(() => {
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
      // setLineColor(convertForLineColor(fillMultiColor[0]));
      let newFillColor = [];
      setFillColor(fillMultiColor);
      fillMultiColor.forEach((color) => {
        newFillColor.push(convertForLineColor(color));
      });
      setLineColor(newFillColor);
    }
    // setFillColor(newFillColor);
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
  const [displayDataType, setDisplayDataType] = useState();
  useEffect(() => {
    if (dataType == "number") {
      setDisplayDataType("");
    } else if (dataType == "percentage") {
      setDisplayDataType("%");
    } else {
      setDisplayDataType(currencyType);
    }
  }, [dataType, currencyType]);
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
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || ""; // Dataset label
                if (label) {
                  label += ": ";
                }

                if (context.parsed.y !== null) {
                  if (displayDataType == "%") {
                    label += context.parsed.y.toFixed(1) + displayDataType;
                  } else {
                    // Format the y-axis value with a dollar sign
                    label +=
                      displayDataType + context.parsed.y.toLocaleString(); // Format to 2 decimal places
                  }
                }
                return label;
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
              callback: function (value, index, values) {
                if (displayDataType == "%") {
                  return value.toLocaleString() + displayDataType;
                }
                return displayDataType + value.toLocaleString(); // Add your desired symbol here
              },
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
export default BarChart;
