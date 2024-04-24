import retrieveDb from '@/libs/notion/retrieveDb/retrivedb';
import { NextResponse,NextRequest } from 'next/server';


export const GET = async (req) => {
    try {
        const id = req.nextUrl.searchParams.get('id');
        const dbs = await retrieveDb(id);
        
        return NextResponse.json(dbs)

    } catch (err) {
        console.log('Error:', err);

    }
}

