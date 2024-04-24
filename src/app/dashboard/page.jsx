"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

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
import DotIcon from "@/components/icons/doticon";
import SearchIcon from "@/components/icons/searchicon";
import Image from "next/image";
import { JSX, SVGProps, useContext, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
// import ChartCard from "@/components/basic/chartcards/chartcard";
import { UserAuth } from "@/app/context/firebaseauth/authcontext";
import { useCookies } from "next-client-cookies";
import { deleteCookie } from "cookies-next";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import {
  collection,
  getDocs,
  where,
  query,
  getFirestore,
} from "firebase/firestore";
import app from "@/firebase/config";
import CreateGraph from "@/components/basic/creategraph";
import LoadingGif from "@/components/icons/loadinggif";
import LoggedInNavBar from "@/components/basic/navbar/loggedin-navbar";

export default function Component() {
  const { user, logout } = UserAuth();
  useEffect(() => {
    if (!user) {
      //redirect to /login page when not logged in.
      redirect("/");
    }
  }, [user]);

  const cookies = useCookies();
  const db = getFirestore(app);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=34d5c9a9-5b7d-4b77-be4b-6a5521f6560c&response_type=code&id=48450543`;

  const [chartType, setChartType] = useState();
  const [selectedDb, setSelectedDb] = useState();
  const [docs, setDocs] = useState([]);

  //if true then show the add to notion button
  const [addToNotion, setAddToNotion] = useState(true);

  const router = useRouter();

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
          where("userid", "==", user.uid)
        );
        try {
          const result = await getDocs(q);

          let documents = result.docs.map((doc) => {
            return {
              id: doc.id,
              data: doc.data(),
            };
          });

          documents.sort();

          setDocs(documents);
          //if no documents are present then show loading
          if (docs.length == 0) {
            setLoading(true);
          } else {
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching documents:", error);
        }
      }
    }
    getDocuments()
  }, [user])

  //creating graph by adding a new document to firestore

  const handleSignOut = async () => {
    try {
      await logout();
      deleteCookie("access_token", { path: "/", domain: ".localhost" });
      deleteCookie("uid", { path: "/", domain: ".localhost" });
      redirect("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    // e.preventDefault()
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

  return (
    <div
      key="1"
      className="grid min-h-screen w-full container mx-auto px-1 sm:px-1 lg:px-20"
    >
      <div className="flex flex-col">
        {/* <LoadingGif></LoadingGif> */}
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
                  <div className="flex flex-row items-center">
                    <div className="grid gap-2">
                      <h2 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-3xl">
                        My charts
                      </h2>
                    </div>
                    {/* <CreateGraph loading={loading}/> */}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-col-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 flex mt-3">
                <div className="grid place-items-center border-dashed border-2 min-h-20 rounded-lg">
                  <CreateGraph loading={loading} />
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

function LineChartIcon(props) {
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
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function HomeIcon(props) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ShoppingCartIcon(props) {
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
      <circle
        cx="8"
        cy="2: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>1"
        r="1"
      />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function PackageIcon(props) {
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
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement> 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function UsersIcon(props) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Package2Icon(props) {
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
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}
