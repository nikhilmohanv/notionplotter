//to get complete database without any filters

"use server"
const { Client } = require('@notionhq/client');
import { cookies } from 'next/headers'


export default async function completequerydb(id) {
  // let token="secret_cs1WjMjKaWwoOhRdpgumza2Afnbl8sK2Hk4rqd7fqYU"  

  const cookieStore = cookies()
  const tokenCookie = cookieStore.get('access_token')?.value

  if (!tokenCookie) throw new Error("No Token Cookie Found")
  

  const notion = new Client({ auth: tokenCookie });
  
  try {
    const andOr = "and"
    const response = await notion.databases.query({
      database_id: id,
      sorts: [
        {
          property: 'ID',
          direction: 'ascending',
        },
      ]
    });
 return response;
  } catch (err) {
    console.error(err);
    throw err;
    
  }
}
