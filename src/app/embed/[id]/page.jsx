"use client";
import { useState, useEffect,useRef } from "react";
import AreaChart from "@/components/charts/area/area";
import LoggedInNavBar from "@/components/basic/navbar/loggedin-navbar";
import BarChart from "@/components/charts/bar/bar";
import DoughnutChart from "@/components/charts/doughnut/doughnut";
import PieChart from "@/components/charts/pie/pie";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function Embed() {
  const [chartType, setChartType] = useState();
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);


console.log(windowSize.innerHeight)
console.log(windowSize.innerWidth)
  const pathname = usePathname();
  const id = pathname.slice(6);
  const [data, setData] = useState([]);
  //store label of the graph
  const [label, setLabel] = useState();
  //to store all columns of the database
  const [cols, setCols] = useState([]);
  //store notion database id
  const [dbId, setDbId] = useState();
  //stroing the columns and id alone, cols state contains the whole json response
  // const colNameAndId = [];
  const [colNameAndId, setColNameAndId] = useState([]);
  //store selected x-axis value
  const [xAxis, setXAxis] = useState();
  //store selected y-axis value
  const [yAxis, setYAxis] = useState();
  //store row data
  const [rows, setRows] = useState([]);

  // store background color from user
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");

  //stroe the userid in provided in the database
  const [dbUid, setDbUid] = useState();

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

  //for storing chart name
  const [name, setName] = useState();
  const [xAxisName, setXAxisName] = useState();
  const [yAxisName, setYAxisName] = useState();
  const [savingStatus, setSavingStatus] = useState(false);

  //selecting which coloring is used for line, single or multiple color
  const [colorStatus, setColorStatus] = useState("lineSingle");

  //storing which type for color is used for filling
  const [fillColorStatus, setFillColorStatus] = useState("fillSingle");

  // to store count of multi color input boxes
  const [lineMultiColor, setLineMultiColor] = useState([""]);

  //to store all multi color values
  const [fillMultiColor, setFillMultiColor] = useState([""]);

  // aggregation for sum and count
  const [aggregation, setAggregation] = useState("count");

  // couting the rows in the data extractedProperties
  const [count, setCount] = useState(0);

  //this adds a new color input to the multicolor input array
  const handleAddColor = () => {
    setLineMultiColor([...lineMultiColor, "#000000"]);
  };

  const [andOr, setAndOr] = useState("and");
  // for storing filters
  const [filters, setFilters] = useState([]);

  const [filterLoadingState, setFilterLoadingState] = useState(false);

  useEffect(() => {
    fetch("/api/firebase/getdocument?collection=graphs&docId=" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);

        setDbId(data.databaseID);
        setName(data.name);
        data.yaxisId && setYAxis(data.yaxisId);
        data.xAxisName && setXAxisName(data.xAxisName);
        data.yAxisName && setYAxisName(data.yAxisName);
        data.type && setChartType(data.type);

        data.xaxisId && setXAxis(data.xaxisId);
        data.label && setLabel(data.label);
        data.fillSingleColor && setFillSingleColor(data.fillSingleColor);
        data.fillMultiColor && setFillMultiColor(data.fillMultiColor);
        data.lineSingleColor && setLineSingleColor(data.lineSingleColor);
        data.backgroundColor && setBackgroundColor(data.backgroundColor);
        data.lineMultiColor && setLineMultiColor(data.lineMultiColor);
        data.colorStatus && setColorStatus(data.colorStatus);
        data.fillColorStatus && setFillColorStatus(data.fillColorStatus);
        data.filters && setFilters(data.filters);
        data.andOr && setAndOr(data.andOr);
        data.aggregation && setAggregation(data.aggregation);
        setDbUid(data.userid);

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

  return (
    <>
      <main className="flex-grow p-6">
        {chartType == "Bar Chart" ? (
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
          />
        ) : chartType == "Area Chart" ? (
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
          />
        ) : chartType == "Doughnut Chart" ? (
          <div className="flex items-center justify-center">
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
            />
          </div>
        ) : chartType == "Pie Chart" ? (
          <div className="flex  items-center">
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
            />
          </div>
        ) : (
          <Skeleton className="w-full h-[600px] rounded" />
        )}
      </main>
    </>
  );
}

function getWindowSize() {
  const {innerWidth, innerHeight} = window;
  return {innerWidth, innerHeight};
}