import { ArrowRight, Phone, Eye, Target } from "lucide-react";
import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { Footer, MobileBar } from "@/components/site/FaqCtaFooter";
import { Container, Reveal } from "@/components/site/shared";
import { BorderBeam } from "@/components/spectrumui/border-beam";
import { PHONES, WHATSAPP_URL } from "@/data/content";
import { Helmet } from "react-helmet-async";

const PHONE_HREF = `tel:${PHONES[0]}`;

// The CMD message is reproduced exactly as the owner wrote it — do not
// condense or reword it. The CEO message was trimmed at the owner's request
// (2026-10-28): shorter heading, no emdashes, ~30 words cut.
const CMD_MESSAGE = [
  "At Ghar Banwao, our journey is driven by a bold ambition: to transform the way India experiences home construction. We recognize that the construction industry has enormous potential, yet customers often face challenges in finding reliable professionals, ensuring transparency, managing costs, and coordinating multiple services. Our vision is to bridge these gaps by building a trusted, technology-driven platform that brings the entire home construction journey together under one roof.",
  "As CMD, I believe that sustainable growth comes from understanding customer needs, embracing innovation, and consistently delivering on our promises. We are focused on building more than a service company. We are building an ecosystem that makes construction more accessible, organized, transparent, and dependable.",
  "Our long-term ambition is to establish Ghar Banwao as one of India's leading construction services portals, empowering individuals to move from the first idea of a dream home to its successful completion with greater confidence and convenience.",
  "For us, success is not measured merely by the number of projects we complete, but by the trust we earn, the standards we establish, and the difference we make in the way people build.",
  "We are building Ghar Banwao with a vision that goes beyond individual homes to shape the future of India's construction industry.",
];

const CEO_MESSAGE = [
  "At Ghar Banwao, building your dream home should be exciting, transparent, and well-managed, never complicated or stressful.",
  "Our journey in construction began in 2016. Ghar Banwao launched in November 2018, headquartered in Lucknow. Since then, we have focused on giving homeowners a professional, dependable one-stop solution for complete home construction.",
  "From architectural planning, 2D floor plans and 3D designs to structural engineering, construction, finishing, interiors, site supervision, and handover, we bring every stage of your home-building journey together under one team.",
  "This means no hassle of coordinating with multiple architects, engineers, contractors, or vendors. With Ghar Banwao, you get one team, one streamlined process, and clear accountability from concept to completion.",
  "Our approach centers on what matters most to a homeowner: transparent pricing, clear specifications, professional supervision, quality execution, stage-wise payments, regular updates, and dependable after-construction support.",
  "With 260+ homes handed over and 51+ ongoing projects, we keep earning the trust of homeowners seeking an organized way to build.",
  "Whether you are building your first home or managing construction from another city, our goal is simple: to make your journey from plot to dream home seamless, transparent, and hassle-free.",
];

const ONE_STOP_PARAS = [
  "At Ghar Banwao, we believe building your dream home should be exciting, transparent, and well-managed — not complicated or stressful.",
  "Our journey in the construction industry began in 2016, and Ghar Banwao was officially launched in November 2018, with its Head Office in Lucknow, Uttar Pradesh. Since then, our focus has been to provide homeowners with a professional and dependable one-stop solution for complete home construction.",
  "From architectural planning, 2D floor plans and 3D designs to structural engineering, construction, finishing, interiors, site supervision, and final handover, we bring every stage of your home-building journey together under one experienced team.",
  "For you, this means no hassle of coordinating with multiple architects, engineers, contractors, vendors, and different agencies. With Ghar Banwao, you have one team, one streamlined process, and clear accountability from concept to completion.",
  "Our approach is built around what matters most to a homeowner — transparent pricing, clearly defined specifications, professional supervision, quality-focused execution, stage-wise payments, regular project updates, and dependable after-construction support.",
  "With 260+ homes successfully handed over and 51+ ongoing projects, we continue to earn the trust of homeowners looking for a more organized and reliable way to build.",
  "Whether you are building your first home or managing construction while living in another city, our goal is simple — to make your journey from plot to dream home seamless, transparent, and hassle-free.",
];

const VISION_BLOCK = [
  "To become a trusted and comprehensive construction service portal, providing homeowners with a seamless one-stop solution for all their home construction needs — from planning and design to construction, interiors, renovation, and project completion.",
  "Our vision is to make professional construction services more organized, transparent, accessible, and dependable, so every homeowner can build with greater confidence and peace of mind.",
];

const MISSION_BLOCK = [
  "Our mission is to simplify the entire home-building journey by bringing architects, engineers, designers, construction professionals, skilled teams, and allied construction services together on one reliable platform.",
  "Through Ghar Banwao, we aim to provide customers with professional expertise, transparent processes, quality-focused execution, clear accountability, and end-to-end support — eliminating the complexity of coordinating with multiple service providers.",
];

const FEATURED_TESTIMONIALS = [
  {
    quote: "Excellent construction company! They built my dream home with outstanding quality and professionalism. The work was completed on time, and the entire team was very supportive and skilled. Highly recommended!",
    name: "Bhaskar Mishra",
    locality: "Lucknow",
    year: "2025",
    projectId: "GB-217",
  },
  {
    quote: "Ghar Banwao made my dream home. Thank you so much for making such a beautiful home for us.",
    name: "Vishal Sharma",
    locality: "Lucknow",
    year: "2025",
    projectId: "",
  },
  {
    quote: "Truly amazing company. Excellent coordination and quality work. I will highly recommend Ghar Banwao for house construction and designing.",
    name: "Krishna Kumari",
    locality: "Lucknow",
    year: "2025",
    projectId: "",
  },
];

function CtaLink({ href, children, variant = "green", external = false, ...rest }) {
  const cls = variant === "green" ? "pill-green" : variant === "ghost" ? "pill-ghost" : "pill-outline-green";
  const attrs = external ? { target: "_blank", rel: "noopener,noreferrer" } : {};
  return (
    <a href={href} className={`${cls} h-12 px-6 text-[16px]`} {...attrs} {...rest}>
      {children}
    </a>
  );
}

function LeaderBlock({ label, title, name, role, portrait, alt, paragraphs }) {
  return (
    <Reveal className="h-full">
      <article className="group relative card-gb flex h-full flex-col overflow-hidden bg-paper p-7 md:p-9 transition-all duration-300 hover:-translate-y-0.5 hover:border-green/40" data-testid={`about-${label.toLowerCase().replace(/[^a-z]/g, "")}`}>
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green via-green/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-wash-green text-green">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M7 6h10v2H7zm0 4h10v2H7zm0 4h7v2H7z" />
              </svg>
            </span>
            <span className="mono-label text-green">{label}</span>
          </div>
          <h3 className="display mt-4 text-2xl md:text-[28px]">{title}</h3>
          <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-ink/80">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <div className="mt-auto pt-7 flex items-center gap-4 border-t border-divider">
          <img
            src={portrait}
            alt={alt}
            width={88}
            height={88}
            loading="lazy"
            decoding="async"
            className="h-[88px] w-[88px] shrink-0 rounded-full object-cover object-top border-2 border-green/30 shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
          />
          <div>
            <p className="font-bold text-[15px]">{name}</p>
            <p className="text-[13px] text-ink/60">{role}</p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Helmet>
        <title>About Ghar Banwao — A trusted construction partner for homeowners in Lucknow</title>
        <meta name="description" content="Ghar Banwao is a construction company in Lucknow, Uttar Pradesh. Since 2017 we have delivered 260+ homes across 8 UP cities with transparent pricing, verified professionals, and a 25-year structural warranty. Book a free consultation." />
        <meta name="keywords" content="construction company Lucknow, home construction Lucknow, builders in Lucknow, civil engineers Lucknow, architects Lucknow, residential construction Lucknow, construction company Uttar Pradesh, Ghar Banwao, house construction Lucknow" />
        <link rel="canonical" href="https://gharbanwao.com/about" />
        <meta property="og:title" content="About Ghar Banwao — A trusted construction partner for homeowners in Lucknow" />
        <meta property="og:description" content="260+ homes delivered across Uttar Pradesh since 2017. Transparent pricing, verified professionals, and a 25-year structural warranty. Talk to our team about your plans." />
        <meta property="og:url" content="https://gharbanwao.com/about" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="About Ghar Banwao — A trusted construction partner for homeowners in Lucknow" />
        <meta name="twitter:description" content="260+ homes delivered across Uttar Pradesh since 2017. Transparent pricing and a 25-year structural warranty." />
      </Helmet>
      <AnnouncementStrip />
      <Navbar />
      <main>
        {/* 1. One-stop solution */}
        <section className="section-gb relative overflow-hidden" data-testid="about-one-stop">
          {/* Full-bleed collage with a white blurred wash so the text reads on top */}
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src="/images/about/one-stop-collage.webp"
              alt=""
              width={1200}
              height={800}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/10 to-white/70" />
          </div>
          <Container className="relative z-10">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-green" aria-hidden="true" />
                <span className="mono-label text-green">GHAR BANWAO</span>
              </div>
              <h1 className="display mt-5 text-[38px] sm:text-5xl lg:text-[58px] xl:text-[64px] max-w-[20ch] leading-[1.05]">
                Your One-Stop Solution for <span className="text-green">Home Construction.</span>
              </h1>
            </Reveal>
            <div className="mt-8 space-y-5 text-base md:text-[17px] leading-relaxed text-ink/80 max-w-[76ch]">
              {ONE_STOP_PARAS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-14 grid gap-6 lg:grid-cols-2" data-testid="about-vision-mission-block">
              {[
                { key: "vision", Icon: Eye, label: "OUR VISION", paras: VISION_BLOCK },
                { key: "mission", Icon: Target, label: "OUR MISSION", paras: MISSION_BLOCK },
              ].map(({ key, Icon, label, paras }, i) => (
                <Reveal key={key} delay={i * 0.08} className="h-full">
                  <article
                    className="relative h-full overflow-hidden rounded-2xl bg-wash-yellow p-8 md:p-10 text-ink border border-green/30"
                    data-testid={`about-${key}-block`}
                  >
                    <BorderBeam
                      className="rounded-2xl"
                      duration={7}
                      borderWidth={1.25}
                      colorFrom="rgba(147, 197, 38, 0)"
                      colorTo="rgba(147, 197, 38, 0.5)"
                    />
                    <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-green/20 blur-3xl" aria-hidden="true" />
                    <div className="relative flex items-center gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-green text-ink shadow-[0_8px_24px_rgba(147,197,38,0.35)]">
                        <Icon className="h-6 w-6" strokeWidth={2.25} />
                      </span>
                      <span className="mono-label text-green-700">{label}</span>
                    </div>
                    <div className="relative mt-5 space-y-4 text-[15px] leading-relaxed text-ink/80">
                      {paras.map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* 2. The people behind the work */}
        <section className="section-gb" data-testid="about-leadership">
          <Container>
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-green" aria-hidden="true" />
                <span className="mono-label text-green">THE PEOPLE BEHIND THE WORK</span>
              </div>
              <h2 className="display mt-5 text-3xl sm:text-4xl lg:text-[44px] max-w-[26ch]">
                Led by people who build for the <span className="text-green">long term.</span>
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <LeaderBlock
                label="CMD'S MESSAGE"
                title="Building for the long term."
                name="Er. Virendra Kumar Nishad"
                role="Chairman and Managing Director"
                portrait="/images/team/virendra-nishad.jpg"
                alt="Er. Virendra Kumar Nishad, Chairman and Managing Director, Ghar Banwao"
                paragraphs={CMD_MESSAGE}
              />
              <LeaderBlock
                label="MESSAGE FROM THE CEO"
                title="Customers at the centre."
                name="Sujata"
                role="Chief Executive Officer (CEO), Interior Designer"
                portrait="/images/team/sujata.jpg"
                alt="Sujata, Chief Executive Officer and Interior Designer, Ghar Banwao"
                paragraphs={CEO_MESSAGE}
              />
            </div>
          </Container>
        </section>

        {/* 6. Customer proof + final CTA */}
        <section className="section-gb bg-wash-green" data-testid="about-testimonials">
          <Container>
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-green" aria-hidden="true" />
                <span className="mono-label text-green">CUSTOMER PROOF</span>
              </div>
              <h2 className="display mt-5 text-3xl sm:text-4xl lg:text-[44px] max-w-[24ch]">
                In their <span className="text-green">own words.</span>
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
              {FEATURED_TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.05} className="h-full">
                  <figure className="group relative card-gb flex h-full flex-col overflow-hidden bg-paper p-7 transition-all duration-300 hover:-translate-y-1 hover:border-green/40" data-testid="about-testimonial-card">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green via-green/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                    <div className="relative">
                      <span className="text-green tracking-tight text-lg leading-none" aria-label="5 star rating">
                        ★★★★★
                      </span>
                      <blockquote className="mt-4 text-[15px] leading-relaxed text-ink/80">
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>
                    </div>
                    <figcaption className="relative mt-auto pt-6 border-t border-divider">
                      <p className="font-bold text-[15px] leading-tight">{t.name}</p>
                      <p className="mt-1 text-[13px] text-ink/60">
                        {t.locality} · {t.year}
                        {t.projectId ? ` · ${t.projectId}` : ""}
                      </p>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* Final CTA */}
        <section className="section-gb" data-testid="about-final-cta">
          <Container>
            <Reveal>
              <div className="relative overflow-hidden rounded-[28px] bg-green px-7 py-14 md:px-16 md:py-20 text-center text-ink">
                <div
                  className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-ink/10 blur-3xl"
                  aria-hidden="true"
                />
                <div
                  className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-ink/10 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative">
                  <h2 className="display text-ink text-3xl sm:text-4xl lg:text-[46px]">
                    Planning to build your home?
                  </h2>
                  <p className="mx-auto mt-5 max-w-[52ch] text-base md:text-lg text-ink/75 leading-relaxed">
                    Talk to our team about your plans, budget, and next steps. No consultation fee —
                    a free site visit and a written quote within 48 hours.
                  </p>
                  <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                    <CtaLink href="/contact" className="pill h-12 px-6 text-[16px] text-ink border border-ink hover:bg-ink hover:text-green">
                      Book a Free Consultation <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                    </CtaLink>
                    <a
                      href={PHONE_HREF}
                      className="pill h-12 px-6 text-[16px] border border-ink/30 text-ink hover:bg-ink hover:text-green"
                      data-testid="about-call-cta"
                    >
                      <Phone className="h-4 w-4" strokeWidth={2.5} /> {PHONES[0]}
                    </a>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener,noreferrer"
                      className="pill h-12 px-6 text-[16px] border border-ink/30 text-ink hover:bg-ink hover:text-green"
                      data-testid="about-whatsapp-cta"
                    >
                      WhatsApp us
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
