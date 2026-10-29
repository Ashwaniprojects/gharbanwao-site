import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ANNOUNCEMENTS } from "@/data/content";

export const AnnouncementStrip = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % ANNOUNCEMENTS.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="h-9 bg-yellow text-ink overflow-hidden no-print" data-testid="announcement-strip">
      <div className="container-gb h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={i}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-sans text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.06em] text-ink"
            data-testid="announcement-text"
          >
            {ANNOUNCEMENTS[i]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};
