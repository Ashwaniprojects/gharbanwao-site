import { Check, X, Linkedin } from "lucide-react";
import { Container, Placeholder, Reveal, SectionHeader } from "./shared";
import { TEAM, WHY_GB, WHY_OTHER } from "@/data/content";

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
