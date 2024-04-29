"use client";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";

export default function Billing() {
  const cookies = useCookies();

//   const uid = cookies.get("uid");
const uid= "1234567890";
  const [renewDate, setRenewDate] = useState();
  useEffect(() => {
    if (uid) {
      fetch("/api/firebase/getdocument?collection=subscription&docId=" + uid, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setRenewDate(data.renews_at);

          console.log(data);
        });
    }
  }, []);

  return (
    <>
      <h2>Your bill</h2>
      <br />

      <Card x-chunk="dashboard-01-chunk-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">doc.data.type</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-xl font-bold">Renew date</div>
          <p className="text-xs text-muted-foreground">{renewDate}</p>
        </CardContent>
      </Card>
    </>
  );
}
