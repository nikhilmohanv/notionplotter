import getDbs from "@/libs/notion/getdbs/getDbs";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req) => {
  try {
    const uid = req.nextUrl.searchParams.get("uid");
    const dbs = await getDbs(uid);
    console.log(dbs);
    return NextResponse.json(dbs);
  } catch (err) {
    console.log("Error:", err);
  }
};
