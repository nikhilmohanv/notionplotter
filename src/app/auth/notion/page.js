import { NextResponse } from "next/server";

import addData from "@/lib/firebase/firestore/access_token";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import addDataWithId from "@/lib/firebase/firestore/adddatawithid";

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
  const uid = searchParams.state;
  const response = await getAccessToken(searchParams.code);
  const accessToken = response.access_token;

  // Set the cookie
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  const cookieHeader = `access_token=${accessToken}; Expires=${expires.toUTCString()}; HttpOnly; Path=/; SameSite=Strict`;

  // Save to Firestore
  const data = { access_token: accessToken, uid: uid };
  const { error } = await addDataWithId("access_tokens", uid, data);
  if (error) {
    throw new Error(error);
  }
  
  redirect(`/callback/${accessToken}`);

  // Redirect to the dashboard with the cookie set
  // const res = NextResponse.redirect("dashboard");
  // res.headers.set("Set-Cookie", cookieHeader);
  // return res;
}
