import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, X } from "lucide-react";
import { fetchActiveOffers } from "@/lib/cmsAdmin";

/**
 * The home-page offer surface.
 *
 *  - Fetches the active offers (published and inside their live window — the
 *    backend does that filtering, so an empty list or a not-yet-deployed
 *    endpoint simply means nothing ever shows; never an error on the page).
 *  - When the visitor has scrolled 40% of the home page, the most recent
 *    active offer they haven't dismissed pops in as a dismissible card.
 *  - "Once per user" is per-offer, per-browser: dismissed slugs live in
 *    localStorage, so a NEW offer still auto-shows for the same visitor, but
 *    a dismissed one never does.
 *  - After an offer has appeared (or was dismissed before) a vertical OFFERS
 *    button on the left edge brings it back on demand.
 */

const DISMISSED_KEY = "gb-offer-dismissed";

const getDismissed = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

const markDismissed = (slug) => {
  try {
    const raw = JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]");
    const list = Array.isArray(raw) ? raw : [];
    if (!list.includes(slug)) list.push(slug);
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable (private mode) — the dismissal just won't persist */
  }
};

/** True once the window has travelled `threshold` of the scrollable height. */
const useReachedRatio = (threshold) => {
  const [reached, setReached] = useState(false);
  useEffect(() => {
    if (reached) return undefined;
    const check = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= threshold) setReached(true);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [reached, threshold]);
  return reached;
};

// The motion.div wraps the card in a full-width flex row and animates the row.
// Centering happens via flex on the row, not via a translate on the card, so
// Framer's `transform: translateY()` (which it writes onto the motion element
// on animation end) can't clobber the card's position. Wrapping the card in a
// plain div also keeps the transform out of the interactive surface.
const Banner = ({ offer, onDismiss }) => (
  <motion.div
    initial={{ y: 24, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 24, opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="no-print pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-[4vw] md:bottom-8"
    data-testid="offer-banner"
    role="dialog"
    aria-label={offer.title}
  >
    <div className="card-gb pointer-events-auto relative w-full max-w-[560px] p-4 shadow-xl md:p-5">
    <button
      type="button"
      onClick={onDismiss}
      aria-label="Dismiss offer"
      data-testid="offer-banner-dismiss"
      className="absolute right-3 top-3 z-10 rounded-full bg-paper/80 p-2 text-ink/50 transition-colors hover:bg-wash-yellow hover:text-ink"
    >
      <X className="h-4 w-4" />
    </button>
    {offer.image_url ? (
      <img
        src={offer.image_url}
        alt=""
        className="mb-4 h-auto max-h-[220px] w-full rounded-xl border border-divider object-contain md:max-h-[340px]"
        data-testid="offer-banner-image"
      />
    ) : null}
    <p className="mono-label text-[12px] text-green-700">
      OFFER
      {offer.ends_at ? (
        <span className="ml-2 text-ink/45">
          until{" "}
          {new Date(offer.ends_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </span>
      ) : null}
    </p>
    <p className="mt-1 text-[16px] md:text-[19px] font-bold leading-snug text-green-700">{offer.title}</p>
    {offer.description ? (
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink/65">{offer.description}</p>
    ) : null}
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {offer.cta_url ? (
        <a
          href={offer.cta_url}
          target={/^https?:/i.test(offer.cta_url) ? "_blank" : undefined}
          rel={/^https?:/i.test(offer.cta_url) ? "noreferrer" : undefined}
          className="inline-flex h-9 items-center rounded-full bg-green px-4 text-[13px] font-medium text-ink hover:bg-green-600 hover:text-paper"
          data-testid="offer-banner-cta"
        >
          {offer.code ? `Claim with code ${offer.code}` : "Claim offer"}
        </a>
      ) : null}
      {offer.code && !offer.cta_url ? (
        <span className="rounded-full bg-wash-yellow px-3 py-1.5 text-[13px] font-bold">
          Code {offer.code}
        </span>
      ) : null}
    </div>
    </div>
  </motion.div>
);

const Dock = ({ offer, onOpen }) => (
  <motion.button
    type="button"
    initial={{ x: -56, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -56, opacity: 0 }}
    transition={{ duration: 0.3 }}
    onClick={onOpen}
    aria-label="Show current offers"
    data-testid="offers-dock"
    className="group no-print fixed left-0 top-1/2 z-40 -translate-y-1/2 rounded-r-xl bg-yellow text-ink shadow-lg lg:left-6"
    style={{ writingMode: "vertical-rl" }}
  >
    <span className="flex items-center gap-2 px-2 py-4 text-[13px] font-bold tracking-[0.2em] text-ink">
      <CalendarDays className="h-4 w-4" />
      OFFERS
    </span>
    {/* The button sets writing-mode vertical for the label; the tooltip is a
      sibling span, so reset it to read horizontally. */}
    <span
      style={{ writingMode: "horizontal-tb" }}
      className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-[13px] font-bold text-paper opacity-0 transition-opacity group-hover:opacity-100"
      data-testid="offers-dock-tooltip"
    >
      {offer?.title || "Bring the offer back"}
    </span>
  </motion.button>
);

export function OfferCenter() {
  const [offers, setOffers] = useState([]);
  const [openSlug, setOpenSlug] = useState(null);
  const [dismissed, setDismissed] = useState(getDismissed);
  const [shownThisSession, setShownThisSession] = useState(false);
  const scrolled = useReachedRatio(0.4);

  useEffect(() => {
    fetchActiveOffers()
      .then(setOffers)
      .catch(() => setOffers([]));
  }, []);

  // The API sorts active offers by starts_at desc, so the first entry is the
  // most recent. autoShowTarget = newest offer this visitor hasn't dismissed.
  const autoShowTarget = offers.find((o) => !dismissed.includes(o.slug));
  // bringBack = the newest offer this visitor DID dismiss (what the dock
  // re-opens).
  const bringBack = offers.find((o) => dismissed.includes(o.slug));

  // Auto-show once, at 40% scroll, only for an offer not yet dismissed.
  useEffect(() => {
    if (scrolled && autoShowTarget) {
      setOpenSlug(autoShowTarget.slug);
      setShownThisSession(true);
    }
  }, [scrolled, autoShowTarget]);

  const openOffer = openSlug ? offers.find((o) => o.slug === openSlug) : null;

  const dismiss = useCallback(() => {
    if (!openOffer) return;
    setOpenSlug(null);
    setDismissed((prev) => (prev.includes(openOffer.slug) ? prev : [...prev, openOffer.slug]));
    markDismissed(openOffer.slug);
  }, [openOffer]);

  const openFromDock = () => {
    const target = bringBack || autoShowTarget;
    if (target) {
      setOpenSlug(target.slug);
      setShownThisSession(true);
    }
  };

  // The dock is worth showing once an offer has appeared this session or one
  // was dismissed before — i.e. there is something to bring back.
  const dockRelevant =
    (bringBack != null || shownThisSession) && openOffer == null;

  const dockOffer = bringBack || openOffer;

  return (
    <AnimatePresence>
      {openOffer ? <Banner offer={openOffer} onDismiss={dismiss} /> : null}
      {dockRelevant && dockOffer ? <Dock offer={dockOffer} onOpen={openFromDock} /> : null}
    </AnimatePresence>
  );
}

export default OfferCenter;
