import { ArrowRight, Phone, ClipboardList, HardHat, MessageSquare, ShieldCheck, Eye, Target } from "lucide-react";
import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { Footer, MobileBar } from "@/components/site/FaqCtaFooter";
import { Container, Reveal } from "@/components/site/shared";
import { BentoGrid } from "@/components/spectrumui/bento-grid";
import { BentoCard } from "@/components/spectrumui/bento-card";
import { TESTIMONIALS, PHONES, WHATSAPP_URL } from "@/data/content";
import { Helmet } from "react-helmet-async";

const PHONE_HREF = `tel:${PHONES[0]}`;

// The CMD and CEO messages are reproduced exactly as the owner wrote them —
// they must NOT be condensed, shortened, or reworded. The redesign brief's
// 80-120 word suggestion does not apply here; the owner overrode it.
const CMD_MESSAGE = [
  "At Ghar Banwao, our journey is driven by a bold ambition: to transform the way India experiences home construction. We recognize that the construction industry has enormous potential, yet customers often face challenges in finding reliable professionals, ensuring transparency, managing costs, and coordinating multiple services. Our vision is to bridge these gaps by building a trusted, technology-driven platform that brings the entire home construction journey together under one roof.",
  "As CMD, I believe that sustainable growth comes from understanding customer needs, embracing innovation, and consistently delivering on our promises. We are focused on building more than a service company. We are building an ecosystem that makes construction more accessible, organized, transparent, and dependable.",
  "Our long-term ambition is to establish Ghar Banwao as one of India's leading construction services portals, empowering individuals to move from the first idea of a dream home to its successful completion with greater confidence and convenience.",
  "For us, success is not measured merely by the number of projects we complete, but by the trust we earn, the standards we establish, and the difference we make in the way people build.",
  "We are building Ghar Banwao with a vision that goes beyond individual homes to shape the future of India's construction industry.",
];

const CEO_MESSAGE = [
  "At Ghar Banwao, we believe building your dream home should be exciting, transparent, and well-managed — not complicated or stressful.",
  "Our journey in the construction industry began in 2016, and Ghar Banwao was officially launched in November 2018, with its head office in Lucknow, Uttar Pradesh. Since then, our focus has been to provide homeowners with a professional and dependable one-stop solution for complete home construction.",
  "From architectural planning, 2D floor plans and 3D designs to structural engineering, construction, finishing, interiors, site supervision, and final handover, we bring every stage of your home-building journey together under one experienced team.",
  "For you, this means no hassle of coordinating with multiple architects, engineers, contractors, vendors, and different agencies. With Ghar Banwao, you have one team, one streamlined process, and clear accountability from concept to completion.",
  "Our approach is built around what matters most to a homeowner — transparent pricing, clearly defined specifications, professional supervision, quality-focused execution, stage-wise payments, regular project updates, and dependable after-construction support.",
  "With 260+ homes successfully handed over and 51+ ongoing projects, we continue to earn the trust of homeowners looking for a more organized and reliable way to build.",
  "Whether you are building your first home or managing construction while living in another city, our goal is simple — to make your journey from plot to dream home seamless, transparent, and hassle-free.",
];

const MISSION_TEXT = [
  "To simplify the entire home-building journey by bringing architects, engineers, designers, construction professionals, skilled teams, and allied construction services together on one reliable platform.",
  "Through Ghar Banwao, we aim to provide customers with professional expertise, transparent processes, quality-focused execution, clear accountability, and end-to-end support — eliminating the complexity of coordinating with multiple service providers.",
];

const VISION_TEXT = [
  "To become a trusted and comprehensive construction service portal, providing homeowners with a seamless one-stop solution for all their home construction needs — from planning and design to construction, interiors, renovation, and project completion.",
  "Our vision is to make professional construction services more organized, transparent, accessible, and dependable, so every homeowner can build with greater confidence and peace of mind.",
];

const COMMITMENTS = [
  {
    icon: <ClipboardList className="h-5 w-5" strokeWidth={2.25} />,
    title: "Transparent process",
    description:
      "Written scope, itemised costs, and a fixed milestone schedule before work starts. Progress updates reach you at every stage — no verbal-only commitments, no surprises at handover.",
  },
  {
    icon: <HardHat className="h-5 w-5" strokeWidth={2.25} />,
    title: "Quality-focused execution",
    description:
      "Brand-verified materials matched to your agreement, checked on site against specification. Engineers and supervisors are qualified, named on your project, and accountable for workmanship.",
  },
  {
    icon: <MessageSquare className="h-5 w-5" strokeWidth={2.25} />,
    title: "Accountability at every stage",
    description:
      "One point of contact who answers your call, a documented process for raising issues, and a written resolution you can track — from the first site visit to the day you get your keys.",
  },
];

const PROJECTS = [
  {
    img: "/images/about/onsite-blueprint-consultation.webp",
    alt: "A Ghar Banwao engineer reviewing the floor plan with a couple at their construction site",
    label: "Consultation & planning",
    location: "Uttar Pradesh",
    className: "lg:col-span-2 aspect-[16/10]",
  },
  {
    img: "/images/about/warm-modern-indian-home.webp",
    alt: "A completed Ghar Banwao home at dusk, with warm interior lighting, stone cladding and landscaped front garden",
    label: "Completed home",
    location: "Uttar Pradesh",
    className: "aspect-[4/5]",
  },
  {
    img: "/images/about/modern-brick-house-under-construction.webp",
    alt: "A two-storey home under construction with brick masonry, concrete columns and stacked cement bags on site",
    label: "Under construction",
    location: "Uttar Pradesh",
    className: "aspect-[4/5]",
  },
  {
    img: "/images/about/proud-family-dream-home.webp",
    alt: "A homeowner family standing outside their completed Ghar Banwao home",
    label: "Homeowner handover",
    location: "Uttar Pradesh",
    className: "aspect-[4/5]",
  },
  {
    img: "/images/about/warm-modern-house.webp",
    alt: "A finished home facade with warm lighting and a paved driveway at dusk",
    label: "Delivered project",
    location: "Uttar Pradesh",
    className: "aspect-[4/5]",
  },
  {
    img: "/images/about/blueprints-across-india.webp",
    alt: "A family reviewing blueprints with a Ghar Banwao engineer, with a map of India showing project locations across the country",
    label: "Design & drawings",
    location: "Serving 8 UP cities",
    className: "lg:col-span-2 aspect-[16/10]",
  },
];

const PROOF = [
  { value: "260+", label: "Homes handed over", note: "Since 2017" },
  { value: "180+", label: "Google reviews", note: "From homeowners" },
  { value: "8", label: "Cities served", note: "Across Uttar Pradesh" },
  { value: "25 yr", label: "Structural warranty", note: "On delivered homes" },
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
      <article className="card-gb flex h-full flex-col bg-paper p-7 md:p-9" data-testid={`about-${label.toLowerCase().replace(/[^a-z]/g, "")}`}>
        <span className="mono-label text-green">{label}</span>
        <h3 className="display mt-3 text-2xl md:text-[28px]">{title}</h3>
        <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-ink/80">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-auto pt-7 flex items-center gap-4 border-t border-divider">
          <img
            src={portrait}
            alt={alt}
            width={88}
            height={88}
            loading="lazy"
            decoding="async"
            className="h-[88px] w-[88px] shrink-0 rounded-full object-cover object-top border border-divider"
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
        {/* 1. Hero */}
        <section className="section-gb" data-testid="about-hero">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-center">
              <div className="lg:col-span-7">
                <Reveal>
                  <span className="mono-label text-green">ABOUT GHAR BANWAO</span>
                  <h1 className="display mt-4 text-[38px] sm:text-5xl lg:text-[58px] xl:text-[64px]">
                    A better way to build your home in Lucknow.
                  </h1>
                  <p className="mt-6 text-base md:text-lg text-ink/70 max-w-[58ch] leading-relaxed">
                    From planning to construction, we help homeowners move forward with clearer processes,
                    quality-focused execution, and accountability at every step.
                  </p>
                  <div className="mt-9 flex flex-wrap items-center gap-3">
                    <CtaLink href="/contact">
                      Book a Free Consultation <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                    </CtaLink>
                    <CtaLink href="/#projects" variant="ghost">
                      Explore Our Projects
                    </CtaLink>
                  </div>
                  <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] font-medium text-ink/70">
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-green" strokeWidth={2.5} /> 25-year structural warranty
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Free site visit + written quote in 48 hours</span>
                  </p>
                </Reveal>
              </div>
              <div className="lg:col-span-5 relative">
                <Reveal delay={0.08}>
                  <div className="relative">
                    <div className="absolute -bottom-4 -right-4 h-full w-full rounded-2xl bg-wash-green" aria-hidden="true" />
                    <figure className="group relative overflow-hidden rounded-2xl border border-divider bg-divider">
                      <img
                        src="/images/about/warm-modern-house.webp"
                        alt="A completed Ghar Banwao home at dusk, with warm interior lighting and landscaped front garden"
                        width={1000}
                        height={1250}
                        loading="eager"
                        decoding="async"
                        className="w-full aspect-[4/5] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        data-testid="about-hero-image"
                      />
                    </figure>
                  </div>
                </Reveal>
              </div>
            </div>
          </Container>
        </section>

        {/* 2. Proof strip */}
        <section className="bg-wash-green section-gb" data-testid="about-proof">
          <Container>
            <Reveal>
              <span className="mono-label text-green">WHY HOMEOWNERS TRUST US</span>
            </Reveal>
            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-8">
              {PROOF.map((p, i) => (
                <Reveal key={p.label} delay={i * 0.05}>
                  <div className="border-t border-ink/10 pt-5">
                    <dt className="sr-only">{p.label}</dt>
                    <dd>
                      <span className="display block text-4xl md:text-5xl lg:text-[56px] leading-none">{p.value}</span>
                      <span className="mt-3 block text-[15px] font-bold">{p.label}</span>
                      <span className="mt-1 block text-[13px] text-ink/60">{p.note}</span>
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </Container>
        </section>

        {/* 3. What homeowners can expect */}
        <section className="section-gb" data-testid="about-commitments">
          <Container>
            <Reveal>
              <span className="mono-label text-green">WHAT HOMEOWNERS CAN EXPECT</span>
              <h2 className="display mt-4 text-3xl sm:text-4xl lg:text-[44px] max-w-[24ch]">
                Three commitments we hold on every site.
              </h2>
              <p className="mt-5 text-base md:text-lg text-ink/70 max-w-[62ch] leading-relaxed">
                Building a home is one of the largest investments a family makes. Here is exactly how we
                take that responsibility.
              </p>
            </Reveal>
            <BentoGrid className="mt-12 lg:max-w-none">
              {COMMITMENTS.map((c, i) => (
                <BentoCard
                  key={c.title}
                  colSpan={i === 0 ? 2 : 1}
                  className="bg-paper border-divider hover:border-green/40 [&_h3]:text-ink [&_h3]:text-lg [&_h3]:font-bold [&_h3]:font-sans [&_h3]:tracking-tight [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-ink/70 [&_p]:mt-1.5"
                  title={c.title}
                  description={c.description}
                  icon={
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-wash-green text-green">
                      {c.icon}
                    </span>
                  }
                />
              ))}
            </BentoGrid>
          </Container>
        </section>

        {/* 4. Real projects */}
        <section className="section-gb bg-paper" data-testid="about-projects">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Reveal>
                <span className="mono-label text-green">REAL PROJECTS</span>
                <h2 className="display mt-4 text-3xl sm:text-4xl lg:text-[44px] max-w-[22ch]">
                  See the homes we have delivered.
                </h2>
              </Reveal>
              <Reveal delay={0.05}>
                <CtaLink href="/#projects" variant="outline" className="h-12 px-6 text-[16px]">
                  View All Projects <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </CtaLink>
              </Reveal>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {PROJECTS.map((p, i) => (
                <Reveal key={p.img} delay={i * 0.05} className={p.className}>
                  <figure className="group relative h-full overflow-hidden rounded-2xl border border-divider bg-divider">
                    <img
                      src={p.img}
                      alt={p.alt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-5 pt-12">
                      <span className="block text-[15px] font-bold text-white">{p.label}</span>
                      <span className="mt-0.5 block text-[13px] text-white/80">{p.location}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* 5. The people behind the work */}
        <section className="section-gb" data-testid="about-leadership">
          <Container>
            <Reveal>
              <span className="mono-label text-green">THE PEOPLE BEHIND THE WORK</span>
              <h2 className="display mt-4 text-3xl sm:text-4xl lg:text-[44px] max-w-[26ch]">
                Led by people who build for the long term.
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
                title="Customers at the centre of every decision."
                name="Sujata"
                role="Chief Executive Officer (CEO), Interior Designer"
                portrait="/images/team/sujata.jpg"
                alt="Sujata, Chief Executive Officer and Interior Designer, Ghar Banwao"
                paragraphs={CEO_MESSAGE}
              />
            </div>

            {/* Mission & Vision */}
            <Reveal className="mt-12">
              <span className="mono-label text-green">WHAT DRIVES US</span>
              <h2 className="display mt-4 text-3xl sm:text-4xl lg:text-[44px] max-w-[22ch]">
                Mission &amp; Vision.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-6 lg:grid-cols-2" data-testid="about-mission-vision">
              {[
                {
                  key: "mission",
                  Icon: Target,
                  label: "OUR MISSION",
                  title: "One reliable platform for the whole build.",
                  paras: MISSION_TEXT,
                },
                {
                  key: "vision",
                  Icon: Eye,
                  label: "OUR VISION",
                  title: "A trusted one-stop construction portal.",
                  paras: VISION_TEXT,
                },
              ].map(({ key, Icon, label, title, paras }, i) => (
                <Reveal key={key} delay={i * 0.08} className="h-full">
                  <article
                    className="relative h-full overflow-hidden rounded-2xl bg-ink p-8 md:p-10 text-paper"
                    data-testid={`about-${key}-card`}
                  >
                    <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-green/25 blur-3xl" aria-hidden="true" />
                    <div className="relative flex items-center gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-green text-ink">
                        <Icon className="h-6 w-6" strokeWidth={2.25} />
                      </span>
                      <span className="mono-label text-green">{label}</span>
                    </div>
                    <h3 className="display relative mt-5 text-[24px] md:text-[30px] leading-tight">{title}</h3>
                    <div className="relative mt-4 space-y-4 text-[15px] leading-relaxed text-paper/75">
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

        {/* 6. Customer proof + final CTA */}
        <section className="section-gb bg-wash-green" data-testid="about-testimonials">
          <Container>
            <Reveal>
              <span className="mono-label text-green">CUSTOMER PROOF</span>
              <h2 className="display mt-4 text-3xl sm:text-4xl lg:text-[44px] max-w-[24ch]">
                In their own words.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
              {FEATURED_TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.05} className="h-full">
                  <figure className="card-gb flex h-full flex-col bg-paper p-7" data-testid="about-testimonial-card">
                    <span className="text-green tracking-tight text-lg leading-none" aria-label="5 star rating">
                      ★★★★★
                    </span>
                    <blockquote className="mt-4 text-[15px] leading-relaxed text-ink/80">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-auto pt-6 border-t border-divider">
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
