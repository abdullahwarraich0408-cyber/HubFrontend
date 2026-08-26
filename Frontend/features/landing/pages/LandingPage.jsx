"use client";

import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { QuickServiceSearch } from "../components/QuickServiceSearch";
import { Services } from "../components/Services";
import { FocusAreas } from "../components/FocusAreas";
import { HowItWorks } from "../components/HowItWorks";
import { ProviderSection } from "../components/ProviderSection";
import { LabSection } from "../components/LabSection";
import { WhyMedzoos } from "../components/WhyMedzoos";
import { FutureSpecialties } from "../components/FutureSpecialties";
import { ProviderCTA } from "../components/ProviderCTA";
import { TrustSection } from "../components/TrustSection";
import { CTASection } from "../components/CTASection";
import { Footer } from "../components/Footer";

export function LandingPage() {
  return (
    <div id="top" className="landing-page min-h-screen overflow-x-clip bg-white">
      <div className="relative bg-[#082B3F]">
        <Navbar />
      </div>
      <Hero />
      <main>
        <QuickServiceSearch />
        <Services />
        <FocusAreas />
        <HowItWorks />
        <ProviderSection />
        <LabSection />
        <WhyMedzoos />
        <FutureSpecialties />
        <ProviderCTA />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
