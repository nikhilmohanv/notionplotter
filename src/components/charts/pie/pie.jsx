import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);
export default function PieChart({
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
  legend
}) {
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
    const rgba = `rgba(${r}, ${g}, ${b})`;
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
      <Pie
        data={{
          labels: xValues,
          datasets: [
            {
              label: label,
            
              data: yValues,
              backgroundColor: fillColor,
              borderColor: lineColor,
              borderWidth: 1,
              // borderRadius: 10,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRation: true,
          plugins: {
            legend: {
              position: "bottom",
              display: legend,
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
  );
}
