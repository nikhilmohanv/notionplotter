"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loading, UserAuth } from "@/app/context/firebaseauth/authcontext";
import Link from "next/link";
import { resolve } from "path";
import { useContext, useEffect, useState } from "react";
import { setCookie, deleteCookie } from "cookies-next";
import getTokenWithUId from "../firebase/firestore/getaccesstoken";
// import { setCookie } from "cookies-next";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
// import { encrypt } from "@/libs/utils/encrypt/crypto";
import { redirect } from "next/navigation";

export default function Home() {
  const { user, GoogleSignIn, logout } = UserAuth();
  const {loading,setLoading}=useContext(Loading)

  

  useEffect(() => {
    if (user) {
      redirect("/dashboard");
    }
  }, [user]);

  // Handle user sign-in with Google and store access token
  async function handleSignIn() {
    try {
      // Call GoogleSignIn function from UserAuth context
      await GoogleSignIn();

      // Since GoogleSignIn is asynchronous, wait for the user state to be updated
      // This assumes that the user state is being updated in the AuthContextProvider
      // through the onAuthStateChanged callback.
      const updatedUser = await new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          resolve(user);
          unsubscribe();
        });
      });

      if (updatedUser) {
        // Get access token with user UID from Firestore
        const { result, error } = await getTokenWithUId(updatedUser.uid);
        console.log(updatedUser.uid);

        if (result) {
          console.log("inside result");
          console.log(result);
          // Loop through each document in the result
          result.forEach(async (doc) => {
            async function storeAccessToken() {
              // Accessing the data of each document
              console.log(doc.data().access_token);

              // Encrypt the token before storing it in a cookie
              // const token = await encrypt(doc.data().access_token);
              console.log(doc.data().access_token);
              if (doc.data().access_token) {
                //updating loading context
                setLoading(true)

                console.log("inside token");
                console.log(loading)

                // Set access_token and uid cookies
                setCookie("access_token", doc.data().access_token);

                console.log("success");
              }

              // setCookie("accesstoken", result);
            }
            // Call storeAccessToken function
            await storeAccessToken();
           
            console.log(loading)
          });
          setCookie("uid", updatedUser.uid);
          redirect("/dashboard");
          // console.log(result.docs());
        } else {
          console.log("error");
          //set the notion connect status to false, if it false then show the connect to notion button
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Handle user sign-out
  //   const handleSignOut = async () => {
  //     try {
  //       await logout();
  //       deleteCookie("access_token", { path: "/", domain: ".localhost" });
  //       deleteCookie("uid", { path: "/", domain: ".localhost" });
  //       redirect("/");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Welcome to Our Website
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              We provide the best services in the industry.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="flex space-x-2">
              <Input
                className="max-w-lg flex-1"
                placeholder="Enter your email"
                type="email"
              />
              <Button type="submit">Subscribe</Button>
            </form>
            <Button onClick={handleSignIn}>Login</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
