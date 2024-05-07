"use client";
import { Button } from "@/components/ui/button";
import { Loading, UserAuth } from "@/app/context/firebaseauth/authcontext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { setCookie } from "cookies-next";
import getTokenWithUId from "../firebase/firestore/getaccesstoken";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import LineChartIcon from "@/components/icons/linechart";
import addData from "@/firebase/firestore/adddata";
import addDataWithId from "@/firebase/firestore/adddatawithid";
import { Timestamp } from "firebase/firestore";

export default function Home() {
  const { user, GoogleSignIn } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false); // New loading state for authentication
  const [isAuthNeeded, setIsAuthNeeded] = useState(false); //checking if auth needed, that it'll become true when the signup button clicked otherwise authneeded will be false. It used for checking if the user is already logged in or not.

  // Handle user sign-in with Google and store access tokenz
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
          const trialEndDate = new Date()
            trialEndDate.setDate(trialEndDate.getDate() + 7) //7 days trial
          const data = {
            uid: updatedUser.uid,
            onTrial: true,
            trialStartDate: new Date(),
            trialEndDate:`${trialEndDate}`
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
          setCookie("uid", updatedUser.uid);
          result.forEach(async (doc) => {
            async function storeAccessToken() {
              if (doc.data().access_token) {
                setLoading(true);
                setCookie("access_token", doc.data().access_token);
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
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="">
          <LineChartIcon className="h-6 w-6" />
          <span className="sr-only">NotionPlotter</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features"
          >
            Features
          </Link>
          {/* <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#reviews"
          >
            Reviews
          </Link> */}
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#pricing"
          >
            Pricing
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-6 sm:py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container flex flex-col items-center justify-center px-4 md:px-6">
            <div className="space-y-2 text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none">
                Create Charts From Notion Databases
              </h1>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Effortlessly create stunning charts with our app. Embed it in
                your app or notion workspace.
              </p>
            </div>
            <br />
            <div className="mx-auto w-full max-w-sm space-y-2">
              <div className="flex justify-center space-x-2">
                <Button
                  size="lg"
                  className="max-w-lg flex-1"
                  onClick={handleSignIn}
                >
                  Signup
                </Button>
              </div>
              {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                Sign up to get notified when we launch.
                <Link className="underline underline-offset-2" href="#">
                  Terms & Conditions
                </Link>
              </p> */}
            </div>
          </div>
        </section>

        {/* features */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Unleash Your Creativity with Imagify
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Imagify is the ultimate tool for creating stunning,
                  high-quality images with ease. Leverage the power of AI to
                  generate unique visuals, customize templates, and bring your
                  ideas to life.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">
                  AI-Powered Image Generation
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Leverage the power of AI to create unique, high-quality images
                  with just a few clicks.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">
                  Extensive Template Library
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose from a wide range of professionally designed templates
                  to kickstart your projects.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Customization Options</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Easily customize your images with a variety of tools,
                  including text, shapes, and filters.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Seamless Collaboration</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Invite team members to collaborate on projects and provide
                  feedback in real-time.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Intuitive User Interface</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enjoy a user-friendly interface that makes image creation a
                  breeze, even for beginners.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Seamless Integration</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Easily integrate Imagify with your existing workflows and
                  platforms.
                </p>
              </div>
            </div>
            <div className="flex justify-center flex-col sm:flex-row items-start gap-4">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href="#"
              >
                Try it Free
              </Link>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                href="#"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* reviews */}
        {/* <section
          id="reviews"
          className="w-full h-screen py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                What Our Customers Say
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Hear from our satisfied customers about their experience with
                Imagify.
              </p>
            </div>
            <div className="divide-y rounded-lg border">
              <div className="grid w-full grid-cols-3 items-stretch justify-center divide-x md:grid-cols-3">
                <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                  <div className="space-y-2 text-center">
                    <Image
                      alt="Avatar"
                      className="mx-auto rounded-full"
                      height="48"
                      src="/placeholder.svg"
                      style={{
                        aspectRatio: "48/48",
                        objectFit: "cover",
                      }}
                      width="48"
                    />
                    <div className="font-semibold">Jane Doe</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      CEO, Acme Inc
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Imagify has been a game-changer for our marketing team.
                      The AI-powered image generation capabilities are
                      incredible.
                    </p>
                  </div>
                </div>
                <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                  <div className="space-y-2 text-center">
                    <img
                      alt="Avatar"
                      className="mx-auto rounded-full"
                      height="48"
                      src="/placeholder.svg"
                      style={{
                        aspectRatio: "48/48",
                        objectFit: "cover",
                      }}
                      width="48"
                    />
                    <div className="font-semibold">John Smith</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      CMO, Globex Corp
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Imagify has streamlined our image creation process and
                      helped us create visuals that truly stand out.
                    </p>
                  </div>
                </div>
                <div className="mx-auto flex w-full items-center justify-center p-8">
                  <div className="space-y-2 text-center">
                    <img
                      alt="Avatar"
                      className="mx-auto rounded-full"
                      height="48"
                      src="/placeholder.svg"
                      style={{
                        aspectRatio: "48/48",
                        objectFit: "cover",
                      }}
                      width="48"
                    />
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Creative Director, Acme Design
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Imagify has been a game-changer for our design team. The
                      customization options are incredibly powerful.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Pricing */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Pricing
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Choose the plan that fits your needs and budget.
              </p>
            </div>
            <div className="flex justify-center">
              <Card className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Starter</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Perfect for individuals and small teams.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold">$9</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    per month
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                    AI-powered image generation
                  </li>
                  <li>
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                    Access to template library
                  </li>
                  <li>
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                    Basic customization tools
                  </li>
                  <li>
                    <CheckIcon className="mr-2 inline-block h-4 w-4" />5 GB
                    storage
                  </li>
                </ul>
                <Button className="w-full">Start Free Trial</Button>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
