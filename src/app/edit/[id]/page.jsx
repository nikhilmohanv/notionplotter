"use client";
import { Input } from "@/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
  SelectGroup,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Toggle } from "@/components/ui/toggle";
import { useCookies } from "next-client-cookies";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";
import addDataWithId from "@/firebase/firestore/adddatawithid";
import AreaChart from "@/components/charts/area/area";
import LoggedInNavBar from "@/components/basic/navbar/loggedin-navbar";
import BarChart from "@/components/charts/bar/bar";
import DoughnutChart from "@/components/charts/doughnut/doughnut";
import PieChart from "@/components/charts/pie/pie";
import { Skeleton } from "@/components/ui/skeleton";
import Filter from "@/app/filters/filter";

export default function Edit() {
  const cookies = useCookies();
  const cookieUid = cookies.get("uid");
  const pathname = usePathname();
  const id = pathname.slice(6);
  //store data from firebase database
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

  //adding new empty string to the state fillMultiColor
  const handleAddFillColor = () => {
    setFillMultiColor([...fillMultiColor, "#000000"]);
  };
  //adding the value to the state
  const addNewColor = (event, index) => {
    let { name, value } = event.target;
    let onChangeValue = [...lineMultiColor];
    onChangeValue[index] = value;
    setLineMultiColor(onChangeValue);
  };

  //adding new value to fill color variable
  const addNewFillColor = (event, index) => {
    let { name, value } = event.target;
    let onChangeValue = [...fillMultiColor];
    onChangeValue[index] = value;
    setFillMultiColor(onChangeValue);
  };

  // manage filters from child <Filter> component
  const getFilters = (filter, orAnd) => {
    setFilters(filter);
    setAndOr(orAnd);
  };

  //store chart type
  const [chartType, setChartType] = useState("");

  const previewurl = "localhost:3000/preview/" + id;
  console.log(chartType);

  //fetch data from api api/firebase/getdocument
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

  //fetch data from api/notion/retrievecolumns?id=${id}
  useEffect(() => {
    if (dbId !== null && dbId !== undefined) {
      fetch("/api/notion/retrievecolumns?id=" + dbId, {
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
  }, [dbId]);

  //fetch data from api api/notion/querydb?id={id} this have all the row information
  useEffect(() => {
    console.log(filters);

    if (dbId !== null && dbId !== undefined) {
      setFilterLoadingState(true);

      console.log("20");
      fetch("/api/notion/querydb?id=" + dbId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filters, andOr }),
      })
        .then((response) => response.json())
        .then((data) => {
          setRows(data);
          setFilterLoadingState(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [dbId, filters]);

  console.log(rows);
  //setting lablel status to true or false
  // const handleLabelStatus = () => {
  //   setLabelStatus(!labelStatus);
  // };

  //store datas to the firestore
  const saveToDb = async (e) => {
    setSavingStatus(true);
    e.preventDefault();
    let name;
    let yAxisName;
    let xAxisName;

    colNameAndId.forEach((col) => {
      if (col.id === xAxis) {
        xAxisName = col.name;
        return; // Exit the loop early
      }
      if (col.id === yAxis) {
        yAxisName = col.name;
        return;
      }
    });
    if (labelStatus) {
      name = "";
    } else {
      if (label == undefined) {
        name = "";
      } else {
        name = label;
      }
    }

    //converting array values to comma seperated values
    const xAxisCommaVales = xAxisValues.join(", ");
    const yAxisCommaVales = yAxisValues.join(", ");
    const data = {
      label: name,
      labelStatus: labelStatus,
      xaxis: xAxisCommaVales,
      yaxis: yAxisCommaVales,
      xaxisId: xAxis,
      yaxisId: yAxis,
      xAxisName: xAxisName,
      yAxisName: yAxisName,
      lineSingleColor: lineSingleColor,
      fillSingleColor: fillSingleColor,
      fillMultiColor: fillMultiColor,
      backgroundColor: backgroundColor,
      lineMultiColor: lineMultiColor,
      colorStatus: colorStatus,
      type: chartType,
      fillColorStatus: fillColorStatus,
      filters: filters,
      andOr: andOr,
      aggregation: aggregation,
    };

    //updating current fb firestore
    const { result, error } = await addDataWithId("graphs", id, data);
    setSavingStatus(false);
    if (result) {
      console.log(result);

      //return router.push(`/edit/${result.id}`);
    }

    if (error) {
      return console.log(error);
    }
  };

  //it stores extracted data from the api
  let extractedProperties = [];
  useEffect(() => {
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
          let rollupArrayValues = [];

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
              value = property.rollup.number;

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

          // Store the result in the array
          extractedProperties.push({
            name: propertyName,
            id: id,
            type: propertyType,
            value: value,
            formulaType: formulaType ? formulaType : null,
            rollupType: rollupType ? rollupType : null,
          });
        }
      }
    });
  }, [rows, filters, xAxis, yAxis]);

  useEffect(() => {
    if (xAxis != null && xAxis != undefined) {
      let XAxisData;
      if (extractedProperties.length > 0) {
        console.log(xAxis);
        XAxisData = extractedProperties.filter((obj) => obj.id == xAxis);
      }
      //console.log(axisData)
      if (XAxisData) {
        const extractedXValues = XAxisData.map((obj) => {
          if (
            obj.type == "people" ||
            obj.type == "created_by" ||
            obj.type == "last_edited_by" ||
            obj.rollupType == "people" ||
            obj.rollupType == "created_by" ||
            obj.rollupType == "last_edited_by"
          ) {
            if (obj.value != "No name") {
              // let name: any = "";
              // obj.value.map((n) => {
              //   name = name + n.name + " ";
              // });
              // return name;
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
            obj.type === "title" ||
            obj.type === "email" ||
            obj.rollupType === "rich_text" ||
            obj.rollupType === "string" ||
            obj.rollupType === "url" ||
            obj.rollupType === "title" ||
            obj.rollupType === "email"
          ) {
            return obj.value[0];
          } else if (
            obj.type === "number" ||
            obj.formulaType === "number" ||
            obj.rollupType === "number" ||
            obj.type === "phone_number" ||
            obj.rollupType === "phone_number"
          ) {
            console.log("before extraction", obj.value);
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
        console.log("extracted x", extractedXValues);

        // Store the result in the state variable
        setXAxisValues(extractedXValues);
        // console.log(xAxisValues);
      }
      // setXAxisValues()
    }
  }, [xAxis, extractedProperties]);

  useEffect(() => {
    if (yAxis != null && yAxis != undefined) {
      let YAxisData;
      if (extractedProperties.length > 0) {
        console.log(yAxis);
        YAxisData = extractedProperties.filter((obj) => obj.id == yAxis);
      }
      //console.log(axisData)
      if (YAxisData) {
        const extractedYValues = YAxisData.map((obj) => {
          if (aggregation == "count") {
            if (Array.isArray(obj.value)) {
              console.log("aggregation ", obj.value);
              console.log("length ", obj.value.length);
              return obj.value.length;
            } else {
              console.log("it is a string");
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

        //console.log(extractedValues);
        // Store the result in the state variable
        console.log("extracted y", extractedYValues);

        setYAxisValues(extractedYValues);
        // console.log(xAxisValues);
      }
      // setXAxisValues()
    }
  }, [yAxis, aggregation, extractedProperties]);

  // changing the xaxis and yaxis ids
  const handleXSelect = (value) => {
    setXAxis(value);
  };

  const handleYSelect = (value) => {
    setYAxis(value);
  };

  const handleAggregationChange = (value) => {
    setAggregation(value);
    console.log("aggregation changed", aggregation);
  };

  return (
    <>
      <LoggedInNavBar />

      <div key="1" className="flex flex-col h-screen md:flex-row">
        <aside className="w-full lg:w-[400px] bg-gray-100 p-6 md:w-[300px] lg:overflow-auto md:overflow-auto">
          {/* <h2 className="text-lg font-semibold mb-4">Chart Settings</h2> */}
          <div className="grid grid-col-3">
            <div>
              <Link href={"/dashboard"}>
                <LeftArrow />
              </Link>
            </div>
          </div>
          <br />
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Chart type</h3>
            <div className="grid grid-cols-4 gap-4">
              {/* bar chart */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center mr-2">
                      <input
                        className="mr-2"
                        id="barChart"
                        type="radio"
                        name="chartType"
                        value="Bar Chart"
                        onChange={(e) => {
                          setChartType(e.target.value);
                        }}
                        style={{
                          opacity: 0,
                          position: "absolute",
                          height: 1,
                          width: 1,
                        }}
                      />

                      <label htmlFor="barChart">
                        {chartType != "Bar Chart" ? (
                          <Button
                            variant="outline"
                            onClick={() => setChartType("Bar Chart")}
                          >
                            <BarChartIconBlack className="text-indigo-600" />
                          </Button>
                        ) : (
                          <Button>
                            <BarChartIconWhite className="text-indigo-600" />
                          </Button>
                        )}
                      </label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bar Chart</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Area Chart */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center mr-2">
                      <input
                        className="mr-2"
                        id="areaChart"
                        type="radio"
                        name="chartType"
                        value="Area Chart"
                        onChange={(e) => {
                          setChartType(e.target.value);
                        }}
                        style={{
                          opacity: 0,
                          position: "absolute",
                          height: 1,
                          width: 1,
                        }}
                      />

                      <label htmlFor="areaChart">
                        {chartType != "Area Chart" ? (
                          <Button
                            variant="outline"
                            onClick={() => setChartType("Area Chart")}
                          >
                            <AreaChartIconBlack className="text-indigo-600" />
                          </Button>
                        ) : (
                          <Button>
                            <AreaChartIconWhite className="text-indigo-600" />
                          </Button>
                        )}
                      </label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Area Chart</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Pie Chart */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center mr-2">
                      <input
                        className="mr-2"
                        id="pieChart"
                        type="radio"
                        name="chartType"
                        value="Pie Chart"
                        onChange={(e) => {
                          setChartType(e.target.value);
                        }}
                        style={{
                          opacity: 0,
                          position: "absolute",
                          height: 1,
                          width: 1,
                        }}
                      />

                      <label htmlFor="pieChart">
                        {chartType != "Pie Chart" ? (
                          <Button
                            variant="outline"
                            onClick={() => setChartType("Pie Chart")}
                          >
                            <PieChartIconBlack className="text-indigo-600" />
                          </Button>
                        ) : (
                          <Button>
                            <PieChartIconWhite className="text-indigo-600" />
                          </Button>
                        )}
                      </label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pie Chart</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* KPI Chart */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center mr-2">
                      <input
                        className="mr-2"
                        id="doughnutChart"
                        type="radio"
                        name="chartType"
                        value="Doughnut Chart"
                        onChange={(e) => {
                          setChartType(e.target.value);
                        }}
                        style={{
                          opacity: 0,
                          position: "absolute",
                          height: 1,
                          width: 1,
                        }}
                      />

                      <label htmlFor="doughnutChart">
                        {chartType != "Doughnut Chart" ? (
                          <Button
                            variant="outline"
                            onClick={() => setChartType("Doughnut Chart")}
                          >
                            <DoughNutBlack className="text-indigo-600" />
                          </Button>
                        ) : (
                          <Button>
                            <DoughNutWhite className="text-indigo-600" />
                          </Button>
                        )}
                      </label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Doughnut Chart</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Label</h3>
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                <input
                  className="mr-2"
                  id="labelVisibility"
                  type="checkbox"
                  style={{
                    opacity: 0,
                    position: "absolute",
                    height: 1,
                    width: 1,
                  }}
                />

                <label htmlFor="labelVisibility">
                  {labelStatus ? (
                    <Button
                      variant="outline"
                      onClick={() => setLabelStatus(!labelStatus)}
                    >
                      <EyeClose />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setLabelStatus(!labelStatus)}
                    >
                      <EyeOpen className="text-gray-400" />
                    </Button>
                  )}
                </label>
              </div>

              <Input
                placeholder="Enter label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                // {labelStatus&& disabled}
                disabled={labelStatus ? true : false}
              />
            </div>
            {/* </div> */}
          </div>

          {/* graph line color */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Line Color</h3>
            {dbUid != undefined && (
              <Tabs defaultValue={colorStatus} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="lineSingle"
                    onClick={() => {
                      setColorStatus("lineSingle");
                    }}
                  >
                    Single Color
                  </TabsTrigger>
                  <TabsTrigger
                    value="lineMulti"
                    onClick={() => {
                      setColorStatus("lineMulti");
                    }}
                  >
                    Multi Color
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="lineSingle">
                  <div className="w-full bg-neutral-50 rounded">
                    <input
                      type="color"
                      value={lineSingleColor}
                      onChange={(e) => setLineSingleColor(e.target.value)}
                      className="w-12 h-12 p-0 m-2"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="lineMulti">
                  <div className="w-full bg-neutral-50 rounded">
                    {lineMultiColor.map((item, index) => (
                      <>
                        <input
                          name="color"
                          type="color"
                          key={index}
                          value={item}
                          onChange={(event) => addNewColor(event, index)}
                          className="w-12 h-12 p-0 m-2"
                        />
                        {index === lineMultiColor.length - 1 && (
                          <button onClick={() => handleAddColor()}>
                            <PlusIcon className="w-12 h-12 p-0 " />
                          </button>
                        )}
                      </>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>

          {/* area filling color selection */}
          {dbUid != undefined && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Fill Color</h3>
              <Tabs defaultValue={fillColorStatus} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="fillSingle"
                    onClick={() => {
                      setFillColorStatus("fillSingle");
                    }}
                  >
                    Single Color
                  </TabsTrigger>
                  <TabsTrigger
                    value="fillMulti"
                    onClick={() => {
                      setFillColorStatus("fillMulti");
                    }}
                  >
                    Multi Color
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="fillSingle">
                  <div className="w-full bg-neutral-50 rounded">
                    <input
                      type="color"
                      value={fillSingleColor}
                      onChange={(e) => setFillSingleColor(e.target.value)}
                      className="w-12 h-12 p-0 m-2"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="fillMulti">
                  <div className="w-full bg-neutral-50 rounded">
                    {fillMultiColor.map((item, index) => (
                      <>
                        <input
                          name="color"
                          type="color"
                          value={item}
                          onChange={(event) => addNewFillColor(event, index)}
                          className="w-12 h-12 p-0 m-2"
                        />
                        {index === fillMultiColor.length - 1 && (
                          <button onClick={() => handleAddFillColor()}>
                            <PlusIcon className="w-12 h-12 p-0 " />
                          </button>
                        )}
                      </>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* background color selector */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Background Color</h3>
            <div className="w-full bg-neutral-50 rounded">
              <label htmlFor="bgcolor">
                <input
                  type="color"
                  name="bgcolor"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-12 p-0 m-2"
                />
              </label>
            </div>
          </div>

          {/* xaxis values */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">X-Axis</h3>
            <Select onValueChange={handleXSelect} defaultValue={xAxisName}>
              <SelectTrigger id="xaxis">
                <SelectValue placeholder={xAxisName} />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {colNameAndId.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* yaxis values */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Y-Axis</h3>
            <Select onValueChange={handleYSelect} defaultValue={yAxisName}>
              <SelectTrigger id="xaxis">
                <SelectValue placeholder={yAxisName} />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {colNameAndId.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* aggregation function */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Aggregation</h3>
            <Select
              onValueChange={handleAggregationChange}
              defaultValue={aggregation}
            >
              <SelectTrigger id="aggregation">
                <SelectValue placeholder={aggregation} />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="count">Count</SelectItem>
                  <SelectItem value="sum">Sum</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Filter
            getFilters={getFilters}
            dbId={dbId}
            filterLoadingState={filterLoadingState}
            filters={filters}
            colNameAndId={colNameAndId}
            orAnd={andOr}
          />
          <br />
          <br />
          {/*  saving button */}
          <Button onClick={saveToDb}>
            {savingStatus ? "Saving.." : "Save"}
          </Button>
        </aside>

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
            />
          ) : chartType == "Doughnut Chart" ? (
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
          ) : chartType == "Pie Chart" ? (
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
            />
          ) : (
            <Skeleton className="w-full h-[600px] rounded" />
          )}
        </main>
      </div>
    </>
  );
}

function AreaChartIconBlack(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function AreaChartIconWhite(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function BarChartIconBlack(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black" // Change stroke color to black
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}

function BarChartIconWhite(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white" // Change stroke color to black
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}

function PieChartIconBlack(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

function PieChartIconWhite(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

function EyeOpen(props) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z"
        fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"
      ></path>
    </svg>
  );
}

function EyeClose(props) {
  return (
    <svg
      {...props}
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3536 2.35355C13.5488 2.15829 13.5488 1.84171 13.3536 1.64645C13.1583 1.45118 12.8417 1.45118 12.6464 1.64645L10.6828 3.61012C9.70652 3.21671 8.63759 3 7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C0.902945 9.08812 2.02314 10.1861 3.36061 10.9323L1.64645 12.6464C1.45118 12.8417 1.45118 13.1583 1.64645 13.3536C1.84171 13.5488 2.15829 13.5488 2.35355 13.3536L4.31723 11.3899C5.29348 11.7833 6.36241 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C14.0971 5.9119 12.9769 4.81391 11.6394 4.06771L13.3536 2.35355ZM9.90428 4.38861C9.15332 4.1361 8.34759 4 7.5 4C4.80285 4 2.52952 5.37816 1.09622 7.50001C1.87284 8.6497 2.89609 9.58106 4.09974 10.1931L9.90428 4.38861ZM5.09572 10.6114L10.9003 4.80685C12.1039 5.41894 13.1272 6.35031 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11C6.65241 11 5.84668 10.8639 5.09572 10.6114Z"
        fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"
      ></path>
    </svg>
  );
}
function DoughNutBlack(props) {
  return (
    <svg
      {...props}
      width="25px"
      height="25px"
      viewBox="-1.05 -1.05 17.10 17.10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#000000"
      stroke-width="0.5399999999999999"
      transform="matrix(1, 0, 0, 1, 0, 0)"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke="#CCCCCC"
        stroke-width="0.03"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M0 7.49996C0 3.52583 3.09098 0.27365 7 0.0163574V4.0354C5.30385 4.27801 4 5.73672 4 7.49996C4 9.43295 5.567 11 7.5 11C8.28618 11 9.01181 10.7407 9.5961 10.3031L12.438 13.1451C11.1188 14.3 9.39113 15 7.5 15C3.35786 15 0 11.6421 0 7.49996Z"
          fill="#000000"
        ></path>{" "}
        <path
          d="M13.1451 12.438C14.3001 11.1187 15 9.39107 15 7.49996C15 6.46644 14.7909 5.48175 14.4128 4.58586L10.7552 6.21147C10.9132 6.61024 11 7.04496 11 7.49996C11 8.28611 10.7408 9.01174 10.3032 9.59602L13.1451 12.438Z"
          fill="#000000"
        ></path>{" "}
        <path
          d="M8 4.0354V0.0163574C10.5416 0.183645 12.7373 1.61699 13.9626 3.69166L10.2541 5.33986C9.71063 4.64791 8.91203 4.16585 8 4.0354Z"
          fill="#000000"
        ></path>{" "}
      </g>
    </svg>
  );
}
function DoughNutWhite(props) {
  return (
    <svg
      {...props}
      width="25px"
      height="25px"
      viewBox="-1.05 -1.05 17.10 17.10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#fffff"
      stroke-width="0.5399999999999999"
      transform="matrix(1, 0, 0, 1, 0, 0)"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke="#fffCCCCCC"
        stroke-width="0.03"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M0 7.49996C0 3.52583 3.09098 0.27365 7 0.0163574V4.0354C5.30385 4.27801 4 5.73672 4 7.49996C4 9.43295 5.567 11 7.5 11C8.28618 11 9.01181 10.7407 9.5961 10.3031L12.438 13.1451C11.1188 14.3 9.39113 15 7.5 15C3.35786 15 0 11.6421 0 7.49996Z"
          fill="#fff"
        ></path>{" "}
        <path
          d="M13.1451 12.438C14.3001 11.1187 15 9.39107 15 7.49996C15 6.46644 14.7909 5.48175 14.4128 4.58586L10.7552 6.21147C10.9132 6.61024 11 7.04496 11 7.49996C11 8.28611 10.7408 9.01174 10.3032 9.59602L13.1451 12.438Z"
          fill="#fff"
        ></path>{" "}
        <path
          d="M8 4.0354V0.0163574C10.5416 0.183645 12.7373 1.61699 13.9626 3.69166L10.2541 5.33986C9.71063 4.64791 8.91203 4.16585 8 4.0354Z"
          fill="#fff"
        ></path>{" "}
      </g>
    </svg>
  );
}

function LeftArrow(props) {
  return (
    <svg
      {...props}
      height="25px"
      width="25px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z"
          fill="#000000"
        ></path>{" "}
      </g>
    </svg>
    // <svg
    //   {...props}
    //   height="25px"
    //   width="25px"
    //   viewBox="-0.5 0 25 25"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    // >
    //   <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    //   <g
    //     id="SVGRepo_tracerCarrier"
    //     stroke-linecap="round"
    //     stroke-linejoin="round"
    //   ></g>
    //   <g id="SVGRepo_iconCarrier">
    //     {" "}
    //     <path
    //       d="M12 22.4199C17.5228 22.4199 22 17.9428 22 12.4199C22 6.89707 17.5228 2.41992 12 2.41992C6.47715 2.41992 2 6.89707 2 12.4199C2 17.9428 6.47715 22.4199 12 22.4199Z"
    //       stroke="#000000"
    //       stroke-width="1.5"
    //       stroke-linecap="round"
    //       stroke-linejoin="round"
    //     ></path>{" "}
    //     <path
    //       d="M13.4102 16.4199L10.3502 13.55C10.1944 13.4059 10.0702 13.2311 9.98526 13.0366C9.9003 12.8422 9.85645 12.6321 9.85645 12.4199C9.85645 12.2077 9.9003 11.9979 9.98526 11.8035C10.0702 11.609 10.1944 11.4342 10.3502 11.29L13.4102 8.41992"
    //       stroke="#000000"
    //       stroke-width="1.5"
    //       stroke-linecap="round"
    //       stroke-linejoin="round"
    //     ></path>{" "}
    //   </g>
    // </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      height="25px"
      width="25px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M4 12H20M12 4V20"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>{" "}
      </g>
    </svg>
    // <svg
    //   {...props}
    //   height="25px"
    //   width="25px"
    //   viewBox="0 0 24 24"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    //   stroke="#000000"
    // >
    //   <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    //   <g
    //     id="SVGRepo_tracerCarrier"
    //     stroke-linecap="round"
    //     stroke-linejoin="round"
    //   ></g>
    //   <g id="SVGRepo_iconCarrier">
    //     {" "}
    //     <path
    //       d="M9 12H15"
    //       stroke="#323232"
    //       stroke-width="2"
    //       stroke-linecap="round"
    //       stroke-linejoin="round"
    //     ></path>{" "}
    //     <path
    //       d="M12 9L12 15"
    //       stroke="#323232"
    //       stroke-width="2"
    //       stroke-linecap="round"
    //       stroke-linejoin="round"
    //     ></path>{" "}
    //     <path
    //       d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z"
    //       stroke="#323232"
    //       stroke-width="2"
    //     ></path>{" "}
    //   </g>
    // </svg>
  );
}
