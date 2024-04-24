import completequerydb from "@/libs/notion/completequerydb/completequerydb";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req) => {
  try {
    // const id = req.query.id

    const url = new URL(req.url, "http://localhost"); // Create URL object
    const params = new URLSearchParams(url.search); // Get query parameters


    const id = params.get("id");

    const dbs = await completequerydb(id);
    return NextResponse.json(dbs.results);
  } catch (err) {
    console.log("Error:", err);
  }
};
