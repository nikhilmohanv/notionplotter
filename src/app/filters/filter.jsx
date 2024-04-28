"use client";
import { useState, useEffect, ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { get } from "http";
import { relative } from "path";
export default function Filter({
  getFilters,
  dbId,
  filterLoadingState,
  filters,
  colNameAndId,
  orAnd,
}) {
  // to store keys keys means equal and not_equal in checkbox and in date after, before equals

  const [rows, setRows] = useState([]);
  const [andOr, setAndOr] = useState(orAnd);
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  const [filter, setFilter] = useState([]);
  const [filterChange, setFilterChange] = useState(false);

  // setting filter state in this page to the filters form the props
  useEffect(() => {
    setFilter(filters);
  }, [filters]);

  // for getting data of all, that is without any filters
  const [sampleFilter, setSampleFilter] = useState([]);

  useEffect(() => {
    if (dbId !== null && dbId !== undefined) {
      fetch("/api/notion/completequerydb?id=" + dbId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setRows(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [dbId]);

  let extractedProperties = [];

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
            value = { start: startDate, end: endDate };
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
            value = property.unique_id.prefix + "-" + property.unique_id.number;
          }
        } else if (property.type == "last_edited_time") {
          propertyType = property.type;
          value = property.last_edited_time;
        } else if (property.type == "created_time") {
          propertyType = property.type;
          value = property.created_time;
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
            value = {
              start: property.formula.date.start,
              end: property.formula.date.end,
            };
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
                        if (peps && typeof peps === "object" && "id" in peps) {
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

  const removeFilter = (index) => {
    let data = [...filter];
    data.splice(index, 1);
    setFilter(data);
  };
  const handleFilterInsertion = (event, index) => {
    let data = [...filter];

    if (event.target.name == "property") {
      let currentLabel = data[index].property.label;
      data[index].property.label = event.target.value;
      let updatedLabel = data[index].property.label;
      if (currentLabel != updatedLabel) {
        data[index].value = "";
        data[index].operator = "";
        data[index].property.type = "";
        data[index].property.value = "";
        if (data[index].formulaType) {
          delete data[index].formulaType;
        }
        if (data[index].rollupType) {
          delete data[index].rollupType;
        }

        if (data[index].rollupOperation) {
          delete data[index].rollupOperation;
        }
      }
      // Filter colNameAndId to find the corresponding column object
      const selectedColumn = colNameAndId.find(
        (col) => col.name === event.target.value
      );
      if (selectedColumn) {
        data[index].property.type = selectedColumn.type;
        data[index].property.value = selectedColumn.id;
      }
      if (data[index].property.type === "formula") {
        const extractedColumn = extractedProperties.find(
          (col) => col.id === data[index].property.value
        );

        data[index].formulaType = extractedColumn?.formulaType;
      }

      if (data[index].property.type === "rollup") {
        const extractedColumn = extractedProperties.find(
          (col) => col.id === data[index].property.value
        );

        data[index].rollupType = extractedColumn?.rollupType;

        if (extractedColumn?.rollupType == "formula") {
          data[index].formulaType = extractedColumn.formulaType;
        }
      }
    } else if (event.target.name == "operation") {
      //10-0
      let currentLabel = data[index].operator;
      data[index].operator = event.target.value;
      let updatedLabel = data[index].operator;

      if (currentLabel != updatedLabel) {
        data[index].value = "";
        data[index].operator = "";

        // if(data[index].rollupOperation){
        //   delete data[index].rollupOperation;
        // }
      }

      if (
        data[index].property.type === "checkbox" ||
        data[index].formulaType === "checkbox" ||
        data[index].rollupType === "checkbox"
      ) {
        data[index].operator = "equals";
        if (event.target.value == "false") {
          data[index].value = false;
        } else if (event.target.value == "true") {
          data[index].value = true;
        }
      } else if (
        event.target.value == "is_empty" ||
        event.target.value == "is_not_empty"
      ) {
        // if (event.target.value === "is_empty") {
        data[index].value = true;

        data[index].operator = event.target.value;
      } else {
        data[index].operator = event.target.value;
      }
    } else if (event.target.name == "value") {
      data[index].value = event.target.value; //string, date, multi_select,number,people
    } else if ("rollupOperation") {
      data[index].rollupOperation = event.target.value;
    }

    setFilter(data);
  };

  const addFields = () => {
    let newfield;
    if (filter.length == 0) {
      newfield = {
        value: "",
        operator: "",
        property: { label: "", type: "", value: "" },
      };

      setFilter([...filter, newfield]);
    } else {
      newfield = {
        value: "",
        operator: "",
        property: { label: "", type: "", value: "" },
      };
      setFilter([...filter, newfield]);
    }
  };

  function handleAndOr(event) {
    setAndOr(event.target.value);
  }

  // to store ids of
  let ids = [];

  function changeFilter() {
    setFilterChange(!filterChange);
    getFilters(filter, andOr);
  }

  function deleteFullFilters(){
    let data = [...filter];
    data.splice(1);
    setFilter(data);
  }
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">Edit Filters</Button>
        </DialogTrigger>
        <DialogContent
          className={`sm:w-[${windowDimensions}px] md:max-w-[800px] bg-white`}
        >
          <DialogHeader>
            <DialogTitle>Edit Filters</DialogTitle>
          </DialogHeader>

          <div
            className={`bg-white md:p-6 rounded-lg xl:w-[425px] lg:w-[700px] sm:w-[${windowDimensions}px] max-w-auto sm:mx-0 mx-auto`}
          >
            {/* <div className="flex items-center space-x-2 mb-4"> */}
            {filter.map((input, index) => (
              // let classname;
              // index  1 ?(
              //     classname="pl-6 flex  items-center space-x-2 mb-4"):(
              //       classname="flex  items-center space-x-2 mb-4")

              <div key={index} className="flex  items-center space-x-1 mb-4">
                {index === 1 ? (
                  // <div className="w-28">
                  <select
                    onChange={(event) => {
                      handleAndOr(event);
                    }}
                    value={andOr}
                    className="px-4 py-2 w-[70px] sm:w-24 border border-gray-600 rounded flex items-center justify-between"
                  >
                    <option value="and">and</option>
                    <option value="or">or</option>
                  </select>
                ) : // </div>
                index === 0 ? (
                  <h3>Where</h3>
                ) : (
                  index > 1 && (
                    <select
                      onChange={(event) => {
                        handleAndOr(event);
                      }}
                      // defaultValue={andOr}
                      value={andOr}
                      className="px-4 py-2 w-[70px] sm:w-24 border border-gray-600 rounded flex items-center justify-between"
                    >
                      <option value="and">and</option>
                      <option value="or">or</option>
                    </select>
                  )
                )}
                <select
                  onChange={(event) => handleFilterInsertion(event, index)}
                  name="property"
                  value={
                    filter[index].property.label.length > 0
                      ? filter[index].property.label
                      : "Select a property"
                  }
                  className="px-4 py-2 flex w-[70px] sm:w-[200px] border border-gray-600 rounded flex items-center justify-between"
                >
                  <option selected disabled>
                    Selct a property
                  </option>
                  {colNameAndId.map((col, colIndex) => (
                    <option value={col.name} key={colIndex}>
                      {col.name}
                    </option>
                  ))}
                </select>
                {filter[index].property.type.length > 0 &&
                  (filter[index].property.type === "checkbox" ||
                  filter[index].formulaType === "checkbox" ||
                  filter[index].formulaType === "boolean" ||
                  filter[index].rollupType === "checkbox" ? (
                    <select
                      name="operation"
                      value={
                        filter[index].operator.length > 0
                          ? filter[index].operator
                          : "Select a operation"
                      }
                      onChange={(event) => handleFilterInsertion(event, index)}
                      // value={input.operator ?input.operator:"select a value"}
                      className="px-4 py-2 border border-gray-600 rounded flex items-center w-[70px] sm:w-36 justify-between"
                    >
                      <option disabled selected>
                        Select a option
                      </option>
                      <option value="true">Is checked</option>
                      <option value="false">Is not checked</option>
                    </select>
                  ) : filter[index].property.type === "date" ||
                    filter[index].formulaType === "date" ||
                    filter[index].property.type === "created_time" ||
                    filter[index].property.type === "last_edited_time" ||
                    filter[index].rollupType === "date" ||
                    filter[index].rollupType === "created_time" ||
                    filter[index].rollupType === "last_edited_time" ? (
                    <select
                      name="operation"
                      value={filter[index].operator}
                      onChange={(event) => handleFilterInsertion(event, index)}
                      className="px-4 py-2 border border-gray-600 rounded flex items-center w-[70px] sm:w-36 justify-between"
                    >
                      {" "}
                      <option selected disabled>
                        Selct a property
                      </option>
                      <option value="after">After</option>
                      <option value="before">Before</option>
                      <option value="equals">Equals</option>
                      <option value="is_empty">Is empty</option>
                      <option value="is_not_empty">Is not empty</option>
                      <option value="next_month">Next month</option>
                      <option value="next_week">Next week</option>
                      <option value="next_year">Next year</option>
                      <option value="past_month">Past month</option>
                      <option value="past_week">Past week</option>
                      <option value="past_year">Past year</option>
                      <option value="on_or_after">On or after</option>
                      <option value="on_or_before">On or before</option>
                    </select>
                  ) : filter[index].property.type === "files" ||
                    filter[index].rollupType === "files" ? (
                    <select
                      name="operation"
                      value={filter[index].operator}
                      onChange={(event) => handleFilterInsertion(event, index)}
                      className="px-4 py-2 border border-gray-600 w-[70px] sm:w-36 rounded flex items-center sm:w-36 justify-between"
                    >
                      {" "}
                      <option selected disabled>
                        Selct a property
                      </option>
                      <option value="is_empty">Is empty</option>
                      <option value="is_not_empty">Is not empty</option>
                    </select>
                  ) : filter[index].property.type === "multi_select" ||
                    filter[index].rollupType === "multi_select" ? (
                    <select
                      name="operation"
                      value={filter[index].operator}
                      onChange={(event) => handleFilterInsertion(event, index)}
                      className="px-4 py-2 border border-gray-600 rounded flex items-center w-[70px] sm:w-36 justify-between"
                    >
                      {" "}
                      <option selected disabled>
                        Selct a property
                      </option>
                      <option value="is_empty">Is empty</option>
                      <option value="is_not_empty">Is not empty</option>
                      <option value="contains">Contains</option>
                      <option value="does_not_contain">Does not contain</option>
                    </select>
                  ) : filter[index].property.type === "number" ||
                    filter[index].rollupType === "number" ||
                    filter[index].formulaType === "number" ? (
                    <select
                      name="operation"
                      value={filter[index].operator}
                      onChange={(event) => handleFilterInsertion(event, index)}
                      className="px-4 py-2 border border-gray-600 rounded flex items-center w-[70px] sm:w-36 justify-between"
                    >
                      {" "}
                      <option selected disabled>
                        Selct a property
                      </option>
                      <option value="is_empty">Is empty</option>
                      <option value="is_not_empty">Is not empty</option>
                      <option value="equals">Equals to</option>
                      <option value="does_not_equal">Does not equal to</option>
                      <option value="greater_than">Greater than</option>
                      <option value="greater_than_or_equal_to">
                        Greater than or equal to
                      </option>
                      <option value="less_than">Less than</option>
                      <option value="less_than_or_equal_to">
                        Less than or equal to
                      </option>
                    </select>
                  ) : filter[index].property.type === "phone_number" ||
                    filter[index].rollupType === "phone_number" ? (
                    <select
                      name="operation"
                      value={filter[index].operator}
                      onChange={(event) => handleFilterInsertion(event, index)}
                      className="px-4 py-2 border border-gray-600 rounded flex items-center w-[70px] sm:w-36 justify-between"
                    >
                      {" "}
                      <option selected disabled>
                        Selct a property
                      </option>
                      <option value="is_empty">Is empty</option>
                      <option value="is_not_empty">Is not empty</option>
                      <option value="equals">Equals to</option>
                      <option value="does_not_equal">Does not equal to</option>
                      <option value="greater_than">Greater than</option>
                      <option value="greater_than_or_equal_to">
                        Greater than or equal to
                      </option>
                      <option value="less_than">Less than</option>
                      <option value="less_than_or_equal_to">
                        Less than or equal to
                      </option>
                    </select>
                  ) : filter[index].property.type === "people" ||
                    filter[index].property.type === "created_by" ||
                    filter[index].property.type === "last_edited_by" ||
                    filter[index].rollupType === "people" ||
                    filter[index].rollupType === "created_by" ||
                    filter[index].rollupType === "last_edited_by" ? (
                    <select
                      name="operation"
                      value={filter[index].operator}
                      onChange={(event) => handleFilterInsertion(event, index)}
                      className="px-4 py-2 border border-gray-600 rounded flex items-center w-[70px] sm:w-36 justify-between"
                    >
                      {" "}
                      <option selected disabled>
                        Selct a property
                      </option>
                      <option value="is_empty">Is empty</option>
                      <option value="is_not_empty">Is not empty</option>
                      <option value="contains">Contains</option>
                      <option value="does_not_contain">Does not contain</option>
                    </select>
                  ) : filter[index].property.type === "rich_text" ||
                    filter[index].formulaType === "string" ||
                    filter[index].property.type === "url" ||
                    filter[index].property.type === "title" ||
                    filter[index].property.type === "email" ||
                    filter[index].rollupType === "rich_text" ||
                    filter[index].rollupType === "string" ||
                    filter[index].rollupType === "url" ||
                    filter[index].rollupType === "title" ||
                    filter[index].rollupType === "email" ? (
                    <select
                      name="operation"
                      value={filter[index].operator}
                      onChange={(event) => handleFilterInsertion(event, index)}
                      className="px-4 py-2 border border-gray-600 rounded flex items-center w-[70px] sm:w-36 justify-between"
                    >
                      {" "}
                      <option selected disabled>
                        Selct a property
                      </option>
                      <option value="is_empty">Is empty</option>
                      <option value="is_not_empty">Is not empty</option>
                      <option value="contains">Contains</option>
                      <option value="does_not_contain">Does not contain</option>
                      <option value="does_not_equal">Does not equal</option>
                      <option value="ends_with">Ends with</option>
                      <option value="equals">Equals</option>
                      <option value="starts_with">Starts with</option>
                    </select>
                  ) : filter[index].property.type === "select" ||
                    filter[index].rollupType === "select" ? (
                    <select
                      name="operation"
                      value={filter[index].operator}
                      onChange={(event) => handleFilterInsertion(event, index)}
                      className="px-4 py-2 border border-gray-600 rounded flex items-center w-[70px] sm:w-36 justify-between"
                    >
                      {" "}
                      <option selected disabled>
                        Selct a property
                      </option>
                      <option value="is_empty">Is empty</option>
                      <option value="is_not_empty">Is not empty</option>
                      <option value="equals">Equals to</option>
                      <option value="does_not_equal">Does not equal to</option>
                    </select>
                  ) : filter[index].property.type === "status" ||
                    filter[index].rollupType == "status" ? (
                    <select
                      name="operation"
                      value={filter[index].operator}
                      onChange={(event) => handleFilterInsertion(event, index)}
                      className="px-4 py-2 border border-gray-600 rounded flex items-center w-[70px] sm:w-36 justify-between"
                    >
                      {" "}
                      <option selected disabled>
                        Selct a property
                      </option>
                      <option value="is_empty">Is empty</option>
                      <option value="is_not_empty">Is not empty</option>
                      <option value="equals">Equals to</option>
                      <option value="does_not_equal">Does not equal to</option>
                    </select>
                  ) : filter[index].property.type === "unique_id" ||
                    filter[index].rollupType === "unique_id" ? (
                    <select
                      name="operation"
                      onChange={(event) => handleFilterInsertion(event, index)}
                      value={filter[index].operator}
                      className="px-4 py-2 border border-gray-600 rounded flex items-center w-[70px] sm:w-36 justify-between"
                    >
                      {" "}
                      <option selected disabled>
                        Selct a property
                      </option>
                      <option value="equals">Equals to</option>
                      <option value="does_not_equal">Does not equal to</option>
                      <option value="greater_than">Greater than</option>
                      <option value="greater_than_or_equal_to">
                        Greater than or equal to
                      </option>
                      <option value="less_than">Less than</option>
                      <option value="less_than_or_equal_to">
                        Less than or equal to
                      </option>
                    </select>
                  ) : (
                    (filter[index].property.type === "relation" ||
                      filter[index].rollupType === "relation") && (
                      <select
                        name="operation"
                        onChange={(event) =>
                          handleFilterInsertion(event, index)
                        }
                        value={filter[index].operator}
                        className="px-4 py-2 border border-gray-600 rounded flex items-center w-[70px] sm:w-36 justify-between"
                      >
                        {" "}
                        <option selected disabled>
                          Selct a property
                        </option>
                        <option value="is_empty">Is empty</option>
                        <option value="is_not_empty">Is not empty</option>
                        <option value="contains">Contains</option>
                        <option value="does_not_contain">
                          Does not contain
                        </option>
                      </select>
                    )
                  ))}

                {filter[index].operator.length > 0 &&
                  filter[index].property.type === "rollup" && (
                    <select
                      defaultValue={
                        filter[index].rollupOperation
                          ? filter[index].rollupOperation
                          : "select a operation"
                      }
                      className="px-4 py-2 border border-gray-600 rounded flex items-center w-[70px] sm:w-28 justify-between"
                      name="rollupOperation"
                      onChange={(event) => handleFilterInsertion(event, index)}
                      required
                    >
                      {" "}
                      <option disabled>Selct a property</option>
                      <option value={"any"}>Any</option>
                      <option value={"every"}>Every</option>
                      <option value={"none"}>None</option>
                    </select>
                  )}

                {filter[index].operator.length > 0 &&
                  (filter[index].formulaType === "date" ||
                  filter[index].property.type === "date" ||
                  filter[index].property.type === "created_time" ||
                  filter[index].property.type === "last_edited_time" ||
                  filter[index].rollupType === "date" ||
                  filter[index].rollupType === "created_time" ||
                  filter[index].rollupType === "last_edited_time"
                    ? (filter[index].operator === "after" ||
                        filter[index].operator === "before" ||
                        filter[index].operator === "equals" ||
                        filter[index].operator === "on_or_after" ||
                        filter[index].operator === "on_or_before") && (
                        <input
                          type="date"
                          value={filter[index].value}
                          onChange={(e) => handleFilterInsertion(e, index)}
                          name="value"
                          className="px-4 py-2 border border-gray-600 rounded flex items-center w-[140px] sm:w-44 justify-between"
                        ></input>
                      )
                    : filter[index].property.type === "files" ||
                      filter[index].rollupType === "files"
                    ? (filter[index].operator === "contains" ||
                        filter[index].operator === "does_not_contain") && (
                        <input
                          type="text"
                          onChange={(e) => handleFilterInsertion(e, index)}
                          name="value"
                          value={filter[index].value}
                          className="px-4 py-2 border w-36 sm:w-42 border-gray-600 rounded flex items-center justify-between"
                        ></input>
                      )
                    : filter[index].property.type === "multi_select" ||
                      filter[index].rollupType === "multi_select"
                    ? (filter[index].operator === "contains" ||
                        filter[index].operator === "does_not_contain") && (
                        <input
                          type="text"
                          name="value"
                          value={filter[index].value}
                          onChange={(e) => handleFilterInsertion(e, index)}
                          className="px-4 py-2 w-36 sm:w-42 border border-gray-600 rounded flex items-center justify-between"
                        ></input>
                      )
                    : filter[index].property.type === "number" ||
                      filter[index].formulaType === "number" ||
                      filter[index].rollupType === "number" ||
                      filter[index].property.type === "phone_number" ||
                      filter[index].rollupType === "phone_number"
                    ? (filter[index].operator === "equals" ||
                        filter[index].operator === "does_not_equal" ||
                        filter[index].operator === "greater_than" ||
                        filter[index].operator === "greater_than_or_equal_to" ||
                        filter[index].operator === "less_than" ||
                        filter[index].operator === "less_than_or_equal_to") && (
                        <input
                          type="number"
                          name="value"
                          value={filter[index].value}
                          onChange={(e) => handleFilterInsertion(e, index)}
                          className="px-4 py-2 border w-36 sm:w-42 border-gray-600 rounded flex items-center justify-between"
                        ></input>
                      )
                    : // : filter[index].property.type === "phone_number" ||
                    //   filter[index].rollupType === "phone_number"
                    // ? (filter[index].operator === "equals" ||
                    //     filter[index].operator === "does_not_equal" ||
                    //     filter[index].operator === "contains" ||
                    //     filter[index].operator === "does_not_contain" ||
                    //     filter[index].operator === "starts_with" ||
                    //     filter[index].operator === "ends_with") && (
                    //     <input
                    //       type="number"
                    //       name="value"
                    //       value={filter[index].value}
                    //       onChange={(e) => handleFilterInsertion(e, index)}
                    //       className="px-4 py-2 border w-36 sm:w-42 border-gray-600 rounded flex items-center justify-between"
                    //     ></input>
                    //   )
                    filter[index].property.type === "people" ||
                      filter[index].property.type === "created_by" ||
                      filter[index].property.type === "last_edited_by" ||
                      filter[index].rollupType === "people" ||
                      filter[index].rollupType === "created_by" ||
                      filter[index].rollupType === "last_edited_by"
                    ? (filter[index]?.operator === "contains" ||
                        filter[index]?.operator === "does_not_contain") && (
                        <select
                          name="value"
                          value={filter[index].value}
                          onChange={(e) => handleFilterInsertion(e, index)}
                          className="px-4 py-2 w-[70px] sm:w-42 border border-gray-600 rounded flex items-center justify-between"
                        >
                          {" "}
                          <option selected disabled>
                            Selct a property
                          </option>
                          {extractedProperties.map((rows) =>
                            filter[index].property.value === rows.id
                              ? rows.value !== "No name" &&
                                // Declare the ids array here
                                (() => {
                                  return (
                                    <>
                                      {rows.value.map((people) => {
                                        return (
                                          <>
                                            {/* // Check if the id is already in the ids array */}

                                            {/* // Add the id to the ids array */}
                                            {ids.push(people.id)}
                                            {/* // Render the option element */}
                                            <option
                                              key={people.id}
                                              value={people.id}
                                            >
                                              {people.name}
                                            </option>
                                          </>
                                        );
                                      })}
                                    </>
                                  );
                                })()
                              : null
                          )}
                        </select>
                      )
                    : filter[index].property.type === "rich_text" ||
                      filter[index].formulaType === "string" ||
                      filter[index].property.type === "url" ||
                      filter[index].property.type === "title" ||
                      filter[index].property.type === "email" ||
                      filter[index].rollupType === "rich_text" ||
                      filter[index].rollupType === "string" ||
                      filter[index].rollupType === "url" ||
                      filter[index].rollupType === "title" ||
                      filter[index].rollupType === "email"
                    ? (filter[index].operator === "contains" ||
                        filter[index].operator === "does_not_contain" ||
                        filter[index].operator === "does_not_equal" ||
                        filter[index].operator === "ends_with" ||
                        filter[index].operator === "equals" ||
                        filter[index].operator === "starts_with") && (
                        <input
                          type="text"
                          name="value"
                          value={filter[index].value}
                          onChange={(e) => handleFilterInsertion(e, index)}
                          className="px-4 py-2 w-[70px] sm:w-42 border border-gray-600 rounded flex items-center justify-between w-44"
                        ></input>
                      )
                    : filter[index].property.type === "select" ||
                      filter[index].rollupType === "select"
                    ? (filter[index].operator === "equals" ||
                        filter[index].operator === "does_not_equal") && (
                        <input
                          type="text"
                          name="value"
                          value={filter[index].value}
                          onChange={(e) => handleFilterInsertion(e, index)}
                          className="px-4 py-2 w-36 sm:w-42 border border-gray-600 rounded flex items-center justify-between"
                        />
                      )
                    : filter[index].property.type === "status" ||
                      filter[index].rollupType === "status"
                    ? (filter[index].operator === "equals" ||
                        filter[index].operator === "does_not_equal") && (
                        <input
                          type="text"
                          name="value"
                          value={filter[index].value}
                          onChange={(e) => handleFilterInsertion(e, index)}
                          className="px-4 py-2 w-36 sm:w-42 border border-gray-600 rounded flex items-center justify-between"
                        />
                      )
                    : filter[index].property.type === "unique_id" ||
                      filter[index].rollupType === "unique_id"
                    ? (filter[index].operator === "equals" ||
                        filter[index].operator === "does_not_equal" ||
                        filter[index].operator === "greater_than" ||
                        filter[index].operator === "greater_than_or_equal_to" ||
                        filter[index].operator === "less_than" ||
                        filter[index].operator === "less_than_or_equal_to") && (
                        <input
                          type="number"
                          name="value"
                          value={filter[index].value}
                          onChange={(e) => handleFilterInsertion(e, index)}
                          className="px-4 w-36 sm:w-42 py-2 border border-gray-600 rounded flex items-center justify-between"
                        />
                      )
                    : (filter[index].property.type === "relation" ||
                        filter[index].rollupType === "relation") &&
                      (filter[index].operator === "contains" ||
                        filter[index].operator === "does_not_contain") && (
                        <select
                          name="value"
                          value={filter[index].value}
                          onChange={(e) => handleFilterInsertion(e, index)}
                          className="px-4 py-2 w-36 sm:w-42 border border-gray-600 rounded flex items-center justify-between"
                        >
                          {" "}
                          <option selected disabled>
                            Selct a property
                          </option>
                          {extractedProperties.map((rows) =>
                            filter[index].property.value === rows.id
                              ? rows.value !== "No name" &&
                                // Declare the ids array here
                                (() => {
                                  return (
                                    <>
                                      {rows.value.map((relate, index) => {
                                        // Check if the id is already in the ids array

                                        // Add the id to the ids array

                                        // Render the option element
                                        return (
                                          <option key={index} value={relate}>
                                            {relate}
                                          </option>
                                        );
                                      })}
                                    </>
                                  );
                                })()
                              : null
                          )}
                        </select>
                      ))}

                <button onClick={() => removeFilter(index)}>
                  <TrashIcon className="text-gray-400" />
                </button>
              </div>
            ))}

            <Button onClick={addFields} variant="ghost">
              + Add filter rule
            </Button>
            <div className="flex justify-between items-center mt-4">
              <Button className="text-red-500" variant="ghost" onClick={deleteFullFilters}>
                Delete filter
              </Button>
             
            </div>
          </div>
          <DialogFooter>
            {filterLoadingState ? (
              <Button>Fetching data..</Button>
            ) : (
              <Button type="submit" onClick={() => changeFilter()}>
                Save filters
              </Button>
            )}
            {/* <Button type="submit" onClick={() => changeFilter()}>
              Save filters
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function filterToJson(filter) {
  const andOr = "and";
  if (filter.values.length > 0) {
    const filtered = filter.map((fil) => {
      const propertyLabel = fil.propertie.label;
      const type = fil.propertie.type;
      const operator = fil.operator;
      const value = fil.value;
      let property = "property"; // Default property value

      // Check if the type is "created_time" or "last_edited_time"
      if (type === "created_time" || type === "last_edited_time") {
        property = "timestamp";
      }

      return {
        [property]: propertyLabel,
        [type]: {
          [operator]: value,
        },
      };
    });

    const json = {
      filter: {
        [andOr]: filtered,
      },
    };
  }
}

function MoreVerticalIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function getWindowDimensions() {
  const { innerWidth: width } = window;
  return width;
}

function CalenderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-calendar"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
