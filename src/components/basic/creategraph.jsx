import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import addData from "@/lib/firebase/firestore/adddata";
import { Loader2 } from "lucide-react";
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
  function closeFirstModel(e, open, close) {
    e.preventDefault();
    console.log("indi close");
    console.log("open" + open);
    document.getElementById("open" + open).click();
    document.getElementById("close" + close).click();
  }
  return (
    <>
      {databases.length > 0 ? (
        <>
          <Dialog className="">
            <DialogTrigger asChild>
              <Button size="sm">Add new chart</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>New Chart</DialogTitle>
                {/* <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription> */}
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Database
                  </Label>
                  <Select
                    defaultValue={databaseID}
                    onValueChange={handleSelect}
                  >
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3 w-[300px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    id="close1"
                    onClick={console.log("closing")}
                    variant="ghost"
                  >
                    Close
                  </Button>
                </DialogClose>
                {databaseID && name ? (
                  <Button
                    type="submit"
                    onClick={(e) => {
                      closeFirstModel(e, "2", "1");
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button disabled>Next</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* chart type */}

          <Dialog>
            <DialogTrigger asChild>
              <Button className="hidden" id="open2">
                Next trigger
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] min-h-[270px]">
              <DialogHeader>
                <DialogTitle>Create a graph</DialogTitle>
                <DialogDescription className="pt-2">
                  Select chart type
                </DialogDescription>
              </DialogHeader>
              <div className="w-full  grid grid-cols-4  gap-4 px-5">
                {/* bar chart */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center ">
                        <input
                          // className="mr-1"
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
                      <div className="flex items-center ">
                        <input
                          className=""
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
                      <div className="flex items-center ">
                        <input
                          // className="mr-2"
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
                      <div className="flex items-center ">
                        <input
                          // className="mr-2"
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
                            // height: 1,
                            // width: 1,
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

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" id="close2" variant="ghost">
                    Close
                  </Button>
                </DialogClose>
                {chartType ? (
                  <Button
                    type="submit"
                    onClick={(e) => {
                      closeFirstModel(e, "3", "2");
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button disabled>Next</Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select Chart type to continue</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* selecting axes */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="hidden" id="open3" type="submit">
                Next
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create a Chart</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    X-axis
                  </Label>
                  <Select defaultValue={xAxis} onValueChange={handleXSelect}>
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
                  <Select defaultValue={yAxis} onValueChange={handleYSelect}>
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
                  <Button type="button" variant="ghost">
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
        </>
      ) : (
        <Button disabled size="sm">
          <Loader2 className="mr-2 h-4 w-4  animate-spin" />
          Please wait
        </Button>
      )}
    </>
  );
}
