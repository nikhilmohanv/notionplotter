import retrieveDb from "@/lib/notion/retrieveDb/retrivedb";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req) => {
  try {
    // const id = req.nextUrl.searchParams.get('id');
    const url = new URL(req.url); // Create URL object
    const params = new URLSearchParams(url.search); // Get query parameters

    const id = params.get("id");
    const access_token = params.get("at");
    console.log(access_token)

    const dbs = await retrieveDb(id, access_token);

    return NextResponse.json(dbs);
  } catch (err) {
    console.log("Error:", err);
  }
};
