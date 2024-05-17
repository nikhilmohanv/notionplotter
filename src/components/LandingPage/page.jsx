"use client";

import { FAQ } from "./FAQ";
import { Features } from "./Features";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { Navbar } from "./Navbar";
import { Pricing } from "./Pricing";
import { ScrollToTop } from "./ScrollToTop";

import { Testimonials } from "./Testimonials";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      {/* <Sponsors /> */}
      <HowItWorks />
      <Features />
      {/* <Services /> */}
      {/* <Cta /> */}
      <Testimonials />
      {/* <Team /> */}
      <Pricing />
      {/* <Newsletter /> */}
      <FAQ />
      {/* <Footer /> */}
      <ScrollToTop />
    </>
  );
}

export default App;
