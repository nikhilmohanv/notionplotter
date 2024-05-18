"use client";
import { UserAuth } from "@/app/context/firebaseauth/authcontext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { setCookie } from "cookies-next";
import getTokenWithUId from "@/firebase/firestore/getaccesstoken";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import addDataWithId from "@/firebase/firestore/adddatawithid";
export default function LoginButton({ text, variant }) {
  const { user, GoogleSignIn } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false); // New loading state for authentication
  const [isAuthNeeded, setIsAuthNeeded] = useState(false); //checking if auth needed, that it'll become true when the signup button clicked otherwise authneeded will be false. It used for checking if the user is already logged in or not.

  // Handle user sign-in with Google and store access token
  useEffect(() => {
    console.log(user);
    if (user) {
      if (authLoading) {
        if (loading) {
          redirect("/dashboard");
        } else {
          redirect("/dashboard?n=t");
        }
      }

      if (!isAuthNeeded) {
        redirect("/dashboard");
      }
    }
  }, [user, loading, authLoading]); // Include authLoading in dependencies

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
          updatedUser.metadata.creationTime ==
          updatedUser.metadata.lastSignInTime
        ) {
          const trialEndDate = new Date();
          trialEndDate.setDate(trialEndDate.getDate() + 7); //7 days trial
          const data = {
            uid: updatedUser.uid,
            onTrial: true,
            trialStartDate: new Date(),
            trialEndDate: `${trialEndDate}`,
          };
          const { result, error } = await addDataWithId(
            "subscription",
            updatedUser.uid,
            data
          );
          console.log("New doc adding error ", error);
        }
        const { result, error } = await getTokenWithUId(updatedUser.uid);
        if (result) {
          const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
          setCookie("uid", updatedUser.uid, {
            expires: expires,
            priority: "high",
            sameSite: "strict",
          });
          result.forEach(async (doc) => {
            async function storeAccessToken() {
              if (doc.data().access_token) {
                setLoading(true);

                setCookie("access_token", doc.data().access_token, {
                  expires: expires,
                  priority: "high",
                  sameSite: "strict",
                });
                console.log("old account with access token");
                // redirect("/dashboard");
              } else {
                console.log("old account with no access token");
                // redirect("/dashboard?n=t");
              }
            }
            await storeAccessToken();
          });
        }
        setAuthLoading(true); // Set authLoading to false once authentication is completed
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Button variant={variant} onClick={handleSignIn}>
      {text}
    </Button>
  );
}
