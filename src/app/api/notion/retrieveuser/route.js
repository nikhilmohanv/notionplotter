import retrieveDb from "@/libs/notion/retrieveDb/retrivedb";
import retrieveUser from "@/libs/notion/retrieveuser/retrieveuser";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req) => {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const name = await retrieveUser(id);

    return NextResponse.json(name);
  } catch (err) {
    console.log("Error:", err);
  }
};
