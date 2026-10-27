import { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { Container, Reveal, SectionHeader } from "./shared";
import { BorderBeam } from "@/components/spectrumui/border-beam";
import { WHY } from "@/data/content";

const CountDial = ({ to, step = 1, suffix = "+", duration = 1600 }) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!inView) return;
    const steps = Math.ceil(to / step);
    const intervalMs = Math.max(duration / steps, 20);
    let current = 0;
    const id = setInterval(() => {
      current += step;
      if (current >= to) { setVal(to); clearInterval(id); }
      else setVal(current);
    }, intervalMs);
    return () => clearInterval(id);
  }, [inView, to, step, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
};

export const TrustBar = () => (
  <section className="bg-wash-yellow border-t border-green" data-testid="trust-bar">
    <Container className="grid grid-cols-2 lg:grid-cols-5 divide-x divide-divider border-x border-divider">
      {[
        { label: "Homes Delivered", note: "across Lucknow & UP", number: <CountDial to={263} step={5} /> },
        { label: "Ongoing Projects", note: "homes under construction", number: <CountDial to={52} step={1} /> },
        { label: "Avg. Rating", note: "Google Reviews", number: "4.8★" },
        { label: "Years Building", note: "in Uttar Pradesh", number: "9+" },
        { label: "Cities Served", note: "across North India", number: "15+" },
      ].map((t, i) => (
        <Reveal key={t.label} delay={i * 0.06} className="p-6 md:p-10" data-testid={`trust-tile-${i + 1}`}>
          <p className="display text-4xl md:text-6xl lg:text-7xl text-green" data-testid={`trust-number-${i + 1}`}>{t.number}</p>
          <p className="mt-3 text-[13px] md:text-[15px] font-semibold uppercase tracking-wide">{t.label}</p>
          <p className="mt-1 font-mono text-[12px] text-ink/60">{t.note}</p>
        </Reveal>
      ))}
    </Container>
  </section>
);

function WhyCard({ item, i }) {
  const Icon = Icons[item.icon] || Icons.Check;
  return (
    <Reveal delay={(i % 4) * 0.05} className="h-full" data-testid={`why-card-${i + 1}`}>
      <article className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-green/20 bg-[rgba(245,250,240,0.72)] p-5 backdrop-blur-xl shadow-[0_4px_24px_rgba(34,139,34,0.08)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(34,139,34,0.2)]">
        <BorderBeam
          className="rounded-2xl"
          duration={5 + (i % 4)}
          borderWidth={1}
          colorFrom="rgba(147, 197, 38, 0)"
          colorTo={`rgba(147, 197, 38, ${0.28 + 0.07 * (i % 4)})`}
        />
        <span className="absolute -top-4 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-green/25 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
        <div className="relative flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-green/15 bg-[rgba(34,139,34,0.1)] transition-transform duration-300 group-hover:scale-110">
            <Icon className="h-5 w-5 text-green-700" strokeWidth={1.75} />
          </div>
          <span className="mono-label text-green text-[12px] font-bold tracking-widest">
            {String(i + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="relative font-bold text-[15px] leading-snug text-ink">{item.title}</h3>
        <p className="relative text-[13px] leading-relaxed text-ink/60">{item.text}</p>
      </article>
    </Reveal>
  );
}

export const WhyChoose = () => {
  return (
    <section id="why" className="section-gb bg-wash-yellow relative grain overflow-hidden" data-testid="why-choose-section">
      <Container className="relative z-10">
        <SectionHeader title="Why homeowners call us the best construction company in Uttar Pradesh" />

        {/* 12 reasons in 3 rows of 4 */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {WHY.map((item, i) => (
            <WhyCard key={item.title} item={item} i={i} />
          ))}
        </div>
      </Container>
    </section>
  );
};
