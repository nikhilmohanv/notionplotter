"use client";
import Link from "next/link";
import { CircleUser, Menu, Package2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LoggedInNavBar from "@/components/basic/navbar/loggedin-navbar";
import { UserAuth } from "../context/firebaseauth/authcontext";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const { user, logout } = UserAuth();
  const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=34d5c9a9-5b7d-4b77-be4b-6a5521f6560c&response_type=code`;
  return (
    <div className="flex min-h-screen w-full flex-col">
      <LoggedInNavBar />
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start ">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notion">Notion</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <div className="grid gap-6">
                {/* email and password */}
                <Card>
                  <CardHeader>
                    <CardTitle>Account</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="name">Name</Label>
                      {user && (
                        <Input id="name" defaultValue={user.displayName} />
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Username</Label>
                      {user && <Input id="email" defaultValue={user.email} />}
                    </div>
                  </CardContent>
                </Card>
                {/* subscription */}
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className=" md:px-6">
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                          <h2 className="text-2xl font-bold">
                            Billing Details
                          </h2>
                          <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 dark:text-gray-400">
                                Next Due Date
                              </span>
                              <span className="font-medium">May 1, 2024</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 dark:text-gray-400">
                                Subscription
                              </span>
                              <span className="font-medium">$3.99/month</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 dark:text-gray-400">
                                Payment Method
                              </span>
                              <div className="flex items-center gap-2">
                                {/* <CreditCardIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" /> */}
                                <span className="font-medium">
                                  Visa ending in 1234
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                          <h2 className="text-2xl font-bold">
                            Manage Subscription
                          </h2>
                          <div className="mt-6 space-y-4">
                            <Button className="w-full" variant="outline">
                              Cancel Subscription
                            </Button>
                            <Button className="w-full" variant="outline">
                              Pause Subscription
                            </Button>
                            <Button className="w-full">
                              Update Payment Information
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="notion">
              <Card>
                <CardHeader>
                  <CardTitle>Notion</CardTitle>
                  <CardDescription>
                    Edit access to notion pages and databases.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button>
                    <Link href={notionAuthUrl}>Edit access</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Name</CardTitle>
              </CardHeader>
              <CardContent>
                {user && (
                  <Input
                    placeholder="Name"
                    className="text-black"
                    defaultValue={user.displayName}
                  ></Input>
                )}
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                {user && (
                  <Input
                    placeholder="Email"
                    className="text-black"
                    defaultValue={user.email}
                  ></Input>
                )}
              </CardContent>
            </Card>
          </div> */}
        </div>
      </main>
    </div>
  );
}
