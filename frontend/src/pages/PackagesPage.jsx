import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { Footer, MobileBar, FinalCTA } from "@/components/site/FaqCtaFooter";
import { Container, Reveal, SectionHeader } from "@/components/site/shared";
import { Check, X, ArrowRight, ShieldCheck } from "lucide-react";
import {
  PRICING, PRICING_ROWS, PAYMENT_SCHEDULE, PAYMENT_RULES, PAYMENT_EXAMPLE,
  WHY_GB, WHY_OTHER, PHONES,
} from "@/data/content";
import { scrollToId } from "@/lib/scroll";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const inr = (n) => "₹" + n.toLocaleString("en-IN");

export default function PackagesPage() {
  const { area, rate, total } = PAYMENT_EXAMPLE;

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
                supporting="Same 25-year structural warranty on all three. The difference is material grade, finishing level and how long we support you after handover. The payment schedule below is identical for every package."
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
                  <button onClick={() => scrollToId("contact")} className={`btn-animated mt-8 ${p.featured ? "" : "btn-animated--yellow"}`} data-testid={`packages-cta-${p.name.toLowerCase()}`}>{p.cta} <ArrowRight className="arr-icon h-[18px] w-[18px]" strokeWidth={2.5} /></button>
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

        {/* Universal payment schedule */}
        <section className="section-gb bg-wash-green" data-testid="packages-payment">
          <Container>
            <SectionHeader
              label="PAYMENT SCHEDULE · ALL 3 PACKAGES"
              title="One payment schedule, identical on Silver, Gold and Platinum."
              supporting="Money is released against work finished on site, never against a calendar date. You inspect the stage, sign it off, then pay."
            />
            <Reveal className="mt-12 card-gb overflow-hidden">
              <table className="w-full text-[15px]">
                <thead className="bg-wash-yellow">
                  <tr className="text-left">
                    <th className="p-4 md:p-5 font-semibold w-[44%]">Stage</th>
                    <th className="p-4 md:p-5 font-extrabold text-[17px]">Percentage</th>
                    <th className="p-4 md:p-5 font-extrabold text-[17px] hidden md:table-cell">On a {inr(total)} build</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider">
                  {PAYMENT_SCHEDULE.map((row) => {
                    const pct = typeof row.pct === "number" ? row.pct : null;
                    const amount = pct !== null ? Math.round((total * pct) / 100) : null;
                    const remaining = amount === null ? total - PAYMENT_SCHEDULE.reduce((sum, r) => sum + (typeof r.pct === "number" ? Math.round((total * r.pct) / 100) : 0), 0) : null;
                    return (
                      <tr key={row.stage} className="align-top">
                        <td className="p-4 md:p-5">
                          <span className="font-semibold">{row.stage}</span>
                          {row.note && <span className="block text-[13px] text-ink/60 mt-1">{row.note}</span>}
                        </td>
                        <td className="p-4 md:p-5 font-bold whitespace-nowrap">{pct !== null ? `${pct}%` : "Remaining"}</td>
                        <td className="p-4 md:p-5 hidden md:table-cell text-ink/75 whitespace-nowrap">
                          {amount !== null ? inr(amount) : inr(remaining)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Reveal>
            <p className="mt-4 text-[13px] text-ink/55">
              Rupee column is an illustrative {area} sqft build at ₹{rate.toLocaleString("en-IN")}/sqft (Gold) so you can check the maths against your own quote. Percentages are the contract terms and do not change between packages.
            </p>

            <Reveal delay={0.1} className="mt-8 card-gb p-6 md:p-8 bg-paper">
              <p className="mono-label text-ink/50 mb-4">THE RULES BEHIND THE SCHEDULE</p>
              <ul className="space-y-2.5">
                {PAYMENT_RULES.map((r) => (
                  <li key={r} className="flex gap-3 text-[15px] text-ink/80">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-green mt-0.5" strokeWidth={2.5} />
                    {r}
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </section>

        {/* Why us, not a local contractor */}
        <section className="section-gb" data-testid="packages-why">
          <Container>
            <SectionHeader
              label="GHAR BANWAO VS LOCAL CONTRACTOR"
              title="Why Ghar Banwao is the best choice for your dream home."
              supporting="What you get from us, and what you are left to handle yourself with a typical local contractor."
            />
            <div className="mt-12 grid md:grid-cols-2 gap-5">
              <Reveal className="card-gb p-6 md:p-8 bg-paper" data-testid="packages-why-gb">
                <p className="flex items-center gap-2 font-extrabold text-[17px] pb-4 mb-5 border-b border-divider">
                  <Check className="h-5 w-5 text-green" strokeWidth={3} /> Why to choose Ghar Banwao
                </p>
                <ul className="space-y-2.5">
                  {WHY_GB.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[15px] text-ink/80">
                      <Check className="h-4 w-4 shrink-0 text-green mt-1.5" strokeWidth={3} />{item}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.1} className="card-gb p-6 md:p-8 bg-wash-yellow" data-testid="packages-why-other">
                <p className="flex items-center gap-2 font-extrabold text-[17px] pb-4 mb-5 border-b border-divider">
                  <X className="h-5 w-5 text-ink/40" strokeWidth={3} /> Disadvantages of other contractors
                </p>
                <ul className="space-y-2.5">
                  {WHY_OTHER.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[15px] text-ink/70">
                      <X className="h-4 w-4 shrink-0 text-ink/40 mt-1.5" strokeWidth={3} />{item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <Reveal delay={0.2} className="mt-8">
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
                <p className="text-[13px] text-ink/60 mt-1">260 homes, 8 UP cities, same office since 2017.</p>
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
