import getDbs from "@/libs/notion/getdbs/getDbs";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req) => {
  try {
    // const uid = req.nextUrl.searchParams.get("uid");
    
    const dbs = await getDbs();
    return NextResponse.json(dbs);
  } catch (err) {
    console.log("Error:", err);
  }
};
