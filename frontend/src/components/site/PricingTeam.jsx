import { ArrowRight, Check, X, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { Container, Placeholder, Reveal, SectionHeader } from "./shared";
import { PRICING, PRICING_ROWS, TEAM, WHY_GB, WHY_OTHER } from "@/data/content";
import { scrollToId } from "@/lib/scroll";

export const Pricing = () => (
  <section id="packages" className="section-gb bg-wash-green" data-testid="pricing-section">
    <Container>
      <SectionHeader label="03 PACKAGES · PER SQFT" title="Pick a package. Every number is public." supporting="Same structural warranty on all three. The difference is finish, frequency, and support length." />
      <div className="mt-14 flex lg:grid lg:grid-cols-3 gap-5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory -mx-6 px-6 lg:mx-0 lg:px-0 pb-4 lg:pb-0">
        {PRICING.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.07} className={`snap-center shrink-0 w-[85vw] sm:w-[360px] lg:w-auto card-gb p-6 md:p-8 flex flex-col ${p.featured ? "border-green lg:-translate-y-2 bg-paper relative" : "bg-paper"}`} data-testid={`pricing-card-${p.name.toLowerCase()}`}>
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
            <button onClick={() => scrollToId("contact")} className={`${p.featured ? "pill-green" : "pill-outline-green"} mt-8 h-12 px-6 text-[15px]`} data-testid={`pricing-cta-${p.name.toLowerCase()}`}>{p.cta} <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} /></button>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8">
        <Link to="/packages" className="inline-flex items-center gap-1.5 font-bold underline decoration-green decoration-2 underline-offset-4" data-testid="pricing-details-link">Full inclusions, payment schedule and material spec on each package <ArrowRight className="h-4 w-4" /></Link>
      </Reveal>
    </Container>
  </section>
);

export const Comparison = () => (
  <section className="section-gb" data-testid="comparison-section">
    <Container>
      <SectionHeader label="GHAR BANWAO VS LOCAL CONTRACTOR" title="Why Ghar Banwao is the best choice for your dream home." supporting="What you get from us, and what you are left to handle yourself with a typical local contractor." />
      <div className="mt-12 grid md:grid-cols-2 gap-5">
        <Reveal className="card-gb p-6 md:p-8 bg-paper" data-testid="why-gb-card">
          <p className="flex items-center gap-2 font-extrabold text-[17px] pb-4 mb-5 border-b border-divider">
            <Check className="h-5 w-5 text-green-700" strokeWidth={3} /> Why to choose Ghar Banwao
          </p>
          <ul className="space-y-2.5">
            {WHY_GB.map((item) => (
              <li key={item} className="flex gap-2.5 text-[15px] text-ink/80">
                <Check className="h-4 w-4 shrink-0 text-green-700 mt-1.5" strokeWidth={3} />{item}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="card-gb p-6 md:p-8 bg-wash-yellow" data-testid="why-other-card">
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
    </Container>
  </section>
);

export const Team = () => (
  <section id="about" className="section-gb bg-wash-yellow" data-testid="team-section">
    <Container>
      <SectionHeader label="DEDICATED ENGINEERS + TEAM" title="The people who will actually be on your site" supporting="As a construction company in Lucknow, we put three engineers per project — structural, site, quality — and one project manager who answers your WhatsApp." />
      <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {TEAM.map((m, i) => (
          <Reveal key={m.name} delay={i * 0.05} className="card-gb p-3 bg-paper flex flex-col" data-testid={`team-card-${i + 1}`}>
            <Placeholder code={m.img} ratio="aspect-square" />
            <div className="p-2 pt-4 flex-1 flex flex-col">
              <p className="font-bold text-[15px] leading-tight">{m.name}</p>
              <p className="text-[13px] text-green-700 font-semibold mt-0.5">{m.role}</p>
              <p className="font-mono text-[11px] text-ink/50 mt-1">{m.years}</p>
              <p className="text-[13px] text-ink/70 mt-3 flex-1">{m.specialty}</p>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-ink/50 hover:text-ink" aria-label={`${m.name} on LinkedIn`}><Linkedin className="h-3.5 w-3.5" /> LinkedIn</a>
            </div>
          </Reveal>
        ))}
      </div>
    </Container>
  </section>
);
