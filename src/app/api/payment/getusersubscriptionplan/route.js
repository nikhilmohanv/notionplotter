import getUserSubscriptionPlan from "@/libs/subscription/subscription";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req) => {
  try {
    const userSubscription = await getUserSubscriptionPlan();

    console.log(userSubscription);

    return NextResponse.json(userSubscription);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }
};
