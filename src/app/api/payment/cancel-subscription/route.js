import { NextResponse } from "next/server";
import axios from "axios";
import getUserSubscriptionPlan from "@/libs/subscription/subscription";
import getDocument from "@/firebase/firestore/getdata";
import { cookies } from "next/headers";
import {
  cancelSubscription,
  lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";
import addDataWithId from "@/firebase/firestore/adddatawithid";

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
    console.log("subscription id and cancelled ", subscriptionId);
    lemonSqueezySetup({
      apiKey: process.env.LEMON_SQUEEZY_API_KEY,
      onError: (error) => {
        throw new Error(`Lemon Squeezy API error: ${error.message}`);
      },
    });
    const cancelledSub = await cancelSubscription(subscriptionId);
    if (cancelledSub.error) {
      throw new Error(cancelledSub.error.message);
    }
    const data = {
      status: cancelledSub.data?.data.attributes.status,
      statusFormatted: cancelledSub.data?.data.attributes.status_formatted,
      renews_at: cancelledSub.data?.data.attributes.ends_at,
    };
    const {}=await addDataWithId("subscription",uid,data)
    // await axios.patch(
    //   `https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`,
    //   {
    //     data: {
    //       type: "subscriptions",
    //       id: subscriptionId,
    //       attributes: {
    //         cancelled: true, // <- ALl the line of code just for this
    //       },
    //     },
    //   },
    //   {
    //     headers: {
    //       Accept: "application/vnd.api+json",
    //       "Content-Type": "application/vnd.api+json",
    //       Authorization: `${process.env.LEMON_SQUEEZY_API_KEY}`,
    //     },
    //   }
    // );

    const endsAt = result.data().renews_at.toLocaleString();

    return NextResponse.json({
      message: `Your subscription has been cancelled. You will still have access to our product until '${endsAt}'`,
    });
  } catch (err) {
    console.log({ err });
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  }
}
