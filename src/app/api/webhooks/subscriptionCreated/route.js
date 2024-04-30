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

    if (!crypto.timingSafeEqual(digest, signature)) {
      throw new Error("Invalid signature.");
    }

    console.log(body);

    // Logic according to event
    if (eventType === "subscription_created" || eventType === "subscription_updated") {
      const userId = body.meta.custom_data.user_id;
      const isSuccessful = body.data.attributes.status === "paid";

      const data = {
        userId: userId,
        created_at: body.data.attributes.created_at,
        updated_at: body.data.attributes.updated_at,
        status: body.data.attributes.status,
        renews_at: body.data.attributes.renews_at,
        card_brand:body.data.attributes.card_brand,
        card_last_four:body.data.attributes.card_last_four,
        status_formatted: body.data.attributes.status_formatted,

      };

      // inserting into firestore
      // const value = collection(db, "subscription");

      // stores the latest subscription
      const resp= addDataWithId("subscription",userId,data)

      // stroring subscription history
      const result = addData("subscription_history",data)
      // const result = await addDoc(value, data);
    }

    return Response.json({ message: "Webhook received" });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
