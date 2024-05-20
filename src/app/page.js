"use server"

// import { useState, useEffect } from "react";
import { FAQ } from "../components/LandingPage/FAQ";
import { Features } from "../components/LandingPage/Features";
import { Hero } from "../components/LandingPage/Hero";
import { HowItWorks } from "../components/LandingPage/HowItWorks";
import { Navbar } from "../components/LandingPage/Navbar";
import { Pricing } from "../components/LandingPage/Pricing";
import { Footer } from "@/components/LandingPage/Footer";
import { ScrollToTop } from "../components/LandingPage/ScrollToTop";
// import { UserAuth } from "./context/firebaseauth/authcontext"

export default async function Home() {
  return (
    <>
      <Navbar/>
      <Hero/>
      {/* <Sponsors /> */}
      <HowItWorks  />
      <Features />
      {/* <Services /> */}
      {/* <Cta /> */}
      {/* <Testimonials /> */}
      {/* <Team /> */}
      <Pricing/>
      {/* <Newsletter /> */}
      <FAQ />
      <Footer />
      <ScrollToTop />
    </>
  );
}

function CheckIcon(props) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
