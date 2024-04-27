"use client";
import { useCookies } from "next-client-cookies";
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function StoreCookies() {
  const cookies = useCookies();
  const pathname = usePathname();
  useEffect(() => {
    const value = pathname.slice(14);
    // Set the value of the 'my-cookie' cookie
    cookies.set("access_token", value);
    redirect("/");
  }, []);
}
