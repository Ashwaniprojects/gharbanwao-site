
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
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
import { BorderBeam } from "@/components/spectrumui/border-beam";
import { BRANDS, PROCESS, SERVICES } from "@/data/content";
import { scrollToId } from "@/lib/scroll";

const STEP_ICONS = [Search, Phone, KeyRound, Users, PenTool, FileText, Handshake, Flame, Send, CheckCircle2];

const ProcessCard = ({ p, i }) => {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });
  const rotateX = useTransform(srx, v => `${v}deg`);
  const rotateY = useTransform(sry, v => `${v}deg`);

  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
  };
  const reset = () => { rx.set(0); ry.set(0); };

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={onMove}
        onMouseLeave={reset}
        className="relative overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.14)]"
        data-testid={`process-card-${i + 1}`}
      >
        <BorderBeam
          duration={4 + (i % 3)}
          colorFrom="rgba(147,197,38,0)"
          colorTo={`rgba(147,197,38,${0.35 + 0.15 * (i % 3)})`}
        />
        <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
          {/* Image placeholder */}
          <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#f4fadf] via-[#fffce6] to-[#f4fadf]">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[56px] font-extrabold text-green/20 select-none" data-testid={`process-placeholder-num-${i + 1}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mono-label text-[11px] text-ink/30 tracking-widest">PLACEHOLDER · IMAGE {i + 1}</span>
            </div>
            {p.img && (
              <img
                src={p.img}
                alt={p.name}
                width="800"
                height="450"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                data-testid={`process-image-${p.n}`}
              />
            )}
          </div>
          {/* Card body */}
          <div className="p-5">
            <div className="flex items-center gap-3 mb-2.5">
              <span className="mono-label text-green text-[13px] font-bold tracking-widest">{p.n}</span>
              {p.name.includes("Code Allotment") && (
                <span className="mono-label text-[10px] font-bold tracking-[0.18em] text-ink bg-yellow px-2 py-[3px] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
                  MILESTONE
                </span>
              )}
            </div>
            <h3 className="text-[17px] md:text-[18px] font-bold tracking-tight leading-snug">{p.name}</h3>
            <p className="mt-1.5 text-[13.5px] text-ink/60 leading-relaxed">{p.highlight}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

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

export const Process = () => {
  const reduce = useReducedMotion();
  return (
    <section id="process" className="section-gb relative overflow-hidden" data-testid="process-section">
      {/* Subtle bg wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-wash-yellow via-wash-green to-transparent" aria-hidden="true" />
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-green/10 blur-3xl" aria-hidden="true" />
      <Container className="relative z-10">
        <SectionHeader
          title="Step-by-Step Process to Start Your Dream Home Journey"
          supporting="From the day you search our name to the day we hand you the keys — here is exactly what happens, in order."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PROCESS.map((p, i) => (
            <motion.div
              key={p.n}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.08, 0.5), ease: [0.22, 1, 0.36, 1] }}
            >
              <ProcessCard p={p} i={i} />
            </motion.div>
          ))}
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
