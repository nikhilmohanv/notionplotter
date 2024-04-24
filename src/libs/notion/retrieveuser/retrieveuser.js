const { Client } = require("@notionhq/client");
import { cookies } from "next/headers";

export default async function retrieveUser(uid) {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get("access_token")?.value;
  if (!tokenCookie) throw new Error("No Token Cookie Found");
  console.log(uid);
  try {
    const notion = new Client({ auth: tokenCookie });

    const response = await notion.users.retrieve({ user_id: uid });
    console.log(response);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
