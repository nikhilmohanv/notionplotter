import querydb from "@/lib/notion/queryDb/querydb";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req) => {
  try {
    const { filters, andOr } = await req.json();

    const id = req.nextUrl.searchParams.get("id");
    const dbs = await querydb(id, filters, andOr);
    return NextResponse.json(dbs.results);
  } catch (err) {
    console.log("Error:", err);
    return NextResponse.error(err);
  }
};
