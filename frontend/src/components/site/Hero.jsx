import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HeroCalculator } from "./HeroCalculator";
import { scrollToId } from "@/lib/scroll";

const LINES = [
  "भूमिपूजन से गृहप्रवेश तक,",
  "सफ़र आपका। साथ हमारा।",
];

export const Hero = () => {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-paper" data-testid="hero-section">
      <img
        src="/images/hero/twilight-villa.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[72%_center] pointer-events-none select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" aria-hidden="true" />
      <div className="container-gb relative z-10 grid lg:grid-cols-5 gap-10 lg:gap-8 py-14 lg:py-24 min-h-[calc(100vh-108px)] items-center">
        <div className="lg:col-span-3 lg:pr-8 text-paper" style={{ containerType: "inline-size" }}>
          <h1
            lang="hi"
            className="display mt-2 leading-[1.35]"
            style={{ letterSpacing: "normal", fontSize: "clamp(24px, 7cqw, 54px)", color: "#FFFFFF" }}
            data-testid="hero-headline"
          >
            <span className="block whitespace-nowrap overflow-hidden pb-[0.4em] -mb-[0.4em] pt-[0.35em] -mt-[0.35em]">
              <motion.span
                className="block"
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              >
                {LINES[0]}
              </motion.span>
            </span>
            <span className="block whitespace-nowrap overflow-hidden pb-[0.4em] -mb-[0.4em] pt-[0.35em] -mt-[0.35em]">
              <motion.span
                className="block"
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.27 }}
              >
                सफ़र आपका। <span className="text-[#93C526]" data-testid="hero-green-phrase">साथ हमारा।</span>
              </motion.span>
            </span>
          </h1>
          <motion.p
            className="mt-5 text-base md:text-lg text-white/85 max-w-[52ch]"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            data-testid="hero-supporting"
          >
            As a construction company in Lucknow, we have handed over 264+ homes across UP — every one tracked, documented, and backed by a 25-year structural warranty.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-3"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.5 }}
          >
            <button onClick={() => scrollToId("contact")} className="pill-green h-12 px-7 text-[15px]" data-testid="hero-cta-start">
              Start Your Project <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
            </button>
            <button onClick={() => scrollToId("calculator")} className="pill-ghost h-12 px-7 text-[15px] !border-white/40 !text-white hover:!bg-white/15 hover:!text-white" data-testid="hero-cta-calculator">
              Try the Cost Calculator
            </button>
          </motion.div>
        </div>
        <div className="lg:col-span-2 relative">
          <div className="hidden lg:flex absolute -top-14 right-4 flex-col items-center text-white/70" aria-hidden="true">
            <span className="text-[13px] font-medium tracking-wide">Homes built for a better tomorrow</span>
            <ArrowRight className="mt-1 h-4 w-4 rotate-90 text-green-400" strokeWidth={2} />
          </div>
          <HeroCalculator />
        </div>
      </div>
    </section>
  );
};
