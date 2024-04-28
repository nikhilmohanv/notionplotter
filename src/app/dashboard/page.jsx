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
                      <Button>
                        <Link href={notionAuthUrl}>Edit Notion Access</Link>
                      </Button>
                    </div>
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
