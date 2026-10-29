import { useEffect } from "react";
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
import AuthorPage from "@/pages/AuthorPage";
import { ServicesIndexPage, ServiceDetailPage } from "@/pages/ServicesPage";
import ProjectDetail from "@/pages/ProjectDetail";
import ProjectsPage from "@/pages/ProjectsPage";
import GalleryPage from "@/pages/GalleryPage";
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

// React Router does not scroll to the top on route changes. Every route
// render lands mid-page where the user left the previous one, so reset the
// scroll position to the top of the new page. The Home page re-reads
// window.location.hash on mount and will scroll to a section when one is
// present, so only do a plain jump-to-top when there is no hash.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function App() {
  useLenis();
  return (
    <CalcProvider>
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop />
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
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:gbId" element={<ProjectDetail />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/author/:slug" element={<AuthorPage />} />
            <Route path="/services" element={<ServicesIndexPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
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
