import completequerydb from "@/libs/notion/completequerydb/completequerydb";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req) => {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const dbs = await completequerydb(id);
    return NextResponse.json(dbs.results);
  } catch (err) {
    console.log("Error:", err);
  }
};
