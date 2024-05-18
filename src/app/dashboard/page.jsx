"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import axios from "axios";
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
import UpgradeButton from "@/components/basic/upgradebutton";

export default function Dashboard() {
  const cookies = useCookies();

  // if isPro is set on cookie then get that value so that i don't have to wait until then the usesubscripiton api will be fetched gradually
  const [isPro, setIsPro] = useState();
  const [onTrial, setOnTrial] = useState(true);
  const { user } = UserAuth();

  //get user subscription plan
  useEffect(() => {
    if (cookies.get("isPro") == "true") {
      setIsPro(true);
    } else {
      setIsPro(false);
    }
    if (typeof cookies.get("isPro") == "boolean") {
    } else {
    }

    fetch("/api/payment/getusersubscriptionplan")
      .then((data) => data.json())
      .then((data) => {
        const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

        console.log(data.isPro);
        data.isPro !== undefined && setIsPro(data.isPro);
        cookies.set("isPro", data.isPro, {
          expires: expires,
          priority: "high",
          sameSite: "strict",
        });
        data.onTrial !== undefined && setOnTrial(data.onTrial);
      });
  }, []);
  useEffect(() => {
    if (cookies.get("access_token") == undefined) {
      setAddToNotion(true);
    } else {
      setAddToNotion(false);
    }
  }, [cookies.get("access_token")]);
  // useEffect(() => {
  //   console.log("user ", user);
  //   if (!cookies.get("uid")) {
  //     //redirect to /login page when not logged in.
  //     redirect("/");
  //   }
  // }, [user]);

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
  const [checkoutUrl, setCheckoutUrl] = useState("");
  useEffect(() => {
    const getCheckoutUrl = async () => {
      try {
        const response = await axios.post("/api/productPurchase", {
          productId: "357049",
        });

        console.log(response.data);
        setCheckoutUrl(response.data.checkoutUrl);
      } catch (error) {
        console.error(error);
      }
    };
    if (!isPro) {
      getCheckoutUrl();
    }
  }, [isPro]);
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
                      {!isPro && <UpgradeButton isPro={isPro} />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-col-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 flex mt-3">
                <div className="grid place-items-center border-dashed border-2 min-h-20 rounded-lg">
                  {cookies.get("access_token") == null ? (
                    "Cookies are reset please login again"
                  ) : isPro ? (
                    <CreateGraph loading={loading} />
                  ) : (
                    <UpgradeButton isPro={isPro} />
                  )}
                </div>
                {docs.length !== 0
                  ? docs.map((doc) => (
                      <div key={doc.id}>
                        <Card x-chunk="dashboard-01-chunk-0">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Link href={`/edit/${doc.id}`}>
                              <CardTitle className="text-sm font-medium">
                                {doc.data.type}
                              </CardTitle>
                            </Link>
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                  }}
                                >
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" className="h-1">
                                        Delete
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This
                                          will permanently delete this chart and
                                          associated data from our servers.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction>
                                          <Button
                                            onClick={() => handleDelete(doc.id)}
                                          >
                                            Continue
                                          </Button>
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </CardHeader>
                          <Link href={`/edit/${doc.id}`}>
                            <CardContent>
                              <div className="text-xl font-bold">
                                {doc.data.name}
                              </div>
                              {/* <p className="text-xs text-muted-foreground">
                                +20.1% from last month
                              </p> */}
                            </CardContent>
                          </Link>
                        </Card>
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
