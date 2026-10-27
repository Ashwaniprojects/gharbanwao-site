import { useEffect } from "react";
import { scrollToId } from "@/lib/scroll";
import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { OfferCenter } from "@/components/site/OfferCenter";
import { Hero } from "@/components/site/Hero";
import { TrustBar, WhyChoose } from "@/components/site/TrustWhy";
import { ProjectsMap } from "@/components/site/ProjectsMap";
import { Process, Services } from "@/components/site/ServicesProcessMaterials";
import { CalculatorSection } from "@/components/site/CalculatorSection";
import { Testimonials, VideoTestimonials } from "@/components/site/SocialProof";
import { Comparison } from "@/components/site/PricingTeam";
import { FAQ, FinalCTA, Footer, MobileBar } from "@/components/site/FaqCtaFooter";

export default function Home() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) setTimeout(() => scrollToId(id), 400);
  }, []);
  return (
    <div className="min-h-screen bg-paper text-ink" data-testid="home-page">
      <AnnouncementStrip />
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <VideoTestimonials />
        <WhyChoose />
        <ProjectsMap />
        <Services />
        <CalculatorSection />
        <Process />
        <Testimonials />
        <Comparison />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <MobileBar />
      <OfferCenter />
    </div>
  );
}
