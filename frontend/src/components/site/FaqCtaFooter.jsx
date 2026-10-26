import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Home,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaYoutube } from "react-icons/fa6";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Container, Reveal, SectionHeader } from "./shared";
import { CITIES, PHONES, WHATSAPP_URL, HOME_FAQS } from "@/data/content";
import { createLead } from "@/lib/api";
import { scrollToId } from "@/lib/scroll";

export const FAQ = () => (
  <section id="faq" className="section-gb" data-testid="faq-section">
    <Container className="grid lg:grid-cols-5 gap-10">
      <div className="lg:col-span-2">
        <SectionHeader title="Things homeowners actually ask us" supporting={`If the answer is "it depends," we say "it depends" and explain the variables.`} />
        <Reveal delay={0.1} className="mt-6">
          <Link to="/faq" className="inline-flex items-center gap-1.5 font-bold underline decoration-green decoration-2 underline-offset-4" data-testid="faq-all-link">Read all 15 construction FAQs <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>
      </div>
      <Reveal className="lg:col-span-3">
        <Accordion type="single" collapsible className="divide-y divide-divider border-y border-divider" data-testid="faq-accordion">
          {HOME_FAQS.map(([q, a], i) => (
            <AccordionItem key={q} value={`q${i}`} className="border-0 data-[state=open]:bg-wash-yellow px-4 -mx-4 rounded-xl transition-colors">
              <AccordionTrigger className="py-5 text-left text-[16px] md:text-[17px] font-bold hover:no-underline [&>svg]:text-green-700" data-testid={`faq-trigger-${i + 1}`}>
                <span className="flex gap-4"><span className="font-mono text-[12px] text-ink/40 mt-1.5">{String(i + 1).padStart(2, "0")}</span>{q}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pl-10 text-[15px] text-ink/75 leading-relaxed" data-testid={`faq-content-${i + 1}`}>{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </Container>
  </section>
);

const TIMELINES = ["Within 1 month", "1–3 months", "3–6 months", "Just exploring"];

export const FinalCTA = () => {
  const [f, setF] = useState({ name: "", phone: "", whatsapp: "", city: "Lucknow", locality: "", plot_size: "", timeline: "" });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e?.target ? e.target.value : e }));
  const mutation = useMutation({
    mutationFn: createLead,
    onSuccess: (res) => {
      toast.success("Consultation booked.", { description: "We call within 2 hours on business days." });
      // If the WhatsApp push did not go through, hand the user a pre-filled
      // chat so the enquiry still reaches us.
      if (res && res.whatsapp_fallback) {
        window.open(res.whatsapp_fallback, "_blank", "noopener");
      }
      setF({ name: "", phone: "", whatsapp: "", city: "Lucknow", locality: "", plot_size: "", timeline: "" });
    },
    onError: () => toast.error("Could not submit. WhatsApp us at 09648249999."),
  });
  const submit = (e) => {
    e.preventDefault();
    mutation.mutate({ ...f, whatsapp: f.whatsapp || f.phone, source: "consultation_form" });
  };

  return (
    <section id="contact" className="section-gb bg-wash-yellow relative grain" data-testid="final-cta-section">
      <Container className="relative grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <SectionHeader label="FREE · NO COMMITMENT" title="Ready to start?" supporting="Free site visit. Free design discussion. Free written quote. No commitment to continue after." />
          <Reveal className="mt-8 flex flex-wrap gap-x-3 gap-y-1 text-[14px] font-medium text-ink/70" data-testid="cta-trust-row">
            <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-green text-green" /> 4.8/5 Google</span><span>·</span><span>260+ homes</span><span>·</span><span>Avg response in under 2 hours</span>
          </Reveal>
          <Reveal className="mt-10 flex flex-col sm:flex-row gap-3">
            <a href={`tel:${PHONES[0]}`} className="pill-green h-12 px-6 text-[15px]" data-testid="cta-call-link"><Phone className="h-[18px] w-[18px]" strokeWidth={2.5} /> {PHONES[0]}</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="pill-yellow h-12 px-6 text-[15px] border border-ink/10" data-testid="cta-whatsapp-link"><MessageCircle className="h-4 w-4" /> Get Quote on WhatsApp</a>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <form onSubmit={submit} className="card-gb p-6 md:p-8 bg-paper grid gap-4" data-testid="consultation-form">
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder="Name" value={f.name} onChange={set("name")} className="input-gb" data-testid="form-name-input" />
              <input required type="tel" pattern="[0-9+ ]{10,14}" placeholder="Phone (primary)" value={f.phone} onChange={set("phone")} className="input-gb" data-testid="form-phone-input" />
            </div>
            <input type="tel" placeholder="WhatsApp number (defaults to phone)" value={f.whatsapp} onChange={set("whatsapp")} className="input-gb" data-testid="form-whatsapp-input" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Select value={f.city} onValueChange={set("city")}>
                <SelectTrigger className="h-12 rounded-lg border-divider text-[16px]" data-testid="form-city-select"><SelectValue placeholder="City" /></SelectTrigger>
                <SelectContent>{[...CITIES, "Other"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              <input placeholder="Locality" value={f.locality} onChange={set("locality")} className="input-gb" data-testid="form-locality-input" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input placeholder="Plot size (optional) e.g. 30×50 ft" value={f.plot_size} onChange={set("plot_size")} className="input-gb" data-testid="form-plot-input" />
              <Select value={f.timeline} onValueChange={set("timeline")}>
                <SelectTrigger className="h-12 rounded-lg border-divider text-[16px]" data-testid="form-timeline-select"><SelectValue placeholder="Timeline" /></SelectTrigger>
                <SelectContent>{TIMELINES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <button type="submit" disabled={mutation.isPending} className="pill-green h-14 text-[17px] disabled:opacity-60" data-testid="form-submit-button">
              {mutation.isPending ? "Booking…" : "Book Free Consultation"} <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <p className="text-[13px] text-ink/55">We call within 2 hours on business days. You can also WhatsApp us directly at {PHONES[0]}.</p>
          </form>
        </Reveal>
      </Container>
    </section>
  );
};

// The dark footer's link columns, matching the site's live footer. `href` is
// a route, `external` leaves the site, and `comingSoon` renders a muted,
// non-clickable entry.
const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/about" },
      { label: "Careers", href: "/register" },
      { label: "Blogs / News", href: "/blog" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Residential Construction", href: "/services/construction-with-materials" },
      { label: "Architectural Planning", href: "https://nakshaabanwao.com/", external: true },
      { label: "2D & 3D Design", href: "/services/architecture-planning" },
      { label: "Structural Engineering", href: "/services/construction-with-materials" },
      { label: "Interiors & Finishing", href: "/services/interior-design" },
      { label: "Renovation", href: "/services/renovation-makeover" },
      { label: "Site Supervision", href: "/services/construction-with-materials" },
      { label: "Turnkey Construction", href: "/services/construction-with-materials" },
    ],
  },
  {
    title: "Projects",
    links: [
      { label: "Residential Projects", href: "/projects" },
      { label: "Commercial Projects", href: "/projects" },
      { label: "Naksha Banwao", href: "https://nakshaabanwao.com/", external: true },
      { label: "Project Gallery", href: "/projects" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Construction Cost Calculator", href: "/calculator" },
      { label: "Floor Plan Estimator", href: "/calculator" },
      { label: "Material Guide", href: "/services/construction-with-materials" },
      { label: "GB AI (Coming Soon)", comingSoon: true },
    ],
  },
  {
    title: "Partner With Us",
    links: [
      { label: "Channel Partner", href: "/register" },
      { label: "Join as Professional", href: "/register" },
      { label: "Material Suppliers", href: "/register" },
      { label: "Vendors", href: "/register" },
      { label: "Franchise / Business Partner", href: "/register" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Reviews", href: "/reviews" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund Policy", href: "/terms" },
      { label: "Login", href: "/admin" },
    ],
  },
];

const FOOTER_SOCIALS = [
  { Icon: FaFacebook, label: "Facebook", href: "https://www.facebook.com/gharbanwao/" },
  { Icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/gharbanwao/" },
  { Icon: FaYoutube, label: "YouTube", href: "https://www.youtube.com/@gharbanwao" },
  { Icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/" },
  { Icon: FaWhatsapp, label: "WhatsApp", href: WHATSAPP_URL },
];

const FOOTER_STATS = [
  { Icon: Home, value: "260+", label: "Homes Handed Over", note: "Across Lucknow" },
  { Icon: Users, value: "51+", label: "Ongoing Projects", note: "Currently in Progress" },
  { Icon: Star, value: "4.8/5", label: "Google Rating", note: "250+ genuine reviews" },
  { Icon: ShieldCheck, value: "25-Year", label: "Structural Warranty", note: "Built to last generations" },
  { Icon: BadgeCheck, value: "ISO 9001:2015", small: true, label: "Quality Management", note: "Certified" },
];

function FooterCol({ title, links }) {
  return (
    <div className="min-w-[150px] flex-1">
      <p className="text-[15px] font-extrabold text-white">{title}</p>
      <ul className="mt-4 space-y-2.5 text-[14px]">
        {links.map((item) =>
          item.comingSoon ? (
            <li key={item.label} className="text-white/40">
              {item.label}
            </li>
          ) : item.external ? (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/75 transition-colors hover:text-white"
                data-testid={`footer-link-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              >
                {item.label}
              </a>
            </li>
          ) : (
            <li key={item.label}>
              <Link
                to={item.href}
                className="text-white/75 transition-colors hover:text-white"
                data-testid={`footer-link-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              >
                {item.label}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

/* The light "Get a Free Consultation" band that sits above the dark footer,
   with the architectural sketch as the panel's backdrop art. */
const PreFooterCTA = () => (
  <div className="relative overflow-hidden bg-[#eaf4dc]" data-testid="pre-footer-cta">
    <img
      src="/images/footer-sketch.webp"
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[45%] object-cover object-left opacity-60 md:block"
    />
    <Container className="relative z-10 flex flex-col gap-8 py-8 lg:flex-row lg:items-center lg:gap-12">
      <div className="relative shrink-0">
        <img
          src="/images/about/warm-modern-house.webp"
          alt="A completed Ghar Banwao home"
          width="320"
          height="220"
          loading="lazy"
          decoding="async"
          className="h-[150px] w-[220px] rounded-2xl border border-ink/10 object-cover shadow-lg sm:h-[180px] sm:w-[260px]"
        />
      </div>
      <div className="max-w-[46ch] flex-1">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#0c352a]">
          Ready to build your dream home?
        </p>
        <h2 className="mt-2 text-[30px] font-extrabold leading-tight tracking-tight text-[#0c352a] sm:text-[38px]">
          Get a <span className="text-green">Free Consultation</span>
        </h2>
        <p className="mt-2 text-[15px] text-ink/70">
          Discuss your plot, requirements and budget with our expert team.
        </p>
      </div>
      <div className="flex flex-col items-start gap-4 lg:items-end">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#d8ebc0]">
            <Phone className="h-5 w-5 text-[#0c352a]" strokeWidth={2.25} />
          </span>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink/50">Call Us Now</p>
            <a href={`tel:${PHONES[0]}`} className="text-[19px] font-extrabold tabular-nums text-[#0c352a]" data-testid="pre-footer-call">
              {PHONES[0]}
            </a>
          </div>
        </div>
        <button
          onClick={() => scrollToId("contact")}
          className="inline-flex items-center gap-2 rounded-full bg-[#0c352a] px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-[#0a2b22]"
          data-testid="pre-footer-book"
        >
          Book Free Consultation <ArrowRight className="h-[18px] w-[18px]" />
        </button>
      </div>
    </Container>
  </div>
);

export const Footer = () => (
  <>
    <PreFooterCTA />
    <footer className="relative overflow-hidden bg-[#0c352a] pb-24 md:pb-10 text-white no-print" data-testid="footer">
      {/* Architectural sketch backdrop, right side, faded into the green */}
      <img
        src="/images/footer-sketch.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-full w-[55%] max-w-[820px] object-cover object-right opacity-[0.14] mix-blend-luminosity"
      />

      <Container className="relative z-10">
        {/* Brand + socials */}
        <div className="flex flex-col gap-10 border-b border-white/10 py-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="max-w-[380px]">
            <div className="inline-flex rounded-2xl bg-paper p-2.5 shadow-md">
              <img src="/logo.png" alt="Ghar Banwao" className="h-12 w-auto object-contain" />
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-white/80">
              Your one-stop solution for complete home construction — from planning and design to
              construction, interiors and final handover.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5" data-testid="footer-socials">
              {FOOTER_SOCIALS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition-colors hover:bg-white/20"
                  data-testid={`footer-social-${label.toLowerCase()}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div
              className="mt-6 inline-flex items-center gap-3 rounded-xl bg-yellow px-4 py-2.5 text-ink"
              data-testid="footer-gbai"
            >
              <Bot className="h-5 w-5" />
              <div className="leading-tight">
                <p className="text-[13px] font-extrabold">GB AI</p>
                <p className="text-[11px] font-semibold opacity-70">Coming Soon</p>
              </div>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          <div className="flex flex-1 flex-wrap justify-start gap-x-10 gap-y-8 lg:justify-between">
            {FOOTER_COLUMNS.map((col) => (
              <FooterCol key={col.title} {...col} />
            ))}
          </div>
        </div>

        {/* Trust + certification stats */}
        <div className="grid grid-cols-2 divide-x divide-white/10 border-b border-white/10 py-8 md:grid-cols-5">
          {FOOTER_STATS.map(({ Icon, value, label, note, small }) => (
            <div key={label} className="flex items-start gap-3 px-4 py-2 first:pl-0" data-testid={`footer-stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
              <Icon className={`mt-0.5 h-6 w-6 shrink-0 text-white/85 ${small ? "h-7 w-7" : ""}`} strokeWidth={1.75} />
              <div>
                <p className={`font-extrabold leading-tight ${small ? "text-[13px]" : "text-[17px]"} tabular-nums`}>{value}</p>
                <p className="text-[13px] font-bold text-white/85">{label}</p>
                <p className="text-[12px] text-white/55">{note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 py-6 text-[13px] text-white/60 md:flex-row md:items-center md:justify-between">
          <p data-testid="footer-copyright">
            © 2026 Ghar Banwao. All rights reserved. <span className="mx-2 text-white/25">|</span>
            Building Better Homes Since 2016.
          </p>
          <p>
            Designed &amp; Developed by{" "}
            <a href="https://clicknify.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-white/85 hover:text-white" data-testid="footer-clicknify">
              Clicknify
            </a>
          </p>
        </div>
      </Container>
    </footer>
  </>
);

export const MobileBar = () => (
  <div className="fixed bottom-0 inset-x-0 z-50 grid grid-cols-2 md:hidden no-print" data-testid="mobile-sticky-bar">
    <a href={`tel:${PHONES[0]}`} className="h-14 bg-yellow text-ink font-bold grid place-items-center active:scale-[0.98]" data-testid="mobile-call-button"><span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Call Now</span></a>
    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="h-14 bg-green text-ink font-bold grid place-items-center active:scale-[0.98]" data-testid="mobile-whatsapp-button"><span className="inline-flex items-center gap-2"><FaWhatsapp className="h-4 w-4" /> WhatsApp</span></a>
  </div>
);
