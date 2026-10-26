import { Check, X, Linkedin } from "lucide-react";
import { BorderBeam } from "@/components/spectrumui/border-beam";
import { Container, Image, Placeholder, Reveal, SectionHeader } from "./shared";
import { TEAM, WHY_US, WHY_THEM } from "@/data/content";

// A value that starts with "/" or "http" is a real asset (path or remote URL);
// anything else is an IMG-NN placeholder code waiting for a photo.
const isRealImage = (value) =>
  typeof value === "string" && (value.startsWith("/") || value.startsWith("http"));

const COMPARE_TITLE = "Why Homeowners Choose Ghar Banwao Over Local Contractors";
const COMPARE_SUB = "From transparent pricing and professional supervision to quality assurance and post-handover support, discover the difference a professionally managed construction company makes.";

const CompareColumn = ({ tone, items }) => {
  const us = tone === "us";
  return (
    <div className={
      "relative h-full overflow-hidden rounded-2xl border bg-paper p-6 md:p-8 " +
      (us ? "border-green" : "border-divider bg-wash-yellow")
    } data-testid={us ? "why-gb-card" : "why-other-card"}>
      {us && (
        <BorderBeam
          className="rounded-2xl"
          duration={7}
          borderWidth={1.25}
          colorFrom="rgba(147, 197, 38, 0)"
          colorTo="rgba(147, 197, 38, 0.75)"
        />
      )}
      <p className={
        "relative z-10 flex items-center gap-2 font-extrabold text-[17px] pb-4 mb-5 border-b border-divider " +
        (us ? "text-green-700" : "text-ink/50")
      }>
        {us
          ? <Check className="h-5 w-5 text-green" strokeWidth={3} />
          : <X className="h-5 w-5 text-ink/40" strokeWidth={3} />}
        {us ? "Why to choose Ghar Banwao" : "Disadvantages of other contractors"}
      </p>
      <ul className="relative z-10 space-y-5">
        {items.map((row) => (
          <li key={row.title} className="flex gap-3">
            <span className={
              "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full " +
              (us ? "bg-green/15 text-green-700" : "bg-black/[0.05] text-ink/40")
            }>
              {us
                ? <Check className="h-3 w-3" strokeWidth={3.5} />
                : <X className="h-3 w-3" strokeWidth={3.5} />}
            </span>
            <span className="text-[15px] leading-snug">
              <span className={"block font-bold " + (us ? "text-ink" : "text-ink/70")}>{row.title}</span>
              <span className="font-sub mt-0.5 block text-[14px] text-ink/65 leading-relaxed">{row.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Comparison = () => (
  <section className="section-gb" data-testid="comparison-section">
    <Container>
      <SectionHeader label="GHAR BANWAO VS LOCAL CONTRACTOR" title={COMPARE_TITLE} supporting={COMPARE_SUB} />
      <div className="mt-12 grid md:grid-cols-2 gap-5 items-stretch">
        <Reveal className="h-full"><CompareColumn tone="us" items={WHY_US} /></Reveal>
        <Reveal delay={0.1} className="h-full"><CompareColumn tone="them" items={WHY_THEM} /></Reveal>
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
            {isRealImage(m.img) ? (
              <Image src={m.img} alt={m.name} ratio="aspect-square" />
            ) : (
              <Placeholder code={m.img} ratio="aspect-square" />
            )}
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
