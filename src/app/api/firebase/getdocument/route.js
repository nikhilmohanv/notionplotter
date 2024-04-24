import { NextRequest } from "next/server";
import getDoument from "@/firebase/firestore/getdata";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const collection = req.nextUrl.searchParams.get("collection");
    const id = req.nextUrl.searchParams.get("docId");

    const { result, error } = await getDoument(collection, id);

    if (error) {
      console.log("Error:", error);
      return NextResponse.error();
    }
    if (result) {
      if (!result.exists()) {
        console.log("Document not found");
        return NextResponse.error();
      }

      return NextResponse.json(result.data());
    }
  } catch (err) {
    console.log("Error:", err);
    return NextResponse.error();
  }
};
