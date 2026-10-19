import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const Image = ({ src, alt = "", ratio = "aspect-[4/3]", className = "" }) => (
  <div className={`relative overflow-hidden rounded-2xl border border-divider bg-[#E9E9E6] ${ratio} ${className}`}>
    <img src={src} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
  </div>
);

export const Container = ({ className = "", children, ...rest }) => (
  <div className={`container-gb ${className}`} {...rest}>
    {children}
  </div>
);

export const MonoLabel = ({ children, className = "", ...rest }) => (
  <span className={`mono-label text-ink/70 ${className}`} {...rest}>
    {children}
  </span>
);

export const Reveal = ({ children, delay = 0, className = "", ...rest }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export const SectionHeader = ({ label, title, supporting, align = "left", testId, className = "" }) => (
  <Reveal className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} ${className}`} data-testid={testId}>
    {label && <p className="mono-label text-green-700 mb-3">{label}</p>}
    <h2 className="display text-3xl sm:text-4xl lg:text-5xl max-w-[18ch]">{title}</h2>
    {supporting && (
      <p className={`font-sub mt-5 text-base md:text-lg text-ink/70 max-w-[68ch] ${align === "center" ? "mx-auto" : ""}`}>{supporting}</p>
    )}
  </Reveal>
);

export const Placeholder = ({ code, ratio = "aspect-[4/3]", className = "", label }) => (
  <div
    className={`relative overflow-hidden rounded-2xl border border-divider bg-[#E9E9E6] ${ratio} ${className}`}
    data-testid={`placeholder-${code.toLowerCase()}`}
  >
    <div
      className="absolute inset-0 opacity-60"
      style={{ backgroundImage: "linear-gradient(135deg, transparent 48%, #DADAD6 48%, #DADAD6 52%, transparent 52%)", backgroundSize: "28px 28px" }}
    />
    <div className="absolute inset-0 flex flex-col items-start justify-end p-4">
      <span className="font-mono text-[12px] font-medium uppercase tracking-[0.12em] bg-paper/90 px-2 py-1 rounded-md">{code}</span>
      {label && <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink/60">{label}</span>}
    </div>
  </div>
);

export const PillLink = ({ variant = "green", children, className = "", arrow = true, ...rest }) => {
  const v = variant === "green" ? "pill-green" : variant === "yellow" ? "pill-yellow" : "pill-ghost";
  return (
    <button type="button" className={`${v} px-6 h-12 text-[16px] ${className}`} {...rest}>
      {children}
      {arrow && <ArrowRight className="h-4 w-4" strokeWidth={2.5} />}
    </button>
  );
};

export const Stars = ({ n = 5 }) => (
  <span className="text-green tracking-tight" aria-label={`${n} star rating`}>
    {"★".repeat(n)}
    <span className="text-ink/20">{"★".repeat(5 - n)}</span>
  </span>
);
