"use client";

import { useState, useEffect } from "react";
import AreaChart from "@/components/charts/area/area";
import BarChart from "@/components/charts/bar/bar";
import DoughnutChart from "@/components/charts/doughnut/doughnut";
import PieChart from "@/components/charts/pie/pie";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import "./embed.css";
import { useSearchParams } from "next/navigation";

import addDataWithId from "@/lib/firebase/firestore/adddatawithid";
import DarkMode from "@/components/icons/embed/darkmode";
import LightMode from "@/components/icons/embed/lightmode";
import DarkRefresh from "@/components/icons/embed/darkmoderefresh";
import RefreshLight from "@/components/icons/embed/refreshlightmode";
import LoaderLight from "@/components/icons/embed/refreshloaderlight";
import LoadingDark from "@/components/icons/embed/loadingrefreshdark";

export default function Embed() {
  const [chartType, setChartType] = useState();
  const [chartComponent, setChartComponent] = useState(null);
  const pathname = usePathname();
  const id = pathname.slice(7);
  //store data from firebase database
  const [data, setData] = useState();
  //store label of the graph
  const [label, setLabel] = useState();
  //to store all columns of the database
  const [cols, setCols] = useState([]);
  //store notion database id
  const [dbId, setDbId] = useState();

  // store access token from path, we cannot access access_token from cookies in notion so passing the data through url the url doesnot contain the work key
  const [accessToken, setAccessToken] = useState();
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
  const [uId, setUId] = useState();

  //store line color

  //store fill single color
  const [fillSingleColor, setFillSingleColor] = useState("rgba(0,0,0,0.1)");

  //store x axis datas
  const [xAxisValues, setXAxisValues] = useState([]);

  //store y axis datas
  const [yAxisValues, setYAxisValues] = useState([]);

  //store label status true or false, if true then hide the label from users
  const [labelStatus, setLabelStatus] = useState(true);

  //for storing chart name
  const [xAxisName, setXAxisName] = useState();
  const [yAxisName, setYAxisName] = useState();

  //selecting which coloring is used for line, single or multiple color

  //storing which type for color is used for filling
  const [fillColorStatus, setFillColorStatus] = useState("fillSingle");

  //to store all multi color values
  const [fillMultiColor, setFillMultiColor] = useState(["rgba(0, 0, 0,0.1)"]);

  // aggregation for sum and count
  const [aggregation, setAggregation] = useState("count");

  // this is to rerender some components
  const [count, setCount] = useState(0);

  const [legend, setLegend] = useState(true);

  const [dataType, setDataType] = useState("number");
  const [currencyType, setCurrencyType] = useState("");

  // for storing legend position
  const [legendPosition, setLegendPosition] = useState("top");

  const [andOr, setAndOr] = useState("and");
  // for storing filters
  const [filters, setFilters] = useState([]);

  const [extractedProperties, setExtractedProperties] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
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
        // data.dataType &&
        if (data.dataType) {
          if (data.dataType == "number" || data.dataType == "percentage") {
            setDataType(data.dataType);
          } else {
            setDataType("currency");
            setCurrencyType(data.dataType);
          }
        }

        data.xaxisId && setXAxis(data.xaxisId);
        data.label && setLabel(data.label);
        data.fillSingleColor && setFillSingleColor(data.fillSingleColor);
        data.fillMultiColor && setFillMultiColor(data.fillMultiColor);
        data.backgroundColor && setBackgroundColor(data.backgroundColor);
        data.fillColorStatus && setFillColorStatus(data.fillColorStatus);
        data.filters && setFilters(data.filters);
        data.andOr && setAndOr(data.andOr);
        data.aggregation && setAggregation(data.aggregation);
        data.legend != undefined && setLegend(data.legend);
        data.legendPosition && setLegendPosition(data.legendPosition);
        setUId(data.userid);

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
          setLabelStatus(true);
        }
      });
  }, [id]);

  // fetching access token from db
  useEffect(() => {
    if (uId) {
      fetch("/api/firebase/getdocument?collection=access_tokens&docId=" + uId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setAccessToken(data.access_token);
        });
    }
  }, [uId, data]);

  //fetch data from api/notion/retrievecolumns?id=${id}
  useEffect(() => {
    console.log(dbId);
    if (accessToken !== null && accessToken !== undefined) {
      fetch("/api/notion/retrievecolumns?id=" + dbId + "&at=" + accessToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((cols) => {
          setCols(cols);
          const extractedNameId = [];
          for (const propertyName in cols.properties) {
            if (cols.properties.hasOwnProperty(propertyName)) {
              // Access the property object
              const property = cols.properties[propertyName];
              const propertyIdValue = property.id;
              const propertyNameValue = property.name;
              const propertyType = property.type;
              extractedNameId.push({
                id: propertyIdValue,
                name: propertyNameValue,
                type: propertyType,
              });
            }
          }
          setColNameAndId(extractedNameId);
        });
    }
  }, [accessToken]);

  //fetch data from api api/notion/querydb?id={id} this have all the row information
  useEffect(() => {
    if (accessToken !== null && accessToken !== undefined) {
      console.log("calling query");
      fetch("/api/notion/querydb?id=" + dbId + "&at=" + accessToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filters, andOr }),
      })
        .then((response) => response.json())
        .then((data) => {
          setRows(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [colNameAndId, count]);

  //it stores extracted data from the api
  useEffect(() => {
    console.log("extraction started");
    setExtractedProperties([]);

    rows.forEach((page) => {
      // setCount(prevCount => prevCount + 1);
      // Extract properties from the 'properties' object
      const properties = page.properties;

      // Loop through each property
      for (const key in properties) {
        // setCount(count + 1);
        if (properties.hasOwnProperty(key)) {
          const property = properties[key];

          // Extract property name and type
          const propertyName = key;
          const id = property.id;

          let propertyType;
          let value;

          let formulaType;

          // to store values of rollup arrays
          let rollupArrayValues;

          let rollupType;

          if (property.type == "number") {
            value = property.number;
            propertyType = property.type;
          } else if (property.type == "title") {
            value = property.title[0].plain_text;
            propertyType = property.type;
          } else if (property.type == "multi_select") {
            propertyType = property.type;
            // in multi_select value is stored as array so when displaying check condition if it is an multiselct value
            let multi_select = [];
            property.multi_select.map((select) => {
              multi_select.push(select.name);
            });
            value = multi_select;
          } else if (property.type == "rich_text") {
            if (property.rich_text.length > 0) {
              value = property.rich_text[0].plain_text;
            } else {
              value = "Empty text";
            }
            propertyType = property.type;
          } else if (property.type == "select") {
            propertyType = property.type;
            value = property.select.name;
          } else if (property.type == "status") {
            if (property.status == null) {
              value = "No status";
            } else {
              value = property.status.name;
            }
            propertyType = property.type;
          } else if (property.type == "date") {
            propertyType = property.type;
            if (property.date == null) {
              value = "No date";
            } else {
              let startDate = property.date.start;
              let endDate = property.date.end;
              value = [{ start: startDate, end: endDate }];
            }
          } else if (property.type == "files") {
            propertyType = property.type;
            if (property.files.length <= 0) {
              value = "No file";
            } else {
              let files = [];
              property.files.map((file) => {
                files.push(file.name);
              });
              value = files;
            }
          } else if (property.type == "checkbox") {
            propertyType = property.type;
            value = property.checkbox;
          } else if (property.type == "url") {
            propertyType = property.type;
            if (property.url == null) {
              value = "No url";
            } else {
              value = property.url;
            }
          } else if (property.type == "email") {
            if (property.email == null) {
              value = "No email";
            } else {
              value = property.email;
            }
            propertyType = property.type;
          } else if (property.type == "phone_number") {
            if (property.phone_number == null) {
              value = "No number";
            } else {
              propertyType = property.type;
              value = property.phone_number;
            }
          } else if (property.type == "unique_id") {
            propertyType = property.type;
            if (property.unique_id.prefix == null) {
              value = property.unique_id.number;
            } else {
              value =
                property.unique_id.prefix + "-" + property.unique_id.number;
            }
          } else if (property.type == "last_edited_time") {
            propertyType = property.type;
            value = [property.last_edited_time];
          } else if (property.type == "created_time") {
            propertyType = property.type;
            value = [property.created_time];
          } else if (property.type == "last_edited_by") {
            propertyType = property.type;
            if (property.last_edited_by.length == 0) {
              value = "No name";
            } else {
              value = [
                {
                  name: property.last_edited_by.name,
                  id: property.last_edited_by.id,
                },
              ];
            }
          } else if (property.type == "created_by") {
            propertyType = property.type;
            if (property.created_by.length == 0) {
              value = "No name";
            } else {
              value = [
                {
                  name: property.created_by.name,
                  id: property.created_by.id,
                },
              ];
            }
            // value = property.created_by.id;
          } else if (property.type == "people") {
            propertyType = property.type;
            // value = property.created_by.id;
            if (property.people.length == 0) {
              value = "No name";
            } else {
              // Check if property.people exists and is an array
              if (property.people && Array.isArray(property.people)) {
                if (property.people.length == 0) {
                  value = "No name";
                } else {
                  let peoples = [];
                  property.people.forEach((peps) => {
                    // Check if peps is an object and has the 'id' property
                    if (peps && typeof peps === "object" && "id" in peps) {
                      peoples.push({ name: peps.name, id: peps.id });
                    }
                  });
                  value = peoples;
                }
              }
            }
          } else if (property.type == "formula") {
            propertyType = "formula";
            formulaType = property.formula.type;
            if (property.formula.type == "string") {
              value = property.formula.string;
              formulaType = property.formula.type;
            } else if (property.formula.type == "number") {
              propertyType = property.formula.type;
              value = property.formula.number;
            } else if (property.formula.type == "date") {
              propertyType = property.formula.type;
              value = [
                {
                  start: property.formula.date.start,
                  end: property.formula.date.end,
                },
              ];
            } else if (property.formula.type == "number") {
              propertyType = property.formula.type;
              value = property.formula.number;
            } else if (property.formula.type == "boolean") {
              propertyType = "formula";
              value = property.formula.boolean;
              formulaType = "checkbox";
            }
          } else if (property.type == "relation") {
            propertyType = property.type;
            if (property.relation.length <= 0) {
              value = "No relation";
            } else {
              var relateArr = [];
              property.relation.map((relate) => {
                relateArr.push(relate.id);
              });
              value = relateArr;
            }
          } else if (property.type == "rollup") {
            propertyType = "rollup";
            if (property.rollup.type == "number") {
              rollupArrayValues = property.rollup.number;

              rollupType = "number";
            } else if (property.rollup.type == "array") {
              property.rollup.array.map((arr) => {
                if (arr.type == "title") {
                  rollupType = "title";
                  rollupArrayValues.push(arr.title[0].plain_text);
                } else if (arr.type == "multi_select") {
                  // in multi_select value is stored as array so when displaying check condition if it is an multiselct value
                  rollupType = "multi_select";
                  arr.multi_select.map((select) => {
                    rollupArrayValues.push(select.name);
                  });
                } else if (arr.type == "number") {
                  rollupArrayValues.push(arr.number);
                  rollupType = "number";
                } else if (arr.type == "rich_text") {
                  rollupType = "rich_text";
                  rollupArrayValues.push(arr.rich_text[0].plain_text);
                } else if (arr.type == "select") {
                  rollupType = "select";
                  rollupArrayValues.push(arr.select.name);
                } else if (arr.type == "status") {
                  rollupType = "status";
                  rollupArrayValues.push(arr.status.name);
                } else if (arr.type == "date") {
                  if (arr.date == null) {
                    rollupArrayValues.push("No date");
                  } else {
                    let startDate = arr.date.start;
                    let endDate = arr.date.end;
                    rollupArrayValues.push({ start: startDate, end: endDate });
                  }
                  rollupType = "date";
                } else if (arr.type == "files") {
                  arr.files.map((file) => {
                    rollupArrayValues.push(file.name);
                  });
                  rollupType = "files";
                } else if (arr.type == "checkbox") {
                  rollupArrayValues.push(arr.checkbox);
                  rollupType = "checkbox";
                } else if (arr.type == "url") {
                  rollupType = "url";
                  rollupArrayValues.push(arr.url);
                } else if (arr.type == "email") {
                  rollupType = "email";
                  rollupArrayValues.push(arr.email);
                } else if (arr.type == "phone_number") {
                  rollupType = "phone_number";
                  rollupArrayValues.push(arr.phone_number);
                } else if (arr.type == "unique_id") {
                  rollupType = "unique_id";
                  if (arr.unique_id.prefix == null) {
                    rollupArrayValues.push(arr.unique_id.number);
                  } else {
                    rollupArrayValues.push(
                      arr.unique_id.prefix + "-" + arr.unique_id.number
                    );
                  }
                } else if (arr.type == "last_edited_time") {
                  rollupArrayValues.push(arr.last_edited_time);
                  rollupType = "last_edited_time";
                } else if (arr.type == "created_time") {
                  rollupArrayValues.push(arr.created_time);
                  rollupType = "created_time";
                } else if (arr.type == "last_edited_by") {
                  rollupType = "last_edited_by";
                  if (arr.last_edited_by.length == 0) {
                    rollupArrayValues.push("No name");
                  } else {
                    rollupArrayValues.push({
                      name: arr.last_edited_by.name,
                      id: arr.last_edited_by.id,
                    });
                  }
                } else if (arr.type == "created_by") {
                  rollupType = "created_by";
                  if (arr.created_by.length == 0) {
                    rollupArrayValues.push("No name");
                  } else {
                    rollupArrayValues.push({
                      name: arr.created_by.name,
                      id: arr.created_by.id,
                    });
                  }
                } else if (arr.type == "people") {
                  rollupType = "people";
                  if (arr.people.length == 0) {
                    rollupArrayValues.push("No name");
                  } else {
                    // Check if property.people exists and is an array
                    if (arr.people && Array.isArray(arr.people)) {
                      if (arr.people.length == 0) {
                        value = "No name";
                      } else {
                        arr.people.forEach((peps) => {
                          // Check if peps is an object and has the 'id' property
                          if (
                            peps &&
                            typeof peps === "object" &&
                            "id" in peps
                          ) {
                            rollupArrayValues.push({
                              name: peps.name,
                              id: peps.id,
                            });
                          }
                        });
                      }
                    }
                  }
                } else if (arr.type == "formula") {
                  rollupType = "formula";
                  if (arr.formula.type == "string") {
                    rollupArrayValues.push(arr.formula.string);
                    formulaType = arr.formula.type;
                  } else if (arr.formula.type == "number") {
                    formulaType = arr.formula.type;
                    rollupArrayValues.push(arr.formula.number);
                  } else if (arr.formula.type == "date") {
                    formulaType = arr.formula.type;
                    rollupArrayValues.push({
                      start: arr.formula.date.start,
                      end: arr.formula.date.end,
                    });
                  } else if (arr.formula.type == "number") {
                    formulaType = arr.formula.type;
                    rollupArrayValues.push(arr.formula.number);
                  } else if (arr.formula.type == "boolean") {
                    rollupArrayValues.push(arr.formula.boolean);
                    formulaType = "checkbox";
                  }
                } else if (arr.type == "relation") {
                  rollupType = "relation";
                  if (arr.relation.length == 0) {
                    rollupArrayValues.push("No relation");
                  } else {
                    arr.relation.map((relate) => {
                      rollupArrayValues.push(relate.id);
                    });
                  }
                }
              });
            } else if (property.rollup.type == "date") {
              rollupType = "date";
              rollupArrayValues.push({
                start: property.rollup.date.start,
                end: property.rollup.date.end,
              });
            }

            value = rollupArrayValues;
          }

          const sampleExtracted = {
            name: propertyName,
            id: id,
            type: propertyType,
            value: value,
            formulaType: formulaType ? formulaType : null,
            rollupType: rollupType ? rollupType : null,
          };
          // Store the result in the array
          setExtractedProperties((prevValue) => [
            ...prevValue,
            sampleExtracted,
          ]);
          // extractedProperties.push({
          //   name: propertyName,
          //   id: id,
          //   type: propertyType,
          //   value: value,
          //   formulaType: formulaType ? formulaType : null,
          //   rollupType: rollupType ? rollupType : null,
          // });
        }
      }
    });
  }, [rows]);

  // now we should store the updated data to firestore to do that check if any values updated using data state, check like this data.filter == filter
  useEffect(() => {
    if (xAxis != null && xAxis != undefined) {
      let XAxisData;
      let extractedXValues;
      console.log(extractedProperties);
      if (extractedProperties.length > 0) {
        XAxisData = extractedProperties.filter((obj) => obj.id == xAxis);
      } else {
        setXAxisValues([]);
      }
      if (XAxisData) {
        console.log(" x filtering");

        extractedXValues = XAxisData.map((obj) => {
          if (
            obj.type == "people" ||
            obj.type == "created_by" ||
            obj.type == "last_edited_by" ||
            obj.rollupType == "people" ||
            obj.rollupType == "created_by" ||
            obj.rollupType == "last_edited_by"
          ) {
            if (obj.value != "No name") {
              return obj.value[0].name;
            } else {
              return obj.value;
            }
          } else if (
            obj.type == "date" ||
            obj.formulaType == "date" ||
            obj.rollupType == "date"
          ) {
            let date = "";
            obj.value.map((d) => {
              var startDate = new Date(d.start);
              var formattedStartDate = startDate.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "2-digit",
              });
              date = formattedStartDate;
            });
            return date;
          } else if (
            obj.rollupType == "created_time" ||
            obj.rollupType == "last_edited_time" ||
            obj.type == "created_time" ||
            obj.type == "last_edited_time"
          ) {
            let date = obj.value[0];

            return date;
          } else if (
            obj.type === "rich_text" ||
            obj.formulaType === "string" ||
            obj.type === "url" ||
            obj.type === "email" ||
            obj.rollupType === "rich_text" ||
            obj.rollupType === "string" ||
            obj.rollupType === "url" ||
            obj.rollupType === "email"
          ) {
            if (Array.isArray(obj.value)) {
              return obj.value[0];
            }
          } else if (
            obj.type === "number" ||
            obj.formulaType === "number" ||
            obj.rollupType === "number" ||
            obj.type === "phone_number" ||
            obj.rollupType === "phone_number"
          ) {
            if (Array.isArray(obj.value)) {
              return obj.value[0];
            }
          } else if (
            obj.type === "checkbox" ||
            obj.formulaType === "checkbox" ||
            obj.rollupType === "checkbox"
          ) {
            if (Array.isArray(obj.value)) {
              return obj.value[0];
            }
          }
          return obj.value;
        });

        setXAxisValues(extractedXValues);
        colNameAndId.forEach((col) => {
          if (col.id === xAxis) {
            setXAxisName(col.name);
            return; // Exit the loop early
          }
          if (col.id === yAxis) {
            setYAxisName(col.name);
            return;
          }
        });
      }
      // setXAxisValues()
    }
    console.log(xAxisValues);
  }, [extractedProperties]);

  useEffect(() => {
    if (yAxis != null && yAxis != undefined) {
      let YAxisData;
      if (extractedProperties.length > 0) {
        YAxisData = extractedProperties.filter((obj) => obj.id == yAxis);
      } else {
        setYAxisValues([]);
      }
      if (YAxisData) {
        console.log(" y filtering");
        const extractedYValues = YAxisData.map((obj) => {
          if (aggregation == "count") {
            if (Array.isArray(obj.value)) {
              return obj.value.length;
            } else {
              return 1;
            }
          } else if (aggregation == "sum") {
            if (Array.isArray(obj.value)) {
              let sum = 0;
              obj.value.forEach((element) => {
                sum += parseInt(element);
              });
              return sum;
            } else {
              return obj.value;
            }
          }
          return obj.value;
        });
        // Store the result in the state variable
        setYAxisValues(extractedYValues);
        colNameAndId.forEach((col) => {
          if (col.id === xAxis) {
            setXAxisName(col.name);
            return; // Exit the loop early
          }
          if (col.id === yAxis) {
            setYAxisName(col.name);
            return;
          }
        });
      }
      // setXAxisValues()
    }
    console.log(yAxisValues);
  }, [extractedProperties]);

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
              yAxisName={yAxisName}
              xAxisName={xAxisName}
              dataType={dataType}
              currencyType={currencyType}
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
              fillSingleColor={fillSingleColor}
              fillMultiColor={fillMultiColor}
              backgroundColor={backgroundColor}
              fillColorStatus={fillColorStatus}
              legend={legend}
              legendPosition={legendPosition}
              yAxisName={yAxisName}
              xAxisName={xAxisName}
              dataType={dataType}
              currencyType={currencyType}
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
              yAxisName={yAxisName}
              xAxisName={xAxisName}
              dataType={dataType}
              currencyType={currencyType}
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
              yAxisName={yAxisName}
              xAxisName={xAxisName}
              dataType={dataType}
              currencyType={currencyType}
            />
          </div>
        );
        break;
      default:
        setChartComponent(<Skeleton className="w-full h-full rounded" />);
    }
    setFetchingData(false);
  }, [chartType, xAxisValues, yAxisValues, backgroundColor]);

  function refreshData() {
    setFetchingData(true);
    setCount(count + 1);
  }

  useEffect(() => {
    const saveToDb = async () => {
      if (data && xAxisValues && yAxisValues) {
        console.log(data.yAxis);
        const yaxis = data.yaxis.split(", ").map(Number);
        const xaxis = data.xaxis.split(", ");

        console.log(xaxis);
        console.log(xAxisValues);

        console.log(yaxis);
        console.log(yAxisValues);

        function arraysAreEqual(arr1, arr2) {
          if (arr1.length !== arr2.length) return false;
          for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
          }
          return true;
        }

        const isYEqual = arraysAreEqual(yAxis, yAxisValues);
        const isXEqual = arraysAreEqual(xaxis, xAxisValues);
        console.log(backgroundColor);
        console.log(data.backgroundColor);
        console.log(backgroundColor == data.backgroundColor);
        if (isXEqual && isYEqual && backgroundColor == data.backgroundColor) {
          console.log("returning");
          return;
        } else {
          console.log("updating");
          let name;
          if (labelStatus) {
            name = "";
          } else {
            if (label == undefined) {
              name = "";
            } else {
              name = label;
            }
          }
          let dataTypeToSave;
          if (dataType == "number" || dataType == "percentage") {
            dataTypeToSave = dataType;
          } else {
            dataTypeToSave = currencyType;
          }
          //converting array values to comma seperated values
          const xAxisCommaVales = xAxisValues.join(", ");
          const yAxisCommaVales = yAxisValues.join(", ");
          const data = {
            xaxis: xAxisCommaVales,
            yaxis: yAxisCommaVales,
            xaxisId: xAxis,
            yaxisId: yAxis,
            xAxisName: xAxisName,
            yAxisName: yAxisName,
            backgroundColor: backgroundColor,
          };

          //updating current fb firestore
          const { result, error } = await addDataWithId("graphs", id, data);
          if (result) {
            console.log(result);
          }
          console.log(result);
          console.log(error);
          if (error) {
            return console.log(error);
          }
        }
      }
    };

    saveToDb();
  }, [xAxisValues, yAxisValues, backgroundColor]);

  function changeBgColor() {
    if (backgroundColor == "#191919") {
      setBackgroundColor("#ffffff");
    } else {
      setBackgroundColor("#191919");
    }
  }
  return (
    <>
      <div className="embed-container" style={{ background: backgroundColor }}>
        {/* Refresh button */}

        <div className="refresh-button">
          {backgroundColor.trim().toLowerCase() == "#ffffff" ? (
            fetchingData ? (
              <LoaderLight />
            ) : (
              <button onClick={refreshData}>
                <RefreshLight className="h-8 w-8" />
              </button>
            )
          ) : fetchingData ? (
            <LoadingDark />
          ) : (
            <button onClick={refreshData}>
              <DarkRefresh className="h-8 w-8" />
            </button>
          )}
        </div>
        <button className="mode-button" onClick={changeBgColor}>
          {backgroundColor.trim().toLowerCase() == "#ffffff" ? (
            <DarkMode className="w-8 h-8" />
          ) : (
            <LightMode className="w-8 h-8" />
          )}
        </button>
        <main style={{ height: "100vh", width: "100vhw" }}>
          {chartComponent}
        </main>
      </div>
    </>
  );
}
