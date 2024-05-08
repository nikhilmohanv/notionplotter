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
  lineSingleColor,
  lineMultiColor,
  colorStatus,
  fillSingleColor,
  fillMultiColor,
  backgroundColor,
  fillColorStatus,
  legend,
  legendPosition,
  yAxisName,
  xAxisName
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
    <div id="chart" style={{ backgroundColor: backgroundColor }}>
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
              borderRadius: 10,
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
    </div>
  );
};
export default BarChart;
