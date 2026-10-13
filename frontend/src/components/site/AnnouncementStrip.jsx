import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa6";
import { ANNOUNCEMENTS, WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/data/content";

export const AnnouncementStrip = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % ANNOUNCEMENTS.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="h-9 bg-yellow text-ink overflow-hidden no-print" data-testid="announcement-strip">
      <div className="container-gb h-full flex items-center justify-center gap-3">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 font-mono text-[12px] md:text-[13px] font-bold"
          data-testid="announcement-whatsapp"
        >
          <FaWhatsapp className="h-4 w-4" /> {WHATSAPP_DISPLAY}
        </a>
        <span className="hidden sm:inline text-ink/30">·</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={i}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-[12px] md:text-[13px] font-medium tracking-[0.04em] truncate"
            data-testid="announcement-text"
          >
            {ANNOUNCEMENTS[i]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};
