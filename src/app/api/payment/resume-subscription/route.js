import { NextResponse } from "next/server";
import axios from "axios";
import getUserSubscriptionPlan from "@/libs/subscription/subscription";
import getDocument from "@/firebase/firestore/getdata";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const uid = cookieStore.get("uid")?.value;
    const { result, error } = await getDocument("subscription", uid);
    const subscriptionId = result.data().subscriptionId;

    if (!uid)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const { isPro } = await getUserSubscriptionPlan();

    if (!isPro)
      return NextResponse.json(
        { message: "You are not subscribed" },
        { status: 402 }
      );
    // lemonSqueezySetup({
    //   apiKey: process.env.LEMON_SQUEEZY_API_KEY,
    //   onError: (error) => {
    //     throw new Error(`Lemon Squeezy API error: ${error.message}`);
    //   },
    // });

    const requestOptions = {
      method: "PATCH",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `${process.env.LEMON_SQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: "subscriptions",
          id: subscriptionId,
          attributes: {
            cancelled: false,
          },
        },
      }),
    };

    fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`,
      requestOptions
    )
      .then((response) => {
        // if (!response.ok) {
        //   throw new Error("Network response was not ok");
        // }
        response.json();
        console.log(response.json());
      })
      .then(async (data) => {
        console.log("Subscription updated successfully:", data);
        const datas = {
          status: data.data?.data.attributes.status,
          statusFormatted: data.data?.data.attributes.status_formatted,
          renews_at: data.data?.data.attributes.ends_at,
        };
        const { result, error } = await addDataWithId(
          "subscription",
          uid,
          datas
        );
      })
      .catch((error) => {
        console.error("Error updating subscription:", error);
      });

    // await axios.patch(
    //   `https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`,
    //   {
    //     data: {
    //       type: "subscriptions",
    //       id: subscriptionId,
    //       attributes: {
    //         cancelled: false, // <- Cancel
    //       },
    //     },
    //   },
    //   {
    //     headers: {
    //       Accept: "application/vnd.api+json",
    //       "Content-Type": "application/vnd.api+json",
    //       Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
    //     },
    //   }
    // );
    return NextResponse.json({
      message: `Your subscription has been resumed.`,
    });
  } catch (err) {
    console.log({ err });
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  }
}
