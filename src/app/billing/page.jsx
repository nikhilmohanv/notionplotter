"use client";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { useCookies } from "next-client-cookies";
import { useState, useEffect } from "react";

export default async function Billing() {
  const cookies = useCookies();

  const uid = cookies.get("uid");
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
        });
    }
  }, []);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Billing Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                Next Due Date
              </p>
              <p className="text-lg font-medium">May 1, 2024</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                Subscription
              </p>
              <p className="text-lg font-medium">Pro Plan - $19/month</p>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400">Payment Method</p>
            <div className="flex items-center gap-2">
              <img
                alt="Card"
                className="rounded"
                height={20}
                src="/placeholder.svg"
                style={{
                  aspectRatio: "32/20",
                  objectFit: "cover",
                }}
                width={32}
              />
              <p className="text-lg font-medium">Visa ending in 1234</p>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400">Status</p>
            <Badge variant="success">Active</Badge>
          </div>
          <Separator className="my-6" />
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel Subscription</Button>
            <Button variant="outline">Pause Subscription</Button>
            <Button>Update Payment</Button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Billing History</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>April 1, 2024</TableCell>
                <TableCell>$19.00</TableCell>
                <TableCell>
                  <Badge variant="success">Paid</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>March 1, 2024</TableCell>
                <TableCell>$19.00</TableCell>
                <TableCell>
                  <Badge variant="success">Paid</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>February 1, 2024</TableCell>
                <TableCell>$19.00</TableCell>
                <TableCell>
                  <Badge variant="success">Paid</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
