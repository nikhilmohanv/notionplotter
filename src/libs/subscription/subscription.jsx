"use server";
import { cookies } from "next/headers";
import getDocument from "@/firebase/firestore/getdata";
import { LemonsqueezyClient } from "lemonsqueezy.ts";
import addDataWithId from "@/firebase/firestore/adddatawithid";

export default async function getUserSubscriptionPlan() {
  const cookieStore = cookies();
  const uid = cookieStore.get("uid")?.value;

  if (!uid) {
    throw new Error("User ID not found in cookies");
  }

  const { result, error } = await getDocument("subscription", uid);

  if (error) {
    throw new Error("Error retrieving subscription data");
  }

  const subscriptionData = result?.data();

  if (!subscriptionData) {
    throw new Error("Subscription data not found");
  }
  const onTrial = subscriptionData.onTrial;
  const subscriptionId = subscriptionData.subscriptionId;
  const renewsAt = new Date(subscriptionData.renews_at);
  const trialEndDate = new Date(subscriptionData.trialEndDate);
  let isPro;
  let isCanceled;

  if (onTrial || !subscriptionId) {
    const currentDate = new Date();

    if (
      (trialEndDate.getTime() - currentDate.getTime()) /
        (1000 * 60 * 60 * 24) <=
      0
    ) {
      console.log(
        "making it false ",
        (trialEndDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const data = {
        onTrial: false,
      };
      const { result, error } = await addDataWithId("subscription", uid, data);
      return {
        onTrial: false,
        isPro: false,
      };
    } else {
      isPro = true;
    }

    return {
      onTrial,
      isPro,
    };
  }

  const client = new LemonsqueezyClient(process.env.LEMON_SQUEEZY_API_KEY);
  const subscription = await client.retrieveSubscription({
    id: subscriptionId,
  });

  async function verifyPro() {
    isPro = subscriptionId && renewsAt.getTime() + 86_400_000 > Date.now();
    isCanceled = subscription.data.attributes.cancelled;
  }
  await verifyPro();

  // if (renewsAt && isPro && isCanceled && subscription) {
  return {
    renews_at: renewsAt.getTime(),
    isPro,
    isCanceled,
    updatePaymentMethod:
      subscription.data.attributes.urls.update_payment_method,
  };
  // } else {
  //   throw new Error("Invalid subscription data");
  // }
}
