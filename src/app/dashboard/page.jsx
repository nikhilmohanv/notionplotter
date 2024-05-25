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
import { useSearchParams } from "next/navigation";
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
  
} from "firebase/firestore";
import app from "@/lib/firebase/config";
import CreateGraph from "@/components/basic/creategraph";
import LoggedInNavBar from "@/components/navbar/loggedin-navbar";
import UpgradeButton from "@/components/basic/upgradebutton";
import ChartDisplay from "@/components/dashboard/chartsdisplay";

export default function Dashboard() {
  const cookies = useCookies();

  // if isPro is set on cookie then get that value so that i don't have to wait until then the usesubscripiton api will be fetched gradually
  const [isPro, setIsPro] = useState();
  const [onTrial, setOnTrial] = useState(true);
  const { user } = UserAuth();
  const uid = cookies.get("uid");

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

        data.isPro !== undefined && setIsPro(data.isPro);
        cookies.set("isPro", data.isPro, {
          expires: expires,
          priority: "high",
          sameSite: "strict",
        });
        data.onTrial !== undefined && setOnTrial(data.onTrial);
      });
  }, []);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has("n")) {
      setAddToNotion(true);
    } else {
      setAddToNotion(false);
    }
  }, []);
  useEffect(() => {
    if (
      cookies.get("access_token") == undefined ||
      cookies.get("access_token") == null
    ) {
      setAddToNotion(true);
      console.log("add true");
    } else {
      setAddToNotion(false);
      console.log("add false");
    }
  }, []);

  const db = getFirestore(app);
  const [loading, setLoading] = useState(true);

  const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=34d5c9a9-5b7d-4b77-be4b-6a5521f6560c&response_type=code&state=${uid}`;

  const [docs, setDocs] = useState([]);

  //if true then show the add to notion button
  const [addToNotion, setAddToNotion] = useState(true);


  //getting the notion status that is, is it new account or not if n is t then new account else already notion secret token associated with it

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

  const [checkoutUrl, setCheckoutUrl] = useState("");
  useEffect(() => {
    const getCheckoutUrl = async () => {
      try {
        const response = await axios.post("/api/productPurchase", {
          productId: "256750",
        });

        setCheckoutUrl(response.data.checkoutUrl);
      } catch (error) {
        console.error(error);
      }
    };
    if (!isPro) {
      getCheckoutUrl();
    }
  }, [isPro]);

  console.log(addToNotion);
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
                    "something went wrong login again"
                  ) : isPro ? (
                    <CreateGraph loading={loading} />
                  ) : (
                    <UpgradeButton isPro={isPro} />
                  )}
                </div>
                {docs.length !== 0 ? <ChartDisplay docs={docs} /> : null}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
