import { useCallback, useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Reveal, SectionHeader } from "./shared";
import { WHY } from "@/data/content";

const CARDS_PER_PAGE = 4;

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

function WhyCard({ item }) {
  const Icon = Icons[item.icon] || Icons.Check;
  return (
    <div
      className="
        group relative flex flex-col gap-3 p-5 rounded-2xl cursor-pointer h-full min-h-[160px]
        backdrop-blur-xl border border-[rgba(34,139,34,0.18)]
        bg-[rgba(245,250,240,0.72)]
        shadow-[0_4px_24px_rgba(34,139,34,0.08)]
        transition-all duration-300 ease-out
        hover:scale-110 hover:z-10 hover:shadow-[0_8px_40px_rgba(34,139,34,0.22)]
        group-hover:blur-[3px] group-hover:scale-95
        hover:!blur-0 hover:!scale-110
      "
    >
      {/* Glow blob */}
      <span
        className="
          absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full
          bg-[rgba(34,139,34,0.25)] blur-2xl pointer-events-none
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
        "
        aria-hidden="true"
      />
      {/* Icon */}
      <div className="relative h-11 w-11 rounded-xl bg-[rgba(34,139,34,0.12)] border border-[rgba(34,139,34,0.15)] grid place-items-center shrink-0">
        <Icon className="h-5 w-5 text-green-700" strokeWidth={1.75} />
      </div>
      {/* Text */}
      <div className="relative flex flex-col gap-1.5">
        <h3 className="font-bold text-[15px] leading-snug text-ink">{item.title}</h3>
        <p className="text-[13px] text-ink/60 leading-relaxed">{item.text}</p>
      </div>
    </div>
  );
}

export const WhyChoose = () => {
  const [page, setPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(null);
  const trackRef = useRef(null);
  const timerRef = useRef(null);

  const totalPages = Math.ceil(WHY.length / CARDS_PER_PAGE);

  const go = useCallback((p) => {
    setPage(Math.max(0, Math.min(p, totalPages - 1)));
  }, [totalPages]);

  // Auto-rotate every 4 seconds when not dragging
  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 4000);
  }, [totalPages]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  // Pause on hover
  const handleMouseEnter = () => stopTimer();
  const handleMouseLeave = () => startTimer();

  // Swipe on mobile
  const handlePointerDown = (e) => {
    dragStartX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    setIsDragging(false);
  };
  const handlePointerMove = (e) => {
    if (dragStartX.current === null) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    if (Math.abs(x - dragStartX.current) > 6) setIsDragging(true);
  };
  const handlePointerUp = (e) => {
    if (dragStartX.current === null) return;
    const x = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
    const delta = dragStartX.current - x;
    if (delta > 50) go(page + 1);
    else if (delta < -50) go(page - 1);
    dragStartX.current = null;
    setTimeout(() => setIsDragging(false), 50);
  };

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") go(page + 1);
      if (e.key === "ArrowLeft") go(page - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [page, go]);

  const visibleCards = WHY.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  return (
    <section id="why" className="section-gb bg-wash-yellow relative grain overflow-hidden py-20" data-testid="why-choose-section">
      <Container className="relative z-10">
        <SectionHeader
          title="Why homeowners call us the best construction company in Uttar Pradesh"
        />

        {/* Grid + Nav */}
        <div className="mt-14 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              ref={trackRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 items-stretch"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ userSelect: "none", touchAction: "pan-y" }}
            >
              {visibleCards.map((item) => (
                <div key={item.title} className="group">
                  <WhyCard item={item} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            className="w-10 h-10 rounded-full border border-divider bg-paper/80 backdrop-blur flex items-center justify-center hover:bg-green hover:text-paper hover:border-green transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={() => go(page - 1)}
            disabled={page === 0}
            aria-label="Previous"
          >
            <Icons.ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to row ${i + 1}`}
                className={`
                  h-2 rounded-full transition-all duration-300 cursor-pointer
                  ${i === page
                    ? "w-7 bg-green"
                    : "w-2 bg-divider hover:bg-green/40"}
                `}
              />
            ))}
          </div>

          <button
            className="w-10 h-10 rounded-full border border-divider bg-paper/80 backdrop-blur flex items-center justify-center hover:bg-green hover:text-paper hover:border-green transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={() => go(page + 1)}
            disabled={page === totalPages - 1}
            aria-label="Next"
          >
            <Icons.ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Row counter */}
        <p className="text-center text-[13px] text-ink/40 mt-3 font-mono tracking-wide">
          {page + 1} of {totalPages} · swipe to navigate · ← → keys work too
        </p>
      </Container>
    </section>
  );
};
