"use client";
import { UserAuth } from "@/app/context/firebaseauth/authcontext";
import { useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { setCookie } from "cookies-next";
import getTokenWithUId from "@/lib/firebase/firestore/getaccesstoken";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import addDataWithId from "@/lib/firebase/firestore/adddatawithid";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginButton({ text, variant }) {
  const { user, GoogleSignIn } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [isAuthNeeded, setIsAuthNeeded] = useState(false); // Check if auth is needed
  const [cookiesSet, setCookiesSet] = useState(false); // State to check if cookies are set

  // Handle user sign-in with Google and store access token
  useEffect(() => {
    if (user && cookiesSet) {
      redirect("/dashboard");
    }
  }, [user, cookiesSet]); // Include cookiesSet in dependencies

  // Handle user sign-in with Google and store access token
  async function handleSignIn() {
    setIsAuthNeeded(true);
    try {
      await GoogleSignIn();
      const updatedUser = await new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          resolve(user);
          unsubscribe();
        });
      });

      if (updatedUser) {
        if (
          updatedUser.metadata.creationTime ===
          updatedUser.metadata.lastSignInTime
        ) {
          const trialEndDate = new Date();
          trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 days trial
          const data = {
            uid: updatedUser.uid,
            onTrial: true,
            trialStartDate: new Date(),
            renews_at: `${trialEndDate}`,
          };
          await addDataWithId("subscription", updatedUser.uid, data);
        }

        const { result } = await getTokenWithUId(updatedUser.uid);
        const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

        setCookie("uid", updatedUser.uid, {
          expires: expires,
          priority: "high",
          sameSite: "strict",
        });

        let accessTokenSet = false;
        result.forEach((doc) => {
          if (doc.data().access_token) {
            setCookie("access_token", doc.data().access_token, {
              expires: expires,
              priority: "high",
              sameSite: "strict",
            });
            accessTokenSet = true;
          }
        });

        setLoading(true);
        setCookiesSet(true); // Set cookiesSet to true once required cookies are set
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {user ? (
        <Link href="dashboard" className={buttonVariants({ variant: variant })}>
          Go to dashboard
        </Link>
      ) : isAuthNeeded ? (
        <Button disabled variant={variant}>
          <Loader2 className="w-full mr-2 h-4 w-4 animate-spin" />
          Validating
        </Button>
      ) : (
        <Button variant={variant} onClick={handleSignIn}>
          {text}
        </Button>
      )}
    </>
  );
}
