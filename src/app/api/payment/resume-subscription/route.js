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

    await axios.patch(
      `https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`,
      {
        data: {
          type: "subscriptions",
          id: subscriptionId,
          attributes: {
            cancelled: false, // <- Cancel
          },
        },
      },
      {
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
        },
      }
    );
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
