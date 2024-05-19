import addData from "@/lib/firebase/firestore/access_token";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// const encryptId = (uid) => {
// 	const ciphertext = AES.encrypt(uid, 'secretPassphrase');
// 	return encodeURIComponent(ciphertext.toString());
// }

async function getAccessToken(code) {
  try {
    const uri = process.env.REDIRECT_URI;

    const encoded = Buffer.from(
      `${process.env.OAUTH_CLIENT_ID}:${process.env.OAUTH_CLIENT_SECRET}`
    ).toString("base64");

    const res = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          btoa(
            process.env.OAUTH_CLIENT_ID + ":" + process.env.OAUTH_CLIENT_SECRET
          ),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
      }),
    });
    const response = await res.json();

    return response;
  } catch (error) {
    console.log(error);
  }
}

export default async function NotoionCallback({ searchParams }) {
  const response = await getAccessToken(searchParams.code);
  const cookieStore = cookies();
  const uid = cookieStore.get("uid");

  const data = {
    access_token: response.access_token,
    uid: uid?.value,
  };
  const { result, error } = await addData(
    "access_tokens",
    response.bot_id,
    data
  );

  redirect(`/storecookies/${response.access_token}`);
}
