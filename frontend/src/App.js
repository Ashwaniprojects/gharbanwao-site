import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import CalculatorPage from "@/pages/CalculatorPage";
import RegisterPage from "@/pages/RegisterPage";
import ReviewsPage from "@/pages/ReviewsPage";
import FaqPage from "@/pages/FaqPage";
import { CalcProvider } from "@/lib/calcContext";
import { useLenis } from "@/hooks/useLenis";
import { BuilderMascot } from "@/components/site/BuilderMascot";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";

function App() {
  useLenis();
  return (
    <CalcProvider>
      <HelmetProvider>
        <div className="mascot-root">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </div>
      </HelmetProvider>
      <Toaster position="top-center" richColors />
      <div className="desktop-only">
        <BuilderMascot size={80} />
      </div>
      <FloatingWhatsApp />
    </CalcProvider>
  );
}

export default App;
