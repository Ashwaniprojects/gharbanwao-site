import { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { useInView } from "framer-motion";
import { Container, Reveal, SectionHeader } from "./shared";
import { TRUST, WHY } from "@/data/content";

const CountDial = ({ to, step = 1, suffix = "+", duration = 1600 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const steps = Math.ceil(to / step);
    const intervalMs = Math.max(duration / steps, 20);
    let current = 0;
    const id = setInterval(() => {
      current += step;
      if (current >= to) {
        setVal(to);
        clearInterval(id);
      } else {
        setVal(current);
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [inView, to, step, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
};

export const TrustBar = () => (
  <section className="bg-wash-yellow border-t border-green" data-testid="trust-bar">
    <Container className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-divider border-x border-divider">
      {TRUST.map((t, i) => (
        <Reveal key={t.label} delay={i * 0.06} className="p-6 md:p-10" data-testid={`trust-tile-${i + 1}`}>
          <p className="display text-4xl md:text-6xl lg:text-7xl text-green" data-testid={`trust-number-${i + 1}`}>
            {i === 0 ? <CountDial to={37} step={1} /> : i === 1 ? <CountDial to={260} step={5} /> : t.number}
          </p>
          <p className="mt-3 text-[13px] md:text-[15px] font-semibold uppercase tracking-wide">{t.label}</p>
          <p className="mt-1 font-mono text-[12px] text-ink/60">{t.note}</p>
        </Reveal>
      ))}
    </Container>
  </section>
);

export const WhyChoose = () => (
  <section id="why" className="section-gb bg-wash-yellow relative grain" data-testid="why-choose-section">
    <Container className="relative">
      <SectionHeader label="12 REASONS · NO SUPERLATIVES" title="Why homeowners call us the best construction company in Uttar Pradesh" supporting="Each reason below comes with the proof. If we cannot show it, we do not list it." />
      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {WHY.map((w, i) => {
          const Icon = Icons[w.icon] || Icons.Check;
          return (
            <Reveal key={w.title} delay={(i % 4) * 0.05} className="card-gb p-6 md:p-8 group" data-testid={`why-tile-${i + 1}`}>
              <div className="h-11 w-11 rounded-xl bg-[#e8f5e9] grid place-items-center">
                <Icon className="h-6 w-6 text-green-700" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-[18px] font-bold leading-snug">{w.title}</h3>
              <p className="mt-2 text-[15px] text-ink/65">{w.text}</p>
            </Reveal>
          );
        })}
      </div>
    </Container>
  </section>
);
