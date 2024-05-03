import { NextRequest } from "next/server";
import getDoument from "@/firebase/firestore/getdata";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
   
    const collection = req.nextUrl.searchParams.get("collection");
    const docId = req.nextUrl.searchParams.get("docId");

    const { result, error } = await getDoument(collection, docId);

    if (error) {
      return NextResponse.error();
    }
    if (result) {
      if (!result.exists()) {
        return NextResponse.error();
      }

      return NextResponse.json(result.data());
    }
  } catch (err) {
    return NextResponse.error();
  }
};
