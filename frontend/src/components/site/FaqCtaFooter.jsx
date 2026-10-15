import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, Star, MessageCircle } from "lucide-react";
import { FaFacebook, FaInstagram, FaPinterest, FaThreads, FaWhatsapp, FaYoutube } from "react-icons/fa6";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Container, Reveal, SectionHeader } from "./shared";
import { Logo } from "./Logo";
import { CITIES, FOOTER_NAV, PHONES, WHATSAPP_URL, HOME_FAQS } from "@/data/content";
import { createLead } from "@/lib/api";
import { scrollToId } from "@/lib/scroll";

const PAGE_ROUTES = ["about", "reviews", "contact", "privacy", "terms", "faq"];

// Footer entries either point at a real page (`href`) or scroll to a
// section on the homepage (`id`).
const FooterLink = ({ item }) => {
  if (item.href) {
    return <Link to={item.href} className="hover:underline decoration-green decoration-2 underline-offset-4" data-testid={`footer-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>{item.label}</Link>;
  }
  return <button onClick={() => footerGo(item.id)} className="hover:underline decoration-green decoration-2 underline-offset-4" data-testid={`footer-link-${item.id}`}>{item.label}</button>;
};

const footerGo = (id) => {
  if (id === "home") {
    if (window.location.pathname !== "/") { window.location.href = "/"; }
    else { window.scrollTo({ top: 0, behavior: "smooth" }); }
    return;
  }
  if (PAGE_ROUTES.includes(id)) {
    if (window.location.pathname !== `/${id}`) { window.location.href = `/${id}`; }
    return;
  }
  if (window.location.pathname !== "/") {
    window.location.href = `/#${id}`;
    return;
  }
  scrollToId(id);
};

export const FAQ = () => (
  <section id="faq" className="section-gb" data-testid="faq-section">
    <Container className="grid lg:grid-cols-5 gap-10">
      <div className="lg:col-span-2">
        <SectionHeader label="TOP 5 QUESTIONS" title="Things homeowners actually ask us" supporting={`If the answer is "it depends," we say "it depends" and explain the variables.`} />
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
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="pill-yellow h-12 px-6 text-[15px] border border-ink/10" data-testid="cta-whatsapp-link"><MessageCircle className="h-4 w-4" /> WhatsApp us</a>
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

export const Footer = () => (
  <footer className="bg-paper border-t border-divider pb-24 md:pb-0" data-testid="footer">
    <Container className="py-14 grid md:grid-cols-4 gap-10">
      <div className="md:col-span-1">
        <Logo size="h-20" />
        <p className="mt-4 text-[15px] text-ink/70">Lucknow's #1 construction company — 260+ homes delivered across Uttar Pradesh since 2017.</p>
        <address className="mt-5 not-italic text-[14px] text-ink/70 space-y-1">
          <p>16/284, near Munshipulia, next to Ashirwad Bakery, Indira Nagar, Lucknow, Uttar Pradesh 226016</p>
          <p><a href={`tel:${PHONES[0]}`} className="hover:text-ink">{PHONES[0]}</a> · <a href={`tel:${PHONES[1]}`} className="hover:text-ink">{PHONES[1]}</a></p>
          <p><a href={WHATSAPP_URL} className="hover:text-ink">WhatsApp</a> · <a href="mailto:hello@gharbanwao.com" className="hover:text-ink">hello@gharbanwao.com</a></p>
        </address>
      </div>
      <div>
        <p className="mono-label text-ink/50 mb-4">Explore</p>
        <ul className="space-y-2 text-[15px] font-semibold">
          {FOOTER_NAV.slice(0, 5).map((n) => (
            <li key={n.label}><FooterLink item={n} /></li>
          ))}
          <li><Link to="/register" className="hover:underline decoration-green decoration-2 underline-offset-4" data-testid="footer-link-register">Register with us</Link></li>
        </ul>
      </div>
      <div>
        <p className="mono-label text-ink/50 mb-4">Explore</p>
        <ul className="space-y-2 text-[15px] font-semibold">
          {FOOTER_NAV.slice(5).map((n) => (
            <li key={n.label}><FooterLink item={n} /></li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mono-label text-ink/50 mb-4">Trust</p>
        <ul className="space-y-2 text-[15px] text-ink/70">
          <li><a href="https://www.google.com/maps" target="_blank" rel="noreferrer" className="hover:text-ink">Google reviews ↗</a></li>
          <li><a href="/warranty.pdf" onClick={(e) => e.preventDefault()} className="hover:text-ink">Warranty PDF</a></li>
          <li><Link to="/privacy" className="hover:underline decoration-green decoration-2 underline-offset-4" data-testid="footer-link-privacy">Privacy</Link> · <Link to="/terms" className="hover:underline decoration-green decoration-2 underline-offset-4" data-testid="footer-link-terms">Terms</Link></li>
        </ul>
      </div>
    </Container>
    <div className="border-t border-divider">
      <Container className="py-5 flex flex-col md:flex-row gap-3 md:items-center justify-between font-mono text-[12px] text-ink/60">
        <p>© 2026 GharBanwao.com®. Lucknow, Kanpur & 6 more UP cities</p>
        <div className="flex gap-3">
          {[
            [FaFacebook, "Facebook", "https://www.facebook.com/gharbanwao/", "#1877F2"],
            [FaInstagram, "Instagram", "https://www.instagram.com/gharbanwao/", "linear-gradient(45deg, #FEDA75, #FA7E1E, #D62976, #962FBF, #4F5BD5)"],
            [FaThreads, "Threads", "https://www.threads.com/@gharbanwao", "#000000"],
            [FaYoutube, "YouTube", "https://www.youtube.com/@gharbanwao", "#FF0000"],
            [FaPinterest, "Pinterest", "https://in.pinterest.com/gharbanwao/", "#E60023"],
          ].map(([Icon, s, href, bg]) => (
            <a
              key={s}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={s}
              style={{ background: bg }}
              className="h-9 w-9 grid place-items-center rounded-full text-white hover:scale-110 hover:shadow-md transition-transform"
              data-testid={`footer-social-${s.toLowerCase()}`}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </Container>
    </div>
  </footer>
);

export const MobileBar = () => (
  <div className="fixed bottom-0 inset-x-0 z-50 grid grid-cols-2 md:hidden no-print" data-testid="mobile-sticky-bar">
    <a href={`tel:${PHONES[0]}`} className="h-14 bg-yellow text-ink font-bold grid place-items-center active:scale-[0.98]" data-testid="mobile-call-button"><span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Call Now</span></a>
    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="h-14 bg-green text-ink font-bold grid place-items-center active:scale-[0.98]" data-testid="mobile-whatsapp-button"><span className="inline-flex items-center gap-2"><FaWhatsapp className="h-4 w-4" /> WhatsApp</span></a>
  </div>
);
