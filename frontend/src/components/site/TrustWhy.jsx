import { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { Container, Reveal, SectionHeader } from "./shared";
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
      <article className="why-arch-item">
        <div className="why-arch text-green-700">
          <Icon strokeWidth={1.65} />
          <b className="why-badge">{String(i + 1).padStart(2, "0")}</b>
        </div>
        <h3 className="font-bold text-[15px] leading-snug text-ink [text-wrap:balance]">{item.title}</h3>
        <p className="mt-2.5 text-[13px] leading-relaxed text-ink/60 [text-wrap:pretty]">{item.text}</p>
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
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-4 md:gap-x-5">
          {WHY.map((item, i) => (
            <WhyCard key={item.title} item={item} i={i} />
          ))}
        </div>
      </Container>
    </section>
  );
};
