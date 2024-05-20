"use client";
import { useState, useEffect, useRef } from "react";
import AreaChart from "@/components/charts/area/area";
import BarChart from "@/components/charts/bar/bar";
import DoughnutChart from "@/components/charts/doughnut/doughnut";
import PieChart from "@/components/charts/pie/pie";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import "./embed.css";
import RefreshButton from "@/components/icons/refresh";

export default function Embed() {
  const [chartType, setChartType] = useState();

  const pathname = usePathname();
  const id = pathname.slice(7);
  //store label of the graph
  const [label, setLabel] = useState();
  const [yAxis,setYAxis]=useState()

  // store background color from user
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");

  //store fill single color
  const [fillSingleColor, setFillSingleColor] = useState("#FF6384");

  //store x axis datas
  const [xAxisValues, setXAxisValues] = useState([]);

  //store y axis datas
  const [yAxisValues, setYAxisValues] = useState([]);

  //store label status true or false, if true then hide the label from users
  const [labelStatus, setLabelStatus] = useState(false);

  //storing which type for color is used for filling
  const [fillColorStatus, setFillColorStatus] = useState("fillSingle");

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
        // data.yaxisId && setYAxis(data.yaxisId);

        data.type && setChartType(data.type);
        // data.xaxisId && setXAxis(data.xaxisId);
        data.label && setLabel(data.label);
        data.fillSingleColor && setFillSingleColor(data.fillSingleColor);
        data.fillMultiColor && setFillMultiColor(data.fillMultiColor);
        // data.lineSingleColor && setLineSingleColor(data.lineSingleColor);
        data.backgroundColor && setBackgroundColor(data.backgroundColor);
        // data.lineMultiColor && setLineMultiColor(data.lineMultiColor);
        // data.colorStatus && setColorStatus(data.colorStatus);
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
              height: `100%`,
            }}
          >
            <BarChart
              xValues={xAxisValues}
              yValues={yAxisValues}
              label={label}
              labelStatus={labelStatus}
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
              height: `100%`,
            }}
          >
            <AreaChart
              xValues={xAxisValues}
              yValues={yAxisValues}
              label={label}
              labelStatus={labelStatus}
              backgroundColor={backgroundColor}
              fillSingleColor={fillSingleColor}
              fillMultiColor={fillMultiColor}
              fillColorStatus={fillColorStatus}
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

              height: `100%`,
            }}
          >
            <DoughnutChart
              xValues={xAxisValues}
              yValues={yAxisValues}
              label={label}
              labelStatus={labelStatus}
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

              // overflow: "hidden",

              height: `100%`,
            }}
          >
            <PieChart
              xValues={xAxisValues}
              yValues={yAxisValues}
              label={label}
              labelStatus={labelStatus}
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
      default:
        setChartComponent(<Skeleton className="w-full h-full rounded" />);
    }
  }, [chartType]);

  return (
    <>
      <div className="embed-container" style={{ background: backgroundColor }}>
        {/* Refresh button */}

        <button
          className="refresh-button"
          onClick={() => window.location.reload()}
        >
          <RefreshButton className="h-8 w-" />
        </button>
        <button
          className="mode-button"
          onClick={() => setBackgroundColor("#2F3438")}
        >
          dark mode
        </button>
        <main style={{ height: "100vh", width: "100vhw" }}>
          {chartComponent}
        </main>
      </div>
    </>
  );
}
