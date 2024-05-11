import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import addData from "@/firebase/firestore/adddata";
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogTrigger,
  DialogContent,
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useMemo } from "react";

import { UserAuth } from "@/app/context/firebaseauth/authcontext";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";

export default function CreateGraph({ loading }) {
  const { user, logout } = UserAuth();

  //stores type of chart that need to create
  const [chartType, setChartType] = useState("");

  //store all the databases in the users workspace
  const [databases, setDatabases] = useState([]);

  //stores the name of the graph
  const [name, setName] = useState("");

  const router = useRouter();

  //store staatea of combobox
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [colNameAndId, setColNameAndId] = useState([]);

  //x axis id
  const [xAxis, setXAxis] = useState();

  //y axis id
  const [yAxis, setYAxis] = useState();

  const cookies = useCookies();
  const [rows, setRows] = useState([]);

  // if true then load the create chart button if false show as create button. when started to create charts it set to true when completed it is set to false
  const [chartCreation, setChartCreation] = useState(false);

  //store x axis datas
  const [xAxisValues, setXAxisValues] = useState([]);

  //store y axis datas
  const [yAxisValues, setYAxisValues] = useState([]);

  //stores the id of database that need to create graph
  const [databaseID, setDatabaseID] = useState();

  //fetching databases from the notion api with access_token, if access_token cookie is set then the dbs are fetched
  useEffect(() => {
    if (user && cookies.get("access_token")) {
      fetch("/api/notion/getdatabases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const dbs = data.results.map((db) => ({
            id: db.id,
            name: db.title.map((some) => some.plain_text).join(", "),
          }));

          setDatabases(dbs);

          // setOptions(data);
        });
    }
  }, [user]);

  //fetching the fields in the selected database
  //fetch data from api/notion/retrievecolumns?id=${id}
  useEffect(() => {
    if (databaseID !== null && databaseID !== undefined) {
      fetch("/api/notion/retrievecolumns?id=" + databaseID, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((cols) => {
          const extractedNameId = [];
          for (const propertyName in cols.properties) {
            if (cols.properties.hasOwnProperty(propertyName)) {
              // Access the property object
              const property = cols.properties[propertyName];
              const propertyIdValue = property.id;
              const propertyNameValue = property.name;

              extractedNameId.push({
                id: propertyIdValue,
                name: propertyNameValue,
              });
            }
          }
          setColNameAndId(extractedNameId);
        });
    }
  }, [databaseID]);

  useEffect(() => {
    if (databaseID !== null && databaseID !== undefined) {
      fetch("/api/notion/querydb?id=" + databaseID, {
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
  }, [databaseID]);

  const extractedProperties = useMemo(() => {
    const propertiesArray = rows.map((page) => {
      const properties = page.properties;
      const extractedPageProperties = [];

      for (const key in properties) {
        if (properties.hasOwnProperty(key)) {
          const property = properties[key];
          let value;
          let propertyType;

          if (property.type === "number") {
            value = property.number;
            propertyType = property.type;
          } else if (property.type === "formula") {
            value = property.formula.string || property.formula.number;
            propertyType = property.formula.type;
          } else if (property.type === "relation") {
            value = "";
            propertyType = property.type;
          } else if (property.type === "rollup") {
            value = property.rollup.number || "";
            propertyType = property.rollup.type;
          }

          extractedPageProperties.push({
            name: key,
            id: property.id,
            type: propertyType,
            value: value,
          });
        }
      }

      return extractedPageProperties;
    });

    // Flatten the array of arrays into a single array
    return propertiesArray.flat();
  }, [rows]);

  //extrating x axis values from extratedproperties variable
  useEffect(() => {
    if (xAxis != null && xAxis != undefined) {
      let XAxisData;
      if (extractedProperties.length > 0) {
        XAxisData = extractedProperties.filter((obj) => obj.id == xAxis);
      }
      if (XAxisData) {
        const extractedXValues = XAxisData.map((obj) => {
          return obj.value;
        });

        // Store the result in the state variable
        setXAxisValues(extractedXValues);
      }
      // setXAxisValues()
    }
  }, [extractedProperties, xAxis]);

  //getting y axis values from notion api
  useEffect(() => {
    if (yAxis != null && yAxis != undefined) {
      let YAxisData;
      if (extractedProperties.length > 0) {
        YAxisData = extractedProperties.filter((obj) => obj.id == yAxis);
      }
      if (YAxisData) {
        const extractedYValues = YAxisData.map((obj) => {
          return obj.value;
        });

        // Store the result in the state variable
        setYAxisValues(extractedYValues);
      }
      // setXAxisValues()
    }
  }, [extractedProperties, yAxis]);

  // storing the database id to the state databaseID
  const handleSelect = (value) => {
    setDatabaseID(value);
  };

  const handleXSelect = (value) => {
    setXAxis(value);
  };

  const handleYSelect = (value) => {
    setYAxis(value);
  };

  //creating new graph
  const createGraph = async (e) => {
    e.preventDefault();
    setChartCreation(true);
    let xAxisName;
    let yAxisName;
    //     const currentTimeStamp = Date.now();
    //     const utcDate = new Date(currentTimeStamp);
    //     const date = utcDate.toLocaleString("en-US", {
    //       timeZone: "America/Los_Angeles",
    //     });
    // console.log(currentTimeStamp)

    // const currentDate = new Date();
    // const losAngelesTime = currentDate.toLocaleString("en-US", {timeZone:"America/Los_Angeles"});
    const timestamp = Timestamp.fromDate(new Date());

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
    const xAxisCommaValues = xAxisValues.join(", ");
    const yAxisCommaValues = yAxisValues.join(", ");

    const data = {
      name: name,
      type: chartType,
      databaseID: databaseID,
      userid: user.uid,
      xaxisId: xAxis,
      yaxisId: yAxis,
      xaxis: xAxisCommaValues,
      yaxis: yAxisCommaValues,
      xAxisName: xAxisName,
      yAxisName: yAxisName,
      createdDate: timestamp,
    };
    const { result, error } = await addData("graphs", data);
    if (result) {
      setChartCreation(false);
      return router.push(`/edit/${result.id}`);
    }

    if (error) {
      return console.log(error);
    }
  };

  return (
    <>
      {databases.length > 0 ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Add new chart</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create a graph</DialogTitle>
              {/* <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription> */}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Database
                </Label>
                <Select onValueChange={handleSelect}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select the database" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {databases.map((db) => (
                        <SelectItem key={db.id} value={db.id}>
                          {db.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3 w-[300px]"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Dialog>
                <DialogTrigger asChild>
                  {databaseID && name ? (
                    <Button type="submit">Next</Button>
                  ) : (
                    <Button disabled>Next</Button>
                  )}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create a graph</DialogTitle>
                    <DialogDescription>Select chart type</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <Label
                      className="flex items-center space-x-2 cursor-pointer"
                      htmlFor="line"
                    >
                      <Input
                        className="w-4 h-4 border-gray-300"
                        id="line"
                        name="chart"
                        type="radio"
                        value="Line Chart"
                        onChange={(e) => setChartType(e.target.value)}
                      />
                      <span className="text-sm font-medium peer-disabled:translate-x-1.5 translate-x-1.5">
                        Line
                      </span>
                    </Label>
                    <Label
                      className="flex items-center space-x-2 cursor-pointer"
                      htmlFor="area"
                    >
                      <Input
                        className="w-4 h-4 border-gray-300"
                        id="area"
                        name="chart"
                        type="radio"
                        value="Area Chart"
                        onChange={(e) => setChartType(e.target.value)}
                      />
                      <span className="text-sm font-medium peer-disabled:translate-x-1.5 translate-x-1.5">
                        Area
                      </span>
                    </Label>
                    <Label
                      className="flex items-center space-x-2 cursor-pointer"
                      htmlFor="bar"
                    >
                      <Input
                        className="w-4 h-4 border-gray-300"
                        id="bar"
                        name="chart"
                        type="radio"
                        value="Bar Chart"
                        onChange={(e) => setChartType(e.target.value)}
                      />
                      <span className="text-sm font-medium peer-disabled:translate-x-1.5 translate-x-1.5">
                        Bar
                      </span>
                    </Label>
                    <Label
                      className="flex items-center space-x-2 cursor-pointer"
                      htmlFor="column"
                    >
                      <Input
                        className="w-4 h-4 border-gray-300"
                        id="column"
                        name="chart"
                        type="radio"
                        value="column"
                        onChange={(e) => setChartType(e.target.value)}
                      />
                      <span className="text-sm font-medium peer-disabled:translate-x-1.5 translate-x-1.5">
                        Column
                      </span>
                    </Label>
                    <Label
                      className="flex items-center space-x-2 cursor-pointer"
                      htmlFor="Pie Chart"
                    >
                      <Input
                        className="w-4 h-4 border-gray-300"
                        id="pie"
                        name="chart"
                        type="radio"
                        value="Pie Chart"
                        onChange={(e) => setChartType(e.target.value)}
                      />
                      <span className="text-sm font-medium peer-disabled:translate-x-1.5 translate-x-1.5">
                        Pie
                      </span>
                    </Label>
                    <Label
                      className="flex items-center space-x-2 cursor-pointer"
                      htmlFor="donut"
                    >
                      <Input
                        className="w-4 h-4 border-gray-300"
                        id="donut"
                        name="chart"
                        type="radio"
                        value="Donut Chart"
                        onChange={(e) => setChartType(e.target.value)}
                      />
                      <span className="text-sm font-medium peer-disabled:translate-x-1.5 translate-x-1.5">
                        Donut
                      </span>
                    </Label>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                    <Dialog>
                      <DialogTrigger asChild>
                        {chartType ? (
                          <Button type="submit">Next</Button>
                        ) : (
                          <Button disabled>Next</Button>
                        )}
                        {/* <Button type="submit">Next</Button> */}
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Create a graph</DialogTitle>
                          {/* <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription> */}
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              X-axis
                            </Label>
                            <Select onValueChange={handleXSelect}>
                              <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Select x axis column" />
                              </SelectTrigger>
                              <SelectContent>
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
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Y-axis
                            </Label>
                            <Select onValueChange={handleYSelect}>
                              <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Select x axis column" />
                              </SelectTrigger>
                              <SelectContent>
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
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>
                          <DialogTrigger asChild>
                            {yAxis && xAxis ? (
                              chartCreation ? (
                                <Button disabled size="sm">
                                  <Loader2 className="mr-2 h-4 w-4  animate-spin" />
                                  Creating Chart
                                </Button>
                              ) : (
                                <Button type="submit" onClick={createGraph}>
                                  Create
                                </Button>
                              )
                            ) : (
                              <Button disabled>Create</Button>
                            )}
                          </DialogTrigger>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Button disabled size="sm">
          <Loader2 className="mr-2 h-4 w-4  animate-spin" />
          Please wait
        </Button>
      )}
    </>
  );
}
