import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
      <SectionHeader label="04 SERVICES" title="Construction services we deliver across Lucknow" supporting="Four things we do. Nothing we don't." />
      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06} className="card-gb p-4 flex flex-col group" data-testid={`service-card-${i + 1}`}>
            <Image src={s.img} alt={s.title} ratio="aspect-[4/3]" />
            <div className="p-3 pt-6 flex-1 flex flex-col">
              <h3 className="text-[20px] font-bold tracking-tight leading-tight">{s.title}</h3>
              <p className="mt-2 text-[15px] text-ink/65 flex-1">{s.text}</p>
              <button onClick={() => scrollToId(s.id)} className="mt-6 inline-flex items-center gap-1.5 font-bold text-[15px] self-start underline decoration-green decoration-2 underline-offset-4 group-hover:gap-2.5 transition-[gap]" data-testid={`service-cta-${i + 1}`}>
                {s.cta} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        ))}
      </div>
    </Container>
  </section>
);

export const Process = () => {
  const trackRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 0.85", "end 0.4"] });
  const lineProgress = useTransform(scrollYProgress, [0, 1], ["2%", "100%"]);

  return (
    <section id="process" className="section-gb bg-wash-green" data-testid="process-section">
      <Container>
        <SectionHeader
          label="10 STEPS · START TO FINISH"
          title="Step-by-Step Process to Start Your Dream Home Journey"
          supporting="From the day you search our name to the day we hand you the keys — here is exactly what happens, in order."
        />
        <div ref={trackRef} className="relative mt-16">
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-1/2 bg-ink/10" />
          <motion.div
            className="absolute left-5 md:left-1/2 top-0 w-[2px] md:-translate-x-1/2 bg-green origin-top"
            style={{ height: lineProgress }}
          />
          <div className="space-y-10 md:space-y-6">
            {PROCESS.map((p, i) => {
              const isLeft = i % 2 === 0;
              const isMilestone = p.name.includes("Code Allotment");
              const Icon = STEP_ICONS[i];
              const node = (
                <div
                  className={`absolute left-5 md:left-1/2 top-0 h-10 w-10 -translate-x-1/2 md:-translate-x-1/2 rounded-full grid place-items-center z-10 ring-4 ring-wash-green ${isMilestone ? "bg-ink text-yellow" : "bg-green text-ink"}`}
                  data-testid={`process-node-${p.n}`}
                >
                  <Icon className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2.5} />
                </div>
              );
              const content = (
                <div className={`pl-16 md:pl-0 ${isLeft ? "md:pr-14 md:text-right" : "md:pl-14"}`} data-testid={`process-stage-${p.n}`}>
                  <div className={`card-gb p-5 ${isLeft ? "md:ml-auto" : "md:mr-auto"} max-w-md`}>
                    <div className="flex items-center gap-3 mb-2.5">
                      <span className="mono-label text-green text-[12px] font-bold tracking-widest">{String(i + 1).padStart(2, "0")}</span>
                      {isMilestone && (
                        <span className="mono-label text-yellow text-[11px] font-bold tracking-widest bg-ink/5 px-2 py-0.5 rounded-full">
                          MILESTONE
                        </span>
                      )}
                    </div>
                    <h3 className="text-[18px] md:text-[20px] font-bold tracking-tight leading-snug">{p.name}</h3>
                    <p className="mt-2 text-[13.5px] md:text-[14px] text-ink/65 leading-relaxed">{p.highlight}</p>
                  </div>
                </div>
              );
              return (
                <Reveal key={p.n} delay={Math.min(i * 0.04, 0.3)} className="relative md:grid md:grid-cols-2 md:gap-10 md:items-start">
                  {node}
                  {isLeft ? (
                    <>
                      {content}
                      <div className="hidden md:block" />
                    </>
                  ) : (
                    <>
                      <div className="hidden md:block" />
                      {content}
                    </>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

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
