
import {
  Search,
  Phone,
  KeyRound,
  Users,
  PenTool,
  FileText,
  Handshake,
  Flame,
  Send,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Container, Image, Placeholder, Reveal, SectionHeader } from "./shared";
import { BRANDS, PROCESS, SERVICES } from "@/data/content";
import { scrollToId } from "@/lib/scroll";

const STEP_ICONS = [Search, Phone, KeyRound, Users, PenTool, FileText, Handshake, Flame, Send, CheckCircle2];

export const Services = () => (
  <section id="services" className="section-gb border-t border-divider" data-testid="services-section">
    <Container>
      <SectionHeader title="Construction services we deliver across Lucknow" supporting="Four things we do. Nothing we don't." />
      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SERVICES.map((s, i) => {
          const toDetail = s.slug ? `/services/${s.slug}` : "";
          const cta = s.external ? (
            <a href={s.external} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-1.5 font-bold text-[15px] self-start underline decoration-green decoration-2 underline-offset-4 group-hover:gap-2.5 transition-[gap]" data-testid={`service-cta-${i + 1}`}>
              {s.cta} <ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <button onClick={() => (toDetail ? (window.location.href = toDetail) : scrollToId(s.id))} className="mt-6 inline-flex items-center gap-1.5 font-bold text-[15px] self-start underline decoration-green decoration-2 underline-offset-4 group-hover:gap-2.5 transition-[gap]" data-testid={`service-cta-${i + 1}`}>
              {s.cta} <ArrowRight className="h-4 w-4" />
            </button>
          );
          return (
            <Reveal key={s.title} delay={i * 0.06} className="card-gb p-4 flex flex-col group" data-testid={`service-card-${i + 1}`}>
              <Image src={s.img} alt={s.title} ratio="aspect-[4/3]" />
              <div className="p-3 pt-6 flex-1 flex flex-col">
                <h3 className="text-[20px] font-bold tracking-tight leading-tight">{s.title}</h3>
                <p className="mt-2 text-[15px] text-ink/65 flex-1">{s.text}</p>
                {cta}
              </div>
            </Reveal>
          );
        })}
      </div>
    </Container>
  </section>
);

const ProcessStep = ({ p, i, Icon }) => {
  const isMilestone = p.name.includes("Code Allotment");
  return (
    <Reveal delay={(i % 5) * 0.06} data-testid={`process-step-${i + 1}`}>
      <div className="relative flex gap-4">
        {/* Node */}
        <div className="relative z-10 flex shrink-0 justify-center pt-1">
          <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-green bg-paper shadow-[0_4px_14px_rgba(147,197,38,0.25)]">
            <Icon className="h-5 w-5 text-green-700" strokeWidth={2} />
          </div>
        </div>
        {/* Card */}
        <article className="group relative flex-1 overflow-hidden rounded-2xl border border-divider bg-paper p-4 shadow-[0_6px_24px_-14px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:border-green/40 hover:shadow-[0_12px_36px_-12px_rgba(147,197,38,0.3)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green via-green/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
          <div className="relative flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="mono-label text-green text-[13px] font-bold tracking-widest">{p.n}</span>
                {isMilestone && (
                  <span className="mono-label text-[10px] font-bold tracking-[0.18em] text-ink bg-yellow px-2 py-[3px] rounded-full">
                    MILESTONE
                  </span>
                )}
              </div>
              <h3 className="mt-1.5 text-[16px] font-bold tracking-tight leading-snug">{p.name}</h3>
              <p className="mt-1 text-[13px] text-ink/60 leading-relaxed">{p.highlight}</p>
            </div>
            {p.img && (
              <img
                src={p.img}
                alt={p.name}
                width={88}
                height={66}
                loading="lazy"
                decoding="async"
                className="h-[66px] w-[88px] shrink-0 rounded-lg object-cover border border-divider"
                data-testid={`process-image-${p.n}`}
              />
            )}
          </div>
        </article>
      </div>
    </Reveal>
  );
};

const ProcessRail = ({ items, start }) => (
  <div className="relative">
    {/* Vertical dashed rail */}
    <div className="absolute bottom-8 left-6 top-8 w-0 border-l-2 border-dashed border-green/25" aria-hidden="true" />
    <ol className="space-y-5">
      {items.map((p, i) => (
        <li key={p.n}>
          <ProcessStep p={p} i={start + i} Icon={STEP_ICONS[start + i]} />
        </li>
      ))}
    </ol>
  </div>
);

export const Process = () => (
  <section id="process" className="section-gb relative overflow-hidden" data-testid="process-section">
    {/* Subtle bg wash */}
    <div className="absolute inset-0 bg-gradient-to-b from-wash-yellow via-wash-green to-transparent" aria-hidden="true" />
    <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-green/10 blur-3xl" aria-hidden="true" />
    <Container className="relative z-10">
      <SectionHeader
        title="Step-by-Step Process to Start Your Dream Home Journey"
        supporting="From the day you search our name to the day we hand you the keys — here is exactly what happens, in order."
      />
      <div className="mt-12 grid gap-x-12 gap-y-8 lg:grid-cols-2">
        <ProcessRail items={PROCESS.slice(0, 5)} start={0} />
        <ProcessRail items={PROCESS.slice(5, 10)} start={5} />
      </div>
    </Container>
  </section>
);

export const Materials = () => (
  <section id="materials" className="section-gb" data-testid="materials-section">
    <Container>
      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <SectionHeader label="MATERIAL TRANSPARENCY" title="You pay for the materials. You get to see them." supporting={`We publish the brands we use. No "equivalent / as per site" trick in the quote.`} />
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[["IMG-12", "Cement · GB-ID chalked"], ["IMG-13", "TMT bundles"], ["IMG-14", "Tile palette"]].map(([c, l]) => (
              <Placeholder key={c} code={c} ratio="aspect-square" label={l} />
            ))}
          </div>
        </div>
        <Reveal delay={0.1} className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3" data-testid="brand-wall">
          {BRANDS.map((b) => (
            <div key={b} className="card-gb h-24 grid place-items-center px-4 text-center group cursor-default" data-testid={`brand-${b.replace(/\s+/g, "-").toLowerCase()}`}>
              <span className="text-[17px] font-extrabold tracking-tight text-ink/35 group-hover:text-ink transition-colors">{b}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </Container>
  </section>
);
