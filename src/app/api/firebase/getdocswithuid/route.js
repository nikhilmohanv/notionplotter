import { NextRequest } from "next/server";
import getDoumentsWithUId from "@/firebase/firestore/getdocwithuid";
import { NextResponse } from 'next/server';

export const GET = async (req) => {
    try {
        // const collection = req.nextUrl.searchParams.get('collection') as string;
        // const uid = req.query.uid
        const url = new URL(req.url, 'http://localhost'); // Create URL object
        const params = new URLSearchParams(url.search); // Get query parameters

        const uid = params.get('uid');
       

        const { result, error } = await getDoumentsWithUId(uid);

        if (error) {
            console.log('Error:', error);
            return NextResponse.error();
        }
        return NextResponse.json(result);
    } catch (err) {
        console.log('Error:', err);
        return NextResponse.error();
    }
}
