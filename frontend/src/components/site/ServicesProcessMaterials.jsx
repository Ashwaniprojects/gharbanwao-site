
import { ArrowRight } from "lucide-react";
import { Container, Image, Placeholder, Reveal, SectionHeader } from "./shared";
import { BRANDS, SERVICES } from "@/data/content";
import { scrollToId } from "@/lib/scroll";

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

export const Process = () => (
  <section id="process" className="section-gb" data-testid="process-section">
    <Container>
      <Reveal>
        <img
          src="/images/process/dream-home-roadmap.webp"
          alt="Your Dream Home, From First Step to Final Handover — a 10-step roadmap: search the right company, appointment and meeting, NB project code allotment, meet architect and engineer team, design and final discussion, get quotation and agreement, GB project code allotment, pooja and work start, step-by-step project updates, and finishing and delivery."
          width={1400}
          height={700}
          loading="lazy"
          decoding="async"
          className="w-full h-auto rounded-2xl"
          data-testid="process-roadmap-image"
        />
      </Reveal>
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
