"use client";

import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function CallBackCookie() {
  const cookies = useCookies();
  const pathname = usePathname();
  const router = useRouter();
  const uid = cookies.get("uid");

  useEffect(() => {
    const value = pathname.slice(10);
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    if (value !== undefined && value !== null) {
      cookies.set("access_token", value, {
        expires: expires,
        priority: "high",
        sameSite: "strict",
      });
    }
  }, []);

  router.push("/dashboard");
}
