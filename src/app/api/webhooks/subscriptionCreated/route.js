import crypto from "crypto";
import app from "@/firebase/config";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import addDataWithId from "@/firebase/firestore/adddatawithid";
import addData from "@/firebase/firestore/adddata";

const db = getFirestore(app);

export async function POST(req) {
  try {
    // Catch the event type
    const clonedReq = req.clone();
    const eventType = req.headers.get("X-Event-Name");
    const body = await req.json();

    // Check signature
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SIGNATURE;
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(
      hmac.update(await clonedReq.text()).digest("hex"),
      "utf8"
    );
    const signature = Buffer.from(req.headers.get("X-Signature") || "", "utf8");

    // validate signature
    if (!crypto.timingSafeEqual(digest, signature)) {
      throw new Error("Invalid signature.");
    }

    const userId = body.meta.custom_data.user_id;

    // Check if custom defined data i.e. the `userId` is there or not
    if (!userId) {
      return NextResponse.json(
        { message: "No userId provided" },
        { status: 403 }
      );
    }

    console.log(body);

    switch (body.meta.event_name) {
      case "subscription_created": {
        const data = {
          subscriptionId:
            body.data.attributes.first_subscription_item.subscription_id,
          customerId: body.data.attributes.customer_id,
          variantId: body.data.attributes.variant_id,
          userId: userId,
          created_at: body.data.attributes.created_at,
          updated_at: body.data.attributes.updated_at,
          status: body.data.attributes.status,
          renews_at: body.data.attributes.renews_at,
          card_brand: body.data.attributes.card_brand,
          card_last_four: body.data.attributes.card_last_four,
          status_formatted: body.data.attributes.status_formatted,
          onTrial: false,
          updatePaymentMethod: body.data.attributes.urls.update_payment_method,
        };

        const { result, error } = await addDataWithId(
          "subscription",
          userId,
          data
        );

        // stroring subscription history
        const resp = await addData("subscription_history", data);
      }
      case "subscription_updated": {
        const data = {
          variantId: body.data.attributes.variant_id,
          renews_at: body.data.attributes.renews_at,
          updatePaymentMethod: body.data.attributes.urls.update_payment_method,
        };

        const { result, error } = await addDataWithId(
          "subscription",
          userId,
          data
        );
      }
      case "subscription_cancelled": {
        const data = {
          status: body.data.attributes.status,
          statusFormatted: body.data.attributes.status_formatted,
          renews_at: body.data.attributes.renews_at,
        };
        const { result, error } = await addDataWithId(
          "subscription",
          userId,
          data
        );
      }
      case "subscription_paused": {
        const data = {
          status: body.data.attributes.status,
          statusFormatted: body.data.attributes.status_formatted,
          renews_at: body.data.attributes.ends_at,
          isPaused: body.data.attributes.pause !== null,
        };
        const { result, error } = await addDataWithId(
          "subscription",
          userId,
          data
        );
      }
      case "subscription_expired": {
        const data = {
          status: body.data.attributes.status,
          statusFormatted: body.data.attributes.status_formatted,
        };
        const { result, error } = await addDataWithId(
          "subscription",
          userId,
          data
        );
      }
      case "subscription_unpaused": {
        const data = {
          status: body.data.attributes.status,
          statusFormatted: body.data.attributes.status_formatted,
        };
        const { result, error } = await addDataWithId(
          "subscription",
          userId,
          data
        );
      }
      case "subscription_resumed": {
        const data = {
          status: body.data.attributes.status,
          statusFormatted: body.data.attributes.status_formatted,
        };
        const { result, error } = await addDataWithId(
          "subscription",
          userId,
          data
        );
      }
    }

    // Logic according to event
    return Response.json({ message: "Webhook received" }, { status: 200 });
  } catch (err) {
    return Response.json({ message: `Server error ${err}` }, { status: 500 });
  }
}
