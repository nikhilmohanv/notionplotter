import retrieveDb from "@/lib/notion/retrieveDb/retrivedb";
import retrieveUser from "@/lib/notion/retrieveuser/retrieveuser";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req) => {
  try {
    // const id = req.nextUrl.searchParams.get("id");
    const url = new URL(req.url, "http://localhost"); // Create URL object
    const params = new URLSearchParams(url.search); // Get query parameters

    const id = params.get("id");

    const name = await retrieveUser(id);

    return NextResponse.json(name);
  } catch (err) {
    console.log("Error:", err);
  }
};
