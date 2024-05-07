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

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NotionPlotter",
  description: "Create charts for notion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
