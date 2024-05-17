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
import {
  AreaChartIconBlack,
  AreaChartIconWhite,
  BarChartIconBlack,
  BarChartIconWhite,
  PieChartIconBlack,
  PieChartIconWhite,
  PlusIcon,
  EyeClose,
  EyeOpen,
  DoughNutBlack,
  DoughNutWhite,
  LeftArrow,
} from "@/components/icons/edit/icons";
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
import { Copy } from "lucide-react";
import { Switch } from "@/components/ui/switch";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

import { Label } from "@/components/ui/label";

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
  const [labelStatus, setLabelStatus] = useState(true);

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

  const [legend, setLegend] = useState(true);

  // for storing legend position
  const [legendPosition, setLegendPosition] = useState("top");
  //this adds a new color input to the multicolor input array
  const handleAddColor = () => {
    setLineMultiColor([...lineMultiColor, "#000000"]);
  };

  const [andOr, setAndOr] = useState("and");
  // for storing filters
  const [filters, setFilters] = useState([]);

  const [filterLoadingState, setFilterLoadingState] = useState(false);

  useEffect(() => {
    // create a program to track if there is any unsaved changes in the input fields if there is any then show a warning
    const unsavedChanges = () => {
      if (
        xAxisValues.length === 0 ||
        yAxisValues.length === 0 ||
        name === "" ||
        xAxisName === "" ||
        yAxisName === "" ||
        legend === false ||
        legendPosition === "" ||
        aggregation === "" ||
        filters.length === 0 ||
        andOr === ""
      ) {
        return false;
      } else {
        return true;
      }
    };
  });

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
  const [extractedProperties, setExtractedProperties] = useState([]);
  //store chart type
  const [chartType, setChartType] = useState("");

  const previewurl = "https://nicksnotion.com/embed/" + id;

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
        data.legend != undefined && setLegend(data.legend);
        data.legendPosition && setLegendPosition(data.legendPosition);
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
          setLabelStatus(true);
        }
      });
  }, [id]);

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
    if (dbId !== null && dbId !== undefined) {
      setFilterLoadingState(true);

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
      legend: legend,
      legendPosition: legendPosition,
    };

    //updating current fb firestore
    const { result, error } = await addDataWithId("graphs", id, data);
    setSavingStatus(false);
    if (result) {
      //return router.push(`/edit/${result.id}`);
    }

    if (error) {
      return console.log(error);
    }
  };

  //it stores extracted data from the api
  useEffect(() => {
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
  }, [rows, filters, xAxis, yAxis]);

  console.log(extractedProperties);

  useEffect(() => {
    console.log("x called");

    if (xAxis != null && xAxis != undefined) {
      console.log(extractedProperties);

      let XAxisData;
      let extractedXValues;
      if (extractedProperties.length > 0) {
        XAxisData = extractedProperties.filter((obj) => obj.id == xAxis);
      }
      if (XAxisData) {
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
              console.log("it is a string array");
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

        console.log("Extracted x values ", extractedXValues);

        // Store the result in the state variable
        console.log("x axis values before insering ", xAxisValues);
        setXAxisValues(extractedXValues);
        console.log("x axis values after insering ", xAxisValues);
      }
      // setXAxisValues()
    }
  }, [xAxis, extractedProperties]);

  useEffect(() => {
    console.log("y called");
    console.log("y axis", yAxis);
    if (yAxis != null && yAxis != undefined) {
      console.log("inside if");
      let YAxisData;
      console.log("extracted properties ", extractedProperties.length);
      if (extractedProperties.length > 0) {
        console.log("inside 2 if");
        YAxisData = extractedProperties.filter((obj) => obj.id == yAxis);
      }
      if (YAxisData) {
        console.log("inside 3 if");

        const extractedYValues = YAxisData.map((obj) => {
          if (aggregation == "count") {
            console.log("inside count if");

            if (Array.isArray(obj.value)) {
              return obj.value.length;
            } else {
              return 1;
            }
          } else if (aggregation == "sum") {
            console.log("inside sum if");

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
        console.log("extracted y", extractedYValues);
        setYAxisValues(extractedYValues);
        console.log("permentant ", yAxisValues);
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
  };

  return (
    <>
      <div className="md:h-screen">
        <LoggedInNavBar />

        <div className="flex flex-col h-full md:flex-row">
          <aside className="w-full lg:w-[400px] bg-gray-100 p-6 md:w-[300px] lg:overflow-auto md:overflow-auto">
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
                {dbId ? (
                  <Input
                    placeholder="Enter label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    // {labelStatus&& disabled}
                    disabled={labelStatus ? true : false}
                  />
                ) : (
                  <Skeleton className="bg-white h-9 w-full" />
                )}
              </div>
              {/* </div> */}
            </div>

            {/* graph line color */}
            {/* <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Line Color</h3>
              {dbId ? (
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
              ) : (
                <Skeleton className="bg-white h-12 w-full" />
              )}
            </div> */}

            {/* area filling color selection */}

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Fill Color</h3>
              {dbId ? (
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
              ) : (
                <Skeleton className="bg-white h-12 w-full" />
              )}
            </div>

            {/* background color selector */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Background Color</h3>
              {dbId ? (
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
              ) : (
                <Skeleton className="bg-white h-9 w-full" />
              )}
            </div>

            {/* xaxis values */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">X-Axis</h3>
              {colNameAndId ? (
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
              ) : (
                <Skeleton className="bg-white h-9 w-full" />
              )}
            </div>

            {/* yaxis values */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Y-Axis</h3>
              {colNameAndId ? (
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
              ) : (
                <Skeleton className="bg-white h-9 w-full" />
              )}
            </div>

            {/* legend */}
            <div>
              <div className="mb-6">
                <div className="flex bg-white flex-row h-12 items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium mb-2">Legend</Label>
                  </div>

                  <Switch checked={legend} onCheckedChange={setLegend} />
                </div>
              </div>
            </div>

            {legend && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Legend Position</h3>
                {dbId && (
                  <Select
                    onValueChange={setLegendPosition}
                    defaultValue={
                      legendPosition != undefined ? legendPosition : "top"
                    }
                  >
                    <SelectTrigger id="legendPosition">
                      <SelectValue placeholder={legendPosition} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="chartArea">Chart Area</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {/* aggregation function */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Aggregation</h3>
              {dbId ? (
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
              ) : (
                <Skeleton className="bg-white h-9 w-full" />
              )}
            </div>

            {/* filter */}
            <div className="sm:mb-14">
              <Filter
                getFilters={getFilters}
                dbId={dbId}
                filterLoadingState={filterLoadingState}
                filters={filters}
                colNameAndId={colNameAndId}
                orAnd={andOr}
              />
            </div>

            {/* save button */}
            <div className="md:sticky md:bottom-9 md:left-0  w-full bg-gray-100 pt-4 md:px-1 pb-2 border-t">
              {savingStatus ? (
                <Button disabled className="w-full">
                  <Loader2 className="mr-2 h-4 w-4  animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button onClick={saveToDb} className="w-full">
                  Save
                </Button>
              )}
            </div>
          </aside>

          <main className="flex-grow p-4">
            <header className="flex justify-between items-center ">
              <div className="ml-auto flex-initial space-x-2">
                <Dialog className="bg-transparent">
                  <DialogTrigger asChild>
                    <Button variant="outline">Get Embed Link</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md ">
                    <DialogHeader>
                      <DialogTitle>Embed link</DialogTitle>
                      <DialogDescription>
                        Anyone who has this link will be able to view the graph.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                          Link
                        </Label>
                        <Input
                          id="embedLink"
                          defaultValue={previewurl}
                          readOnly
                        />
                      </div>
                      <Button
                        onClick={copyToClipboard}
                        size="sm"
                        className="px-3"
                      >
                        <span className="sr-only">Copy</span>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </header>

            {chartType == "Bar Chart" ? (
              <div
                style={{
                  // display: "flex",
                  // justifyContent: "center", // Center horizontally
                  // alignItems: "center", // Center vertically
                  // overflow: "hidden",
                  // height: `75%`,
                  backgroundColor: backgroundColor,
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
                />
              </div>
            ) : chartType == "Area Chart" ? (
              <div
                style={{
                  // display: "flex",
                  // justifyContent: "center", // Center horizontally
                  // alignItems: "center", // Center vertically
                  // overflow: "hidden",
                  // height: `75%`,
                  backgroundColor: backgroundColor,
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
                  yAxisName={yAxisName}
                  xAxisName={xAxisName}
                  legend={legend}
                  legendPosition={legendPosition}
                />
              </div>
            ) : chartType == "Doughnut Chart" ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically
                  overflow: "hidden",
                  height: `75%`,
                  backgroundColor: backgroundColor,
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
                />
              </div>
            ) : chartType == "Pie Chart" ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically
                  overflow: "hidden",
                  height: `75%`,
                  backgroundColor: backgroundColor,
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
                />
              </div>
            ) : (
              <Skeleton className="w-full h-[600px] rounded" />
            )}
          </main>
        </div>
      </div>
    </>
  );
}

function copyToClipboard() {
  // Get the text field
  var copyText = document.getElementById("embedLink");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);
}
