const { Client } = require("@notionhq/client");
import { cookies } from "next/headers";

export default async function getDbs() {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get("access_token");
  if (!tokenCookie) throw new Error("No Token Cookie Found");
  console.log(tokenCookie);
 
  console.log("token: ", tokenCookie.value);
  // const token="secret_D10TWg3fafzgI8UvGll8PxVL3mMhzg5m92sZbqGghod"
  //console.log(userid);

  if (tokenCookie.value) {
    const notion = new Client({
      auth: tokenCookie.value,
    });

    try {
      const response = await notion.search({
        filter: {
          value: "database",
          property: "object",
        },
        sort: {
          direction: "ascending",
          timestamp: "last_edited_time",
        },
      });
      console.log(response);
      return response;
    } catch (err) {
      console.error(err);
      // throw err;
      return { error: err.message };
    }
  }
}
