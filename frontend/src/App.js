import { lazy, Suspense, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import { CalcProvider } from "@/lib/calcContext";
import { scrollToTop } from "@/lib/scroll";
import { useLenis } from "@/hooks/useLenis";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";

// Pages are split into their own chunks so the home route doesn't pay for
// every page's code up front. Home stays eager — it's the landing route and
// the catch-all fallback. Named-export pages get a default wrapper.
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const CalculatorPage = lazy(() => import("@/pages/CalculatorPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const ReviewsPage = lazy(() => import("@/pages/ReviewsPage"));
const FaqPage = lazy(() => import("@/pages/FaqPage"));
const CaseStudiesPage = lazy(() => import("@/pages/CaseStudiesPage"));
const CaseStudyDetail = lazy(() => import("@/pages/CaseStudyDetail"));
const BlogIndex = lazy(() =>
  import("@/pages/Blog").then((m) => ({ default: m.BlogIndex }))
);
const BlogDetail = lazy(() =>
  import("@/pages/Blog").then((m) => ({ default: m.BlogDetail }))
);
const AuthorPage = lazy(() => import("@/pages/AuthorPage"));
const ServicesIndexPage = lazy(() =>
  import("@/pages/ServicesPage").then((m) => ({
    default: m.ServicesIndexPage,
  }))
);
const ServiceDetailPage = lazy(() =>
  import("@/pages/ServicesPage").then((m) => ({
    default: m.ServiceDetailPage,
  }))
);
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));

// Neutral placeholder while a chunk streams in — matches the page background
// so the swap is seamless rather than a white flash.
function PageFallback() {
  return <div className="min-h-screen bg-paper text-ink" />;
}

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
    // Must go through Lenis when it's active — a plain window.scrollTo leaves
    // Lenis's virtual scroll position mid-page.
    scrollToTop();
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
          <Suspense fallback={<PageFallback />}>
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
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/author/:slug" element={<AuthorPage />} />
              <Route path="/services" element={<ServicesIndexPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
          <SiteChrome />
        </BrowserRouter>
      </HelmetProvider>
      <Toaster position="top-center" richColors />
    </CalcProvider>
  );
}

export default App;
