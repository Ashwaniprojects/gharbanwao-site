import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { HeroCalculator } from "./HeroCalculator";
import { scrollToId } from "@/lib/scroll";

const LINES = ["भूमिपूजन से गृहप्रवेश तक,", "सफ़र आपका.", "साथ हमारा."];

export const Hero = () => {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden" data-testid="hero-section">
      <div className="absolute inset-y-0 left-0 w-full lg:w-[60%] bg-wash-yellow grain" aria-hidden="true" />
      <div className="absolute -left-24 top-1/2 h-[520px] w-[520px] rounded-full bg-yellow/40 blur-3xl -translate-y-1/2 hidden lg:block" aria-hidden="true" />
      <div className="container-gb relative grid lg:grid-cols-5 gap-10 lg:gap-6 py-14 lg:py-24 min-h-[calc(100vh-108px)] items-center">
        <div className="lg:col-span-3 lg:pr-12">
          <h1
            lang="hi"
            className="display mt-6 text-[40px] sm:text-5xl lg:text-[68px] xl:text-[76px] leading-[1.4]"
            style={{ fontFamily: '"Mukta", "Manrope", sans-serif', letterSpacing: "normal" }}
            data-testid="hero-headline"
          >
            {LINES.map((l, i) => (
              <span key={l} className="block overflow-hidden pb-[0.4em] -mb-[0.4em] pt-[0.08em] -mt-[0.08em]">
                <motion.span
                  className={`block ${i === 2 ? "text-green" : ""}`}
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.12 }}
                >
                  {l}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="mt-5 text-base md:text-lg text-ink/75 max-w-[52ch]"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            data-testid="hero-supporting"
          >
            As a construction company in Lucknow, we have handed over 260+ homes across UP — every one tracked, documented, and backed by a 25-year structural warranty.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-3"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.5 }}
          >
            <button onClick={() => scrollToId("contact")} className="pill-green h-12 px-6 text-[15px]" data-testid="hero-cta-start">
              Start Your Project <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
            </button>
            <button onClick={() => scrollToId("calculator")} className="pill-yellow h-14 px-8 text-[17px]" data-testid="hero-cta-calculator">
              Try the Cost Calculator
            </button>
          </motion.div>
          <motion.p
            className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] font-medium text-ink/70"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            data-testid="hero-trust-line"
          >
            <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-green text-green" /> 4.8 / 5 on Google</span>
            <span aria-hidden="true">·</span>
            <span>9+ years</span>
            <span aria-hidden="true">·</span>
            <span>Structural warranty included</span>
          </motion.p>
        </div>
        <div className="lg:col-span-2 relative">
          <HeroCalculator />
        </div>
      </div>
    </section>
  );
};
