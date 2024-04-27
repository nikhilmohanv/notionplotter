"use server";
const { Client } = require("@notionhq/client");
import { cookies } from "next/headers";

export default async function querydb(id, filter, andOr) {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get("access_token")?.value;

  if (!tokenCookie) throw new Error("No Token Cookie Found");

  const notion = new Client({ auth: tokenCookie });
  const filtered = filter.map((fil) => {
    const property = fil.property.label;

    let type = fil.formulaType ? fil.formulaType : fil.property.type;
    const operator = fil.operator;
    let value = fil.value;

    if (
      operator == "is_checked" ||
      operator == "is_not_checked" ||
      operator == "is_empty" ||
      operator == "is_not_empty" ||
      fil.type === "checkbox" ||
      fil.formulaType === "checkbox" ||
      fil.formulaType === "boolean" ||
      fil.rollupType === "checkbox"
    ) {
      if (value == "true") {
        value = true;
      } else if (value == "false") {
        value = false;
      }
    }
    if (
      operator == "next_month" ||
      operator == "next_week" ||
      operator == "next_year" ||
      operator == "past_month" ||
      operator == "past_week" ||
      operator == "past_year" ||
      operator == "this_week"
    ) {
      value = {};
    }

    if (type == "unique_id") {
      value = parseInt(value);
    } else if (
      fil.rollupType == "number" ||
      fil.rollupType == "phone_number" ||
      fil.formulaType == "number" ||
      fil.formulaType == "phone_number"
    ) {
      if (operator == "is_not_empty" || operator == "is_empty") {
        value = true;
      } else {
        value = parseInt(value);
      }
    }

    if (fil.rollupType) {
      // chaning the type to the form that rollup accepts
      if (
        fil.rollupType == "string" ||
        fil.rollupType == "url" ||
        fil.rollupType == "title" ||
        fil.rollupType == "email" ||
        fil.rollupType == "rich_text" ||
        fil.formulaType == "string" ||
        fil.formulaType == "url" ||
        fil.formulaType == "title" ||
        fil.formulaType == "email" ||
        fil.formulaType == "rich_text"
      ) {
        type = "rich_text";
      } else if (
        fil.rollupType == "number" ||
        fil.rollupType == "phone_number" ||
        fil.formulaType == "number" ||
        fil.formulaType == "phone_number"
      ) {
        type = "number";
      } else if (
        fil.rollupType == "boolean" ||
        fil.rollupType == "checkbox" ||
        fil.formulaType == "boolean" ||
        fil.formulaType == "checkbox"
      ) {
        type = "checkbox";
      } else if (fil.rollupType == "select" || fil.formulaType == "select") {
        type = "select";
      } else if (
        fil.rollupType == "multi_select" ||
        fil.formulaType == "multi_select"
      ) {
        type = "multi_select";
      } else if (
        fil.rollupType == "relation" ||
        fil.formulaType == "relation"
      ) {
        type = "relation";
      } else if (
        fil.rollupType == "created_time" ||
        fil.rollupType == "last_edited_time" ||
        fil.rollupType == "date" ||
        fil.formulaType == "created_time" ||
        fil.formulaType == "last_edited_time" ||
        fil.formulaType == "date"
      ) {
        type = "date";
      } else if (
        fil.rollupType == "people" ||
        fil.rollupType == "last_edited_by" ||
        fil.rollupType == "created_by" ||
        fil.formulaType == "people" ||
        fil.formulaType == "last_edited_by" ||
        fil.formulaType == "created_by"
      ) {
        type = "people";
      } else if (fil.rollupType == "files" || fil.formulaType == "files") {
        type = "files";
      } else if (fil.rollupType == "status" || fil.formulaType == "status") {
        type = "status";
      }

      return {
        property: property,
        rollup: {
          [fil.rollupOperation]: {
            [type]: {
              [operator]: value,
            },
          },
        },
      };
    } else if (fil.formulaType) {
      return {
        property: property,
        formula: {
          [fil.formulaType]: {
            [operator]: value,
          },
        },
      };
    }
    return {
      property: property,
      [type]: {
        [operator]: value,
      },
    };
  });
  try {
    const response = await notion.databases.query({
      database_id: id,
      sorts: [
        {
          property: "ID",
          direction: "ascending",
        },
      ],
      filter: {
        [andOr]: filtered,
      },
    });

    return response;
  } catch (err) {
    console.error(err);
    // throw err;
    return filtered;
  }
}
