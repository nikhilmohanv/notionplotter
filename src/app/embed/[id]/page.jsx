"use client";
import { useState, useEffect, useRef } from "react";
import AreaChart from "@/components/charts/area/area";
import LoggedInNavBar from "@/components/basic/navbar/loggedin-navbar";
import BarChart from "@/components/charts/bar/bar";
import DoughnutChart from "@/components/charts/doughnut/doughnut";
import PieChart from "@/components/charts/pie/pie";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import "./embed.css";
import RefreshButton from "@/components/icons/refresh";

export default function Embed() {
  const [chartType, setChartType] = useState();
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const pathname = usePathname();
  const id = pathname.slice(7);
  const [data, setData] = useState([]);
  //store label of the graph
  const [label, setLabel] = useState();

  //store selected x-axis value
  const [xAxis, setXAxis] = useState();
  //store selected y-axis value
  const [yAxis, setYAxis] = useState();
  //store row data

  // store background color from user
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");

  //stroe the userid in provided in the database

  //store line color
  const [lineSingleColor, setLineSingleColor] = useState("#FF6384");

  //store fill single color
  const [fillSingleColor, setFillSingleColor] = useState("#FF6384");

  //store x axis datas
  const [xAxisValues, setXAxisValues] = useState([]);

  //store y axis datas
  const [yAxisValues, setYAxisValues] = useState([]);

  //store label status true or false, if true then hide the label from users
  const [labelStatus, setLabelStatus] = useState(false);

  //selecting which coloring is used for line, single or multiple color
  const [colorStatus, setColorStatus] = useState("lineSingle");

  //storing which type for color is used for filling
  const [fillColorStatus, setFillColorStatus] = useState("fillSingle");

  // to store count of multi color input boxes
  const [lineMultiColor, setLineMultiColor] = useState([""]);

  //to store all multi color values
  const [fillMultiColor, setFillMultiColor] = useState([""]);

  const [legend, setLegend] = useState(true);

  // for storing legend position
  const [legendPosition, setLegendPosition] = useState();

  useEffect(() => {
    fetch("/api/firebase/getdocument?collection=graphs&docId=" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.yaxisId && setYAxis(data.yaxisId);

        data.type && setChartType(data.type);
        console.log(data.type);
        data.xaxisId && setXAxis(data.xaxisId);
        data.label && setLabel(data.label);
        data.fillSingleColor && setFillSingleColor(data.fillSingleColor);
        data.fillMultiColor && setFillMultiColor(data.fillMultiColor);
        data.lineSingleColor && setLineSingleColor(data.lineSingleColor);
        data.backgroundColor && setBackgroundColor(data.backgroundColor);
        data.lineMultiColor && setLineMultiColor(data.lineMultiColor);
        data.colorStatus && setColorStatus(data.colorStatus);
        data.fillColorStatus && setFillColorStatus(data.fillColorStatus);
        data.legend != undefined && setLegend(data.legend);
        data.legendPosition && setLegendPosition(data.legendPosition);

        if (data.xaxis && data.yaxis) {
          const xaxis = data.xaxis.split(", ");
          const yaxis = data.yaxis.split(", ");
          setXAxisValues(xaxis);
          setYAxisValues(yaxis);
        }

        //checking if labelStatus is in the firestore
        if ("labelStatus" in data) {
          setLabelStatus(data.labelStatus);
        } else {
          setLabelStatus(false);
        }
      });
  }, []);

  const [chartComponent, setChartComponent] = useState(null);

  useEffect(() => {
    switch (chartType) {
      case "Bar Chart":
        setChartComponent(
          <div
            style={{
              position: "relative",
              height: `${innerHeight}px`,
              width: `${innerWidth}px`,
            }}
          >
            <BarChart
              xValues={xAxisValues}
              yValues={yAxisValues}
              label={label}
              labelStatus={labelStatus}
              lineSingleColor={lineSingleColor}
              lineMultiColor={lineMultiColor}
              colorStatus={colorStatus}
              fillSingleColor={fillSingleColor}
              fillMultiColor={fillMultiColor}
              backgroundColor={backgroundColor}
              fillColorStatus={fillColorStatus}
              legend={legend}
              legendPosition={legendPosition}
            />
          </div>
        );
        break;
      case "Area Chart":
        setChartComponent(
          <div
            style={{
              overflow: "hidden",
              height: `${windowSize.innerHeight}px`,
            }}
          >
            <AreaChart
              xValues={xAxisValues}
              yValues={yAxisValues}
              label={label}
              labelStatus={labelStatus}
              lineSingleColor={lineSingleColor}
              lineMultiColor={lineMultiColor}
              colorStatus={colorStatus}
              backgroundColor={backgroundColor}
              fillSingleColor={fillSingleColor}
              fillMultiColor={fillMultiColor}
              fillColorStatus={fillColorStatus}
              height={windowSize.innerHeight}
              width={windowSize.innerWidth}
              legend={legend}
              legendPosition={legendPosition}
            />
          </div>
        );
        break;
      case "Doughnut Chart":
        setChartComponent(
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              // alignItems: "center",
              overflow: "hidden",
              height: `${windowSize.innerHeight}px`,
            }}
          >
            <DoughnutChart
              xValues={xAxisValues}
              yValues={yAxisValues}
              label={label}
              labelStatus={labelStatus}
              lineSingleColor={lineSingleColor}
              lineMultiColor={lineMultiColor}
              colorStatus={colorStatus}
              fillSingleColor={fillSingleColor}
              fillMultiColor={fillMultiColor}
              backgroundColor={backgroundColor}
              fillColorStatus={fillColorStatus}
              legend={legend}
              legendPosition={legendPosition}
            />
          </div>
        );
        break;
      case "Pie Chart":
        setChartComponent(
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              // alignItems: "center",
              overflow: "hidden",
              height: `${windowSize.innerHeight}px`,
            }}
          >
            <PieChart
              xValues={xAxisValues}
              yValues={yAxisValues}
              label={label}
              labelStatus={labelStatus}
              lineSingleColor={lineSingleColor}
              lineMultiColor={lineMultiColor}
              colorStatus={colorStatus}
              fillSingleColor={fillSingleColor}
              fillMultiColor={fillMultiColor}
              backgroundColor={backgroundColor}
              fillColorStatus={fillColorStatus}
              height={windowSize.innerHeight}
              width={windowSize.innerWidth}
              legend={legend}
              legendPosition={legendPosition}
            />
          </div>
        );
        break;
      default:
        setChartComponent(<Skeleton className="w-full h-full rounded" />);
    }
  }, [chartType]);

  return (
    <>
      <div className="embed-container">
        {/* Refresh button */}
        <button
          className="refresh-button"
          onClick={() => window.location.reload()}
        >
          <RefreshButton className="h-8 w-"/>
        </button>
        <main className="w-screen h-screen">{chartComponent}</main>
      </div>
    </>
  )
}

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

