import { useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import { Container, MonoLabel, Reveal } from "./shared";

/*
 * Live Google reviews. There is no official Google "reviews widget", so the
 * keyless, always-current live option is the Google Maps place embed
 * (output=embed), which shows the real listing, its rating and the latest
 * reviews Google has for it. The embed URL is env-overridable so the owner can
 * point it at their exact Google Business Profile without a rebuild; it falls
 * back to the Indira Nagar HQ address when unset.
 *
 * The iframe is best-effort: if it fails to load (offline, blocked), we keep a
 * "view on Google" button so the reviews are still reachable — the curated
 * Google reviews wall below always renders regardless.
 */

const PLACE_EMBED =
  process.env.REACT_APP_GOOGLE_REVIEW_EMBED ||
  "https://www.google.com/maps?q=Ghar+Banwao,+Indira+Nagar,+Lucknow,+Uttar+Pradesh+226016&output=embed";
const PLACE_LINK =
  process.env.REACT_APP_GOOGLE_REVIEW_LINK ||
  "https://www.google.com/maps/search/?api=1&query=Ghar+Banwao+Indira+Nagar+Lucknow";

export const GoogleReviews = () => {
  const [broken, setBroken] = useState(false);
  return (
    <section className="section-gb" data-testid="google-reviews-section">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <MonoLabel className="text-green-700">LIVE FROM GOOGLE</MonoLabel>
            <h2 className="display mt-2 text-[26px] md:text-[34px]">Straight from our Google profile</h2>
            <p className="mt-2 max-w-[58ch] text-[15px] text-ink/65">
              The rating and the most recent reviews are pulled live from Google — nothing below is a screenshot or edited.
            </p>
          </div>
          <a
            href={PLACE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-divider bg-paper px-4 h-11 text-[14px] font-bold hover:border-green-700 hover:text-green-700 transition-colors"
            data-testid="google-reviews-open-link"
          >
            <Star className="h-4 w-4 fill-[#FFD21F] text-[#FFD21F]" /> Open on Google <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <Reveal delay={0.05} className="mt-8">
          <div className="overflow-hidden rounded-2xl border border-divider bg-[#E9E9E6]" data-testid="google-reviews-frame">
            {broken ? (
              <div className="grid place-items-center gap-4 bg-paper py-16 text-center">
                <p className="max-w-[40ch] text-[15px] text-ink/60">
                  The live Google panel could not load right now. You can still open the full profile and reviews in a new tab.
                </p>
                <a
                  href={PLACE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-green h-12 px-6 text-[15px]"
                >
                  View Google reviews <ArrowRight className="h-[18px] w-[18px]" />
                </a>
              </div>
            ) : (
              <iframe
                src={PLACE_EMBED}
                title="Ghar Banwao Google reviews"
                className="h-[420px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                onError={() => setBroken(true)}
                data-testid="google-reviews-iframe"
              />
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
};
