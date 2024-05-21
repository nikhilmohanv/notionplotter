import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  AuthContextProvider,
  LoadingProvider,
} from "./context/firebaseauth/authcontext";
import { CookiesProvider } from "next-client-cookies/server";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/lib/analytics/GoogleAnalytics";
import LemonAffiliate from "@/lib/affiliates/lemonSqueezysetup";

const inter = Inter({ subsets: ["latin"] });
{
  /* <meta name="google-site-verification" content="VHfRBRG9El_CMvJo5ZfcDGxfC8T_22hsEAS99iSDMyQ" /> */
}
export const metadata = {
  title: "NotionPlotter - create charts from Notion",
  description:
    "Create aesthetic, custom and embeddable charts from Notion easily with Notion plotter. You can create bar, pie, area, donut charts and more from Notion.",
  keywords: [],
  alternates: {
    canonical: "https://notionplotter.com",
  },
  other: {
    "google-site-verification": "VHfRBRG9El_CMvJo5ZfcDGxfC8T_22hsEAS99iSDMyQ",
    "yandex-verification": "62bc7c81fad65fbd",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleAnalytics />
      <LemonAffiliate />
      <body className={inter.className}>
        <CookiesProvider>
          <AuthContextProvider>
            <LoadingProvider>
              {children}
              <Analytics />
              <SpeedInsights />
            </LoadingProvider>
          </AuthContextProvider>
        </CookiesProvider>
      </body>
    </html>
  );
}
