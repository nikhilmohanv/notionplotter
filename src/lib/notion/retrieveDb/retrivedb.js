"use server";
const { Client } = require("@notionhq/client");
import { cookies } from "next/headers";

export default async function retrieveDb(databaseId, access_token) {
  if (!access_token) {
    const cookieStore = cookies();
    access_token = cookieStore.get("access_token")?.value;
    if (!access_token) throw new Error("No Token Cookie Found");
  }

  const notion = new Client({
    auth: access_token,
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
