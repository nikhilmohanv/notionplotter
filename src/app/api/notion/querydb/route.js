import querydb from "@/libs/notion/queryDb/querydb";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req) => {
  try {
    const { filters, andOr } = await req.json();

    console.log(filters);

    const id = req.nextUrl.searchParams.get("id");
    console.log(id);
    const dbs = await querydb(id, filters, andOr);

    //console.log(dbs.results[2].properties);

    return NextResponse.json(dbs.results);
  } catch (err) {
    console.log("Error:", err);
  }
};

// async function filterToJson(filter: any) {
//     const andOr = "and";
//     if (filter.values.length > 0) {
//       const filtered = filter.map((fil) => {
//         const propertyLabel = fil.propertie.label;
//         const type = fil.propertie.type;
//         const operator = fil.operator;
//         const value = fil.value;
//         let property = "property"; // Default property value

//         // Check if the type is "created_time" or "last_edited_time"
//         if (type === "created_time" || type === "last_edited_time") {
//           property = "timestamp";
//         }

//         return {
//           [property]: propertyLabel,
//           [type]: {
//             [operator]: value,
//           },
//         };
//       });

//       const json = {
//         filter: {
//           [andOr]: filtered,
//         },
//       };

//       console.log(json);
//       return json
//     }
//   }
