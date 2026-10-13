import { useEffect } from "react";
import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { CalculatorSection } from "@/components/site/CalculatorSection";
import { FinalCTA, Footer, MobileBar } from "@/components/site/FaqCtaFooter";
import { useCalc } from "@/lib/calcContext";

export default function CalculatorPage() {
  const { setStep } = useCalc();
  useEffect(() => setStep(2), [setStep]);
  return (
    <div className="min-h-screen bg-paper text-ink" data-testid="calculator-page">
      <AnnouncementStrip />
      <Navbar />
      <main>
        <CalculatorSection standalone />
        <FinalCTA />
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
