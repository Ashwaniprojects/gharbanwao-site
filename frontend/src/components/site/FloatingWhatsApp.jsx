import { FaWhatsapp } from "react-icons/fa6";
import { WHATSAPP_URL } from "@/data/content";

/**
 * Floating WhatsApp call-to-action, desktop only.
 *
 * Sits fixed in the bottom-right corner on every page so visitors can start a
 * chat at any point in their scroll. Hidden below the `md` breakpoint, where
 * the footer's sticky two-up bar already carries a WhatsApp button.
 */
export function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      data-testid="floating-whatsapp-button"
      className="group fixed bottom-6 right-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.55)] transition-[transform,background-color] duration-200 hover:scale-105 hover:bg-[#20BD5A] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 md:grid no-print"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20"
      />
      <FaWhatsapp aria-hidden="true" className="relative h-7 w-7" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-[13px] font-bold text-paper opacity-0 translate-x-2 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
      >
        Chat with us
      </span>
    </a>
  );
}

export default FloatingWhatsApp;
