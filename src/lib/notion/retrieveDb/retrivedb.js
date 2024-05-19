"use server";
const { Client } = require("@notionhq/client");
import { cookies } from "next/headers";

export default async function retrieveDb(databaseId) {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get("access_token")?.value;
  if (!tokenCookie) throw new Error("No Token Cookie Found");

  const notion = new Client({
    auth: tokenCookie,
  });

  try {
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });

    return response;
  } catch (err) {
    console.error(err);
    throw err; // Rethrow the error for the caller to handle
  }
}
