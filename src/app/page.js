
import { FAQ } from "../components/LandingPage/FAQ";
import { Features } from "../components/LandingPage/Features";
import { Hero } from "../components/LandingPage/Hero";
import { HowItWorks } from "../components/LandingPage/HowItWorks";
import { Navbar } from "../components/LandingPage/Navbar";
import { Pricing } from "../components/LandingPage/Pricing";
import { Footer } from "@/components/LandingPage/Footer";
import { ScrollToTop } from "../components/LandingPage/ScrollToTop";

export default async function Home() {
  return (
    <>
    {/* <LoggedInNavBar/> */}
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </>
  );
}
