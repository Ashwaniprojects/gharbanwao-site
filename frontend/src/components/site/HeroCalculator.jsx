import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCalc } from "@/lib/calcContext";
import { formatINR } from "@/lib/calc";
import { scrollToId } from "@/lib/scroll";

const CountUp = ({ value, testId, className }) => {
  const mv = useMotionValue(value);
  const ref = useRef(null);
  useEffect(() => {
    const ctrl = animate(mv, value, { duration: 0.6, ease: "easeOut", onUpdate: (v) => ref.current && (ref.current.textContent = formatINR(v)) });
    return ctrl.stop;
  }, [value, mv]);
  return <span ref={ref} className={className} data-testid={testId}>{formatINR(value)}</span>;
};

export const UnitToggle = ({ value, onChange, idPrefix = "hero" }) => (
  <div className="inline-flex rounded-lg border border-divider p-0.5 bg-paper" role="radiogroup" aria-label="Area unit">
    {[["sqft", "Sq. Feet"], ["sqm", "Sq. Meter"]].map(([v, l]) => (
      <button
        key={v}
        type="button"
        role="radio"
        aria-checked={value === v}
        onClick={() => onChange(v)}
        className={`h-9 px-3 rounded-md text-[13px] font-semibold transition-colors ${value === v ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"}`}
        data-testid={`${idPrefix}-unit-${v}`}
      >
        {l}
      </button>
    ))}
  </div>
);

export const PackageToggle = ({ value, onChange, idPrefix = "calc" }) => {
  const { config } = useCalc();
  const keys = Object.keys((config && config.packages) || { silver: {}, gold: {} });
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-lg border border-divider p-1 bg-paper" role="radiogroup" aria-label="Package">
      {keys.map((k) => {
        const pkg = config?.packages?.[k] || {};
        const active = value === k;
        return (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(k)}
            className={`h-12 px-3 rounded-md text-[13px] font-semibold transition-colors ${active ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"}`}
            data-testid={`${idPrefix}-package-${k}`}
          >
            {pkg.name || k}
            <span className={`ml-1 font-mono text-[11px] ${active ? "text-paper/70" : "text-ink/40"}`}>₹{pkg.rate ?? "—"}</span>
          </button>
        );
      })}
    </div>
  );
};

export const HeroCalculator = () => {
  const { config, inputs, setInput, estimate, isLoading, isError, setStep } = useCalc();
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });
  const rotateX = useTransform(srx, (v) => `${v}deg`);
  const rotateY = useTransform(sry, (v) => `${v}deg`);

  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6);
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className="relative" style={{ perspective: 1200 }} onMouseMove={onMove} onMouseLeave={reset}>
      <motion.div
        className="absolute -right-4 -top-4 lg:-right-8 lg:-top-8 h-40 w-40 lg:h-56 lg:w-56 bg-yellow rounded-[28px] -z-0"
        initial={reduce ? false : { scale: 0.6, opacity: 0, rotate: -12 }}
        animate={{ scale: 1, opacity: 1, rotate: 6 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute -left-3 -bottom-3 h-24 w-24 bg-green rounded-2xl -z-0"
        initial={reduce ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        aria-hidden="true"
      />
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={reduce ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 rounded-2xl border border-divider bg-paper p-6 md:p-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)]"
        data-testid="hero-calculator"
      >
        <div className="flex items-center justify-end">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em]">
            <span className="h-2 w-2 rounded-full bg-green animate-pulse" /> Oct 2026 rates
          </span>
        </div>
        <h2 className="mt-3 text-lg md:text-xl font-bold tracking-tight">What will your home cost?</h2>

        <div className="mt-6 grid gap-4">
          <div className="grid gap-1.5">
            <span className="text-[13px] font-semibold text-ink/70">Package</span>
            <PackageToggle value={inputs.pkg} onChange={(v) => setInput("pkg", v)} idPrefix="hero" />
          </div>
          <label className="grid gap-1.5">
            <span className="text-[13px] font-semibold text-ink/70">City</span>
            <Select value={inputs.city} onValueChange={(v) => setInput("city", v)}>
              <SelectTrigger className="h-12 rounded-lg border-divider text-[16px] font-medium focus:ring-green" data-testid="hero-calculator-city-dropdown">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {(config?.cities || ["Lucknow"]).map((c) => (
                  <SelectItem key={c} value={c} data-testid={`hero-city-option-${c.toLowerCase()}`}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <div className="grid gap-1.5">
            <span className="text-[13px] font-semibold text-ink/70">Plot area</span>
            <div className="flex gap-2">
              <input
                type="number"
                min="100"
                value={inputs.area}
                onChange={(e) => setInput("area", e.target.value === "" ? "" : Number(e.target.value))}
                className="input-gb flex-1 font-mono"
                data-testid="hero-calculator-area-input"
              />
              <UnitToggle value={inputs.unit} onChange={(v) => setInput("unit", v)} />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-wash-yellow border border-divider p-5">
          {isError ? (
            <p className="text-[14px] text-red-600" data-testid="hero-calculator-error">Rates unavailable right now. Please retry.</p>
          ) : isLoading || !estimate ? (
            <div className="h-16 animate-pulse rounded-lg bg-[#E9E9E6]" data-testid="hero-calculator-loading" />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mono-label text-ink/60 text-[11px]">Cost per sqft</p>
                <CountUp value={estimate.perSqft} className="block mt-1 text-2xl font-extrabold tracking-tight" testId="hero-calculator-per-sqft" />
              </div>
              <div>
                <p className="mono-label text-ink/60 text-[11px]">Total estimate</p>
                <CountUp value={estimate.total} className="block mt-1 text-2xl font-extrabold tracking-tight text-green-700" testId="hero-calculator-total" />
              </div>
            </div>
          )}
          <p className="mt-3 font-mono text-[11px] text-ink/50 uppercase tracking-[0.08em]">{(config?.packages?.[inputs.pkg]?.name) || "Silver"} · {inputs.city} · Not a binding quote</p>
        </div>

        <button
          onClick={() => {
            setStep(2);
            scrollToId("calculator");
          }}
          className="pill-yellow mt-5 h-12 w-full text-[16px]"
          data-testid="hero-calculator-breakdown-button"
        >
          See phase-wise breakdown <ArrowDown className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </motion.div>
    </div>
  );
};
