import retrieveDb from "@/libs/notion/retrieveDb/retrivedb";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req) => {
  try {
    // const id = req.nextUrl.searchParams.get('id');
    const url = new URL(req.url, "http://localhost"); // Create URL object
    const params = new URLSearchParams(url.search); // Get query parameters

    const id = params.get("id");

    const dbs = await retrieveDb(id);

    return NextResponse.json(dbs);
  } catch (err) {
    console.log("Error:", err);
  }
};
