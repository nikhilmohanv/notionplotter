"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import {
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
  Card,
  CardHeader,
} from "@/components/ui/card";
import CheckIcon from "@/components/icons/checkicon";
import DotIcon from "@/components/icons/doticon";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// import ChartCard from "@/components/basic/chartcards/chartcard";
import { UserAuth } from "@/app/context/firebaseauth/authcontext";
import { useCookies } from "next-client-cookies";
// import { collection, query, where, orderBy,  } from "firebase/firestore";
import {
  collection,
  where,
  query,
  getFirestore,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import app from "@/firebase/config";
import CreateGraph from "@/components/basic/creategraph";
import LoggedInNavBar from "@/components/basic/navbar/loggedin-navbar";

export default function Dashboard() {
  const [isPro, setIsPro] = useState(true);
  const [onTrial, setOnTrial] = useState(true);
  //get user subscription plan
  useEffect(() => {
    fetch("/api/payment/getusersubscriptionplan")
      .then((data) => data.json())
      .then((data) => {
        console.log(data.isPro);
        data.isPro !== undefined && setIsPro(data.isPro);

        data.onTrial !== undefined && setOnTrial(data.onTrial);
      });
  }, []);

  const { user } = UserAuth();
  useEffect(() => {
    console.log("user ", user);
    if (!user) {
      //redirect to /login page when not logged in.
      redirect("/");
    }
  }, [user]);

  const cookies = useCookies();
  const db = getFirestore(app);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=34d5c9a9-5b7d-4b77-be4b-6a5521f6560c&response_type=code`;

  const [docs, setDocs] = useState([]);

  //if true then show the add to notion button
  const [addToNotion, setAddToNotion] = useState(true);

  const router = useRouter();

  //getting the notion status that is, is it new account or not if n is t then new account else already notion secret token associated with it
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has("n")) {
      setAddToNotion(true);
    } else {
      setAddToNotion(false);
    }
  }, []);

  //getting the notion token
  useEffect(() => {
    if (cookies.get("access_token") == undefined) {
      setAddToNotion(true);
    } else {
      setAddToNotion(false);
    }
  }, [cookies.get("access_token")]);

  //getting all created graphs from firestore
  useEffect(() => {
    async function getDocuments() {
      if (user != null && user != undefined) {
        const q = query(
          collection(db, "graphs"),
          where("userid", "==", user.uid),
          orderBy("createdDate", "asc")
        );

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const documents = snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }));

            documents.sort();
            setDocs(documents);
            setLoading(false); // Assuming loading should be set to false once data is received
          },
          (error) => {
            console.error("Error fetching documents:", error);
            setLoading(true); // Set loading to true if an error occurs
          }
        );

        // Unsubscribe from the snapshot listener when component unmounts
        return () => unsubscribe();
      }
    }
    getDocuments();
  }, [user]);

  const handleDelete = (id) => {
    try {
      const ref = doc(db, "graphs", id);
      deleteDoc(ref)
        .then(() => {
          router.push("/");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  };
  const checkoutUrl = "fs";
  console.log("IS pro ", isPro);
  return (
    <div
      key="1"
      className="grid min-h-screen w-full container mx-auto px-1 sm:px-1 lg:px-20"
    >
      <div className="flex flex-col">
        <div className="mt-5">
          <LoggedInNavBar />
        </div>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {addToNotion ? (
            <div
              className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
              x-chunk="dashboard-02-chunk-1"
            >
              <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                  Connect to Notion
                </h3>
                <p className="text-sm text-muted-foreground">
                  You can create graphs after connecting to notion.
                </p>
                <Button className="mt-4">
                  <Link href={notionAuthUrl}>Add To Notion</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:gap-8 mt-3">
                <div className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
                  <div className="flex flex-row items-center justify-between">
                    <div className="grid gap-2">
                      <h2 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-3xl">
                        My charts
                      </h2>
                    </div>
                    <div className="ml-auto flex-initial space-x-2">
                      {!isPro && (
                        // <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed shadow-sm">
                        //   Upgrade to premium
                        // </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            {/* <button id="subscribeButton">Upgrade to Pro</button> */}
                            <Button id="subscribeButton" variant="outline">
                              Upgrade to Pro
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              {/* <DialogTitle>Share link</DialogTitle> */}
                            </DialogHeader>
                            <div id="pricing" className="w-full">
                              <div className="container grid items-center justify-center gap-1 text-center md:px-6">
                                <div className="space-y-1">
                                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                                    Pricing
                                  </h2>
                                  {/* <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                    Choose the plan that fits your needs and
                                    budget.
                                  </p> */}
                                </div>
                                <div className="flex justify-center">
                                  <Card className="space-y-4 rounded-lg border-none bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                                    <div className="space-y-1">
                                      <h3 className="text-2xl font-bold">
                                        Pro
                                      </h3>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="text-4xl font-bold">
                                        $3.99
                                      </div>
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
                                        <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                        5 GB storage
                                      </li>
                                    </ul>
                                    <Button className="w-full">
                                      <Link href={checkoutUrl} target="_blank">
                                        Start Free Trial
                                      </Link>
                                    </Button>
                                  </Card>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-col-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 flex mt-3">
                <div className="grid place-items-center border-dashed border-2 min-h-20 rounded-lg">
                  {isPro ? (
                    <CreateGraph loading={loading} />
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        {/* <button id="subscribeButton">Upgrade to Pro</button> */}
                        <Button id="subscribeButton" variant="outline">
                          Upgrade to Pro
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          {/* <DialogTitle>Share link</DialogTitle> */}
                        </DialogHeader>
                        <div id="pricing" className="w-full">
                          <div className="container grid items-center justify-center gap-1 text-center md:px-6">
                            <div className="space-y-1">
                              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                                Pricing
                              </h2>
                              {/* <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                            Choose the plan that fits your needs and
                            budget.
                          </p> */}
                            </div>
                            <div className="flex justify-center">
                              <Card className="space-y-4 rounded-lg border-none bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                                <div className="space-y-1">
                                  <h3 className="text-2xl font-bold">Pro</h3>
                                </div>
                                <div className="space-y-2">
                                  <div className="text-4xl font-bold">
                                    $3.99
                                  </div>
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
                                    <CheckIcon className="mr-2 inline-block h-4 w-4" />
                                    5 GB storage
                                  </li>
                                </ul>
                                <Button className="w-full">
                                  <Link href={checkoutUrl} target="_blank">
                                    Start Free Trial
                                  </Link>
                                </Button>
                              </Card>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                {docs.length !== 0
                  ? docs.map((doc) => (
                      <div key={doc.id}>
                        <Link href={`/edit/${doc.id}`}>
                          <Card x-chunk="dashboard-01-chunk-0">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                {doc.data.type}
                              </CardTitle>

                              <DropdownMenu className="h-4 w-4 text-muted-foreground">
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    className="h-5 w-5"
                                    size="icon"
                                    variant="ghost"
                                  >
                                    <DotIcon />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(doc.id)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </CardHeader>

                            <CardContent>
                              <div className="text-xl font-bold">
                                {doc.data.name}
                              </div>
                              {/* <p className="text-xs text-muted-foreground">
                                +20.1% from last month
                              </p> */}
                            </CardContent>
                          </Card>
                        </Link>
                      </div>
                    ))
                  : null}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
