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
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    // Set the value of the 'my-cookie' cookie
    if (value != undefined || value != null) {
      cookies.set("access_token", value, {
        expires: expires,
        priority: "high",
        sameSite: "strict",
      });
    }
    redirect("/");
  }, []);
}
