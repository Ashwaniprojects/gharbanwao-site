import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import CaseStudiesPage from "@/pages/CaseStudiesPage";
import CaseStudyDetail from "@/pages/CaseStudyDetail";
import { BlogIndex, BlogDetail } from "@/pages/Blog";
import AdminPage from "@/pages/AdminPage";
import { CalcProvider } from "@/lib/calcContext";
import { useLenis } from "@/hooks/useLenis";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";

/** The floating WhatsApp button belongs to the marketing site, not the CMS. */
function SiteChrome() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;
  return <FloatingWhatsApp />;
}

function App() {
  useLenis();
  return (
    <CalcProvider>
      <HelmetProvider>
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
            <Route path="/case-studies" element={<CaseStudiesPage />} />
            <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <SiteChrome />
        </BrowserRouter>
      </HelmetProvider>
      <Toaster position="top-center" richColors />
    </CalcProvider>
  );
}

export default App;
