import {
  lemonSqueezySetup,
  updateSubscription,
} from "@lemonsqueezy/lemonsqueezy.js";
import { cookies } from "next/headers";
import getDocument from "@/lib/firebase/firestore/getdata";
import { NextResponse } from "next/server";

export async function POST(request) {
  const cookieStore = cookies();
  const uid = cookieStore.get("uid")?.value;

  if (!uid)
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  const { result, error } = await getDocument("subscription", uid);
  const subscriptionId = result.data().subscriptionId;
  const { isPro } = await getUserSubscriptionPlan();

  if (!isPro)
    return NextResponse.json(
      { message: "You are not subscribed" },
      { status: 402 }
    );
  try {
    lemonSqueezySetup({
      apiKey: process.env.LEMON_SQUEEZY_API_KEY,
      onError: (error) => {
        throw new Error(`Lemon Squeezy API error: ${error.message}`);
      },
    });
    const pauseSub = await updateSubscription(subscriptionId, {
      pause: {
        mode: "void",
      },
    });

    return NextResponse.json({ message: "success" });
  } catch (err) {
    return NextResponse.json({ message: "error" });
  }
}
