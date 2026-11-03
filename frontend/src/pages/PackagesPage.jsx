import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { Footer, MobileBar, FinalCTA } from "@/components/site/FaqCtaFooter";
import { Container, Reveal, SectionHeader } from "@/components/site/shared";
import { Comparison } from "@/components/site/PricingTeam";
import { ArrowRight } from "lucide-react";
import {
  PRICING, PRICING_ROWS,
  PHONES,
} from "@/data/content";
import { scrollToId } from "@/lib/scroll";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function PackagesPage() {

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Helmet>
        <title>Construction Packages in Lucknow — Silver, Gold & Platinum | Ghar Banwao</title>
        <meta name="description" content="Turnkey construction packages in Lucknow from ₹1,299/sqft. See the universal stage-linked payment schedule, what is included, and how our construction materials compare to a local contractor. 25-year structural warranty on all three packages." />
        <meta name="keywords" content="construction packages Lucknow, turnkey construction Lucknow, construction cost per sq ft Lucknow, house construction package Lucknow, construction payment schedule Lucknow, Ghar Banwao packages" />
        <link rel="canonical" href="https://gharbanwao.com/packages" />
        <meta property="og:title" content="Construction Packages in Lucknow — Ghar Banwao" />
        <meta property="og:description" content="Silver, Gold and Platinum turnkey packages from ₹1,299/sqft, with the full payment schedule published up front." />
        <meta property="og:url" content="https://gharbanwao.com/packages" />
        <meta property="og:type" content="website" />
      </Helmet>
      <AnnouncementStrip />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="section-gb" data-testid="packages-hero">
          <Container className="max-w-4xl">
            <Reveal>
              <SectionHeader
                label="CONSTRUCTION PACKAGES"
                title="Pick a package. Every number is public."
                supporting="Same 25-year structural warranty on all three. The difference is material grade, finishing level and how long we support you after handover. The payment schedule below is the same on every package."
                align="center"
              />
            </Reveal>
          </Container>
        </section>

        {/* The three packages */}
        <section className="section-gb pt-0" data-testid="packages-cards">
          <Container>
            <div className="grid lg:grid-cols-3 gap-5">
              {PRICING.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.07} className={`card-gb p-6 md:p-8 flex flex-col ${p.featured ? "border-green lg:-translate-y-2 bg-paper relative" : "bg-paper"}`} data-testid={`packages-card-${p.name.toLowerCase()}`}>
                  {p.featured && <span className="absolute -top-3 left-8 font-mono text-[10px] uppercase tracking-[0.1em] bg-green px-2.5 py-1 rounded-full">Most homeowners pick this</span>}
                  <p className="mono-label text-ink/60">{p.name}</p>
                  <p className="mt-3 display text-4xl md:text-5xl">{p.price}<span className="text-lg font-bold text-ink/50"> / sqft</span></p>
                  <p className="mt-2 text-[14px] text-ink/60">Starts at. Best for {p.best.toLowerCase()}.</p>
                  <dl className="mt-6 divide-y divide-divider border-y border-divider">
                    {PRICING_ROWS.map((label, j) => (
                      <div key={label} className="py-3 flex justify-between gap-4 text-[14px]">
                        <dt className="text-ink/60">{label}</dt>
                        <dd className="font-semibold text-right">{p.rows[j]}</dd>
                      </div>
                    ))}
                  </dl>
                  <button onClick={() => scrollToId("contact")} className={`${p.featured ? "pill-green" : "pill-outline-green"} mt-8 h-12 px-6 text-[15px]`} data-testid={`packages-cta-${p.name.toLowerCase()}`}>{p.cta} <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} /></button>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-8">
              <p className="text-[14px] text-ink/60 max-w-3xl">
                Rates cover construction only. Plot cost, LDA or Nagar Nigam approval fees, electricity and water connection charges, boundary wall beyond 4 ft and interiors beyond the package are separate. Every exclusion is listed on page 2 of the written quote before you sign.
              </p>
            </Reveal>
          </Container>
        </section>

        {/* Payment schedule lives in the calculator — single source of truth */}
        <section className="section-gb bg-wash-green" data-testid="packages-payment">
          <Container>
            <Reveal className="card-gb p-6 md:p-8 bg-paper flex flex-col md:flex-row md:items-center gap-5 justify-between">
              <div>
                <p className="mono-label text-ink/50 mb-2">PAYMENT SCHEDULE · ALL 3 PACKAGES</p>
                <p className="text-[17px] font-bold leading-snug max-w-xl">
                  One schedule, identical on Silver, Gold and Platinum — released only against work you've signed off on site.
                </p>
                <p className="mt-2 text-[14px] text-ink/60 max-w-xl">
                  Open the calculator to see the full 9-stage schedule with live rupee amounts for your plot.
                </p>
              </div>
              <Link to="/calculator" className="pill-green h-12 px-6 text-[15px] shrink-0">
                See the payment schedule <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
              </Link>
            </Reveal>
          </Container>
        </section>

        {/* Why us, not a local contractor */}
        <section className="section-gb" data-testid="packages-why">
          <Comparison />
          <Container>
            <Reveal delay={0.1} className="mt-8">
              <p className="text-[14px] text-ink/60 max-w-3xl">
                Questions about anything on this page? Call {PHONES[0]}.
              </p>
            </Reveal>
          </Container>
        </section>

        {/* Cross links */}
        <section className="section-gb bg-wash-yellow" data-testid="packages-crosslinks">
          <Container className="max-w-4xl">
            <Reveal className="grid sm:grid-cols-3 gap-4">
              <Link to="/calculator" className="card-gb p-5 bg-paper hover:border-green transition-colors">
                <p className="font-bold">Estimate your cost</p>
                <p className="text-[13px] text-ink/60 mt-1">City, plot area and package in under a minute.</p>
              </Link>
              <Link to="/faq" className="card-gb p-5 bg-paper hover:border-green transition-colors">
                <p className="font-bold">Read all 15 FAQs</p>
                <p className="text-[13px] text-ink/60 mt-1">Timeline, warranty, LDA approval, hidden charges.</p>
              </Link>
              <Link to="/about" className="card-gb p-5 bg-paper hover:border-green transition-colors">
                <p className="font-bold">Why we exist</p>
                <p className="text-[13px] text-ink/60 mt-1">264+ homes, 8 UP cities, same office since 2017.</p>
              </Link>
            </Reveal>
          </Container>
        </section>
      </main>
      <FinalCTA />
      <Footer />
      <MobileBar />
    </div>
  );
}
