import { useState } from "react";
import { ArrowRight, Play, Star } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa6";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Container, Reveal, SectionHeader, Stars } from "@/components/site/shared";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/FaqCtaFooter";
import { VIDEOS } from "@/data/content";
import { TESTIMONIALS } from "@/data/content";
import { WHATSAPP_URL } from "@/data/content";

const VIDEO_REVIEWS = VIDEOS;

const StarRow = ({ rating }) => (
  <span className="inline-flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} className={`h-3.5 w-3.5 ${n <= rating ? "fill-[#FFD21F] star-gb" : "fill-none text-gray-300"}`} strokeWidth={1.5} />
    ))}
  </span>
);

export default function ReviewsPage() {
  const [open, setOpen] = useState(null);

  return (
    <div className="min-h-screen bg-paper text-ink" data-testid="reviews-page">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="section-gb pt-24 md:pt-28" data-testid="reviews-hero">
          <Container className="max-w-5xl">
            <SectionHeader
              label="6 CUSTOMER REVIEWS · WATCH THE HOMES"
              title="Hear It from Our Happy Homeowners. --- Happy Customer Reviews"
              supporting="Shot in front of their completed homes. Their words, their language."
              align="center"
            />
            <Reveal className="mt-6 flex justify-center">
              <p className="text-[15px] text-ink/60 text-center max-w-[60ch]">
                Each video is an unedited walk-through with the family that lived the build. No scripts, no voiceovers — just homeowners showing you what we delivered.
              </p>
            </Reveal>
            <Reveal className="mt-8 flex flex-wrap items-center justify-center gap-3" delay={0.05}>
              <a
                href="https://www.youtube.com/@gharbanwao"
                target="_blank"
                rel="noreferrer"
                className="pill-ghost h-12 px-6 text-[15px]"
                data-testid="reviews-youtube-link"
              >
                <FaYoutube className="h-[18px] w-[18px] text-[#FF0000]" strokeWidth={2.5} /> YouTube
              </a>
              <a
                href="https://www.instagram.com/gharbanwao/"
                target="_blank"
                rel="noreferrer"
                className="pill-ghost h-12 px-6 text-[15px]"
                data-testid="reviews-instagram-link"
              >
                <FaInstagram className="h-[18px] w-[18px] text-[#D62976]" strokeWidth={2.5} /> Instagram
              </a>
            </Reveal>
          </Container>
        </section>

        {/* Video Reviews */}
        <section className="section-gb bg-wash-yellow" data-testid="reviews-video-section">
          <Container className="max-w-6xl">
            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {VIDEO_REVIEWS.map((v, i) => (
                <Reveal key={v.id} delay={i * 0.06}>
                  <button
                    onClick={() => setOpen(v)}
                    className="group w-full text-left card-gb p-3 bg-paper"
                    data-testid={`review-card-${i + 1}`}
                  >
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-divider bg-[#E9E9E6]">
                      <img
                        src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                        alt={v.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 grid place-items-center bg-ink/0 group-hover:bg-ink/10 transition-colors duration-300">
                        <span className="h-16 w-16 rounded-full bg-green grid place-items-center shadow-lg transition-transform group-hover:scale-110">
                          <Play className="h-6 w-6 fill-paper text-paper ml-1" />
                        </span>
                      </span>
                    </div>
                    <div className="p-3 pt-4">
                      <p className="font-bold text-[15px] leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
                        {v.title}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-[13px] text-ink/60">
                        <span className="font-mono">▶ YouTube</span>
                        <span className="text-divider">|</span>
                        <span>Customer review</span>
                      </div>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* Google Reviews Section */}
        <section className="section-gb" data-testid="reviews-google-section">
          <Container className="max-w-6xl">
            <SectionHeader
              label="GOOGLE REVIEWS · 4.9 / 5 AVERAGE"
              title="What our customers say on Google"
              supporting="Over 200+ verified reviews from homeowners across Lucknow and 8 UP cities."
              align="center"
            />
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TESTIMONIALS.map((r, i) => {
                const len = r.quote.length;
                const colSpan = len > 280 ? "sm:col-span-2 lg:col-span-2" : len > 130 ? "sm:col-span-2 lg:col-span-2" : "";
                return (
                  <Reveal key={r.project_id || i} delay={(i % 6) * 0.04}>
                    <div
                      className={`card-gb p-5 md:p-6 flex flex-col ${colSpan}`}
                      data-testid={`google-review-${i + 1}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-[15px]">{r.name}</p>
                          <p className="text-[12px] text-ink/50 font-mono mt-0.5">{r.locality} &middot; {r.date}</p>
                        </div>
                        <span className="shrink-0 bg-green/10 text-green-700 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full">{r.rating}.0</span>
                      </div>
                      <div className="mt-2.5">
                        <StarRow rating={r.rating} />
                      </div>
                      <p className="mt-3 text-[14px] text-ink/75 leading-relaxed line-clamp-4">&ldquo;{r.quote}&rdquo;</p>
                      {r.project_id && (
                        <p className="mt-3 text-[12px] font-mono text-ink/40">Project {r.project_id}</p>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <Reveal className="mt-12 text-center">
              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noreferrer"
                className="pill-green h-12 px-6 text-[15px]"
                data-testid="reviews-google-link"
              >
                Read all reviews on Google <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
              </a>
            </Reveal>
          </Container>
        </section>

        {/* CTA */}
        <section className="section-gb" data-testid="reviews-cta-section">
          <Container className="max-w-3xl text-center">
            <Reveal>
              <SectionHeader
                label="STILL HAVE QUESTIONS?"
                title="Talk to someone who built with us."
                supporting="Free consultation. No commitment. We call you within 2 hours on business days."
                align="center"
              />
            </Reveal>
            <Reveal className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="pill-yellow h-12 px-6 text-[15px]"
                data-testid="reviews-whatsapp-cta"
              >
                Chat on WhatsApp
              </a>
              <a
                href="tel:09648249999"
                className="pill-green h-12 px-6 text-[15px]"
                data-testid="reviews-call-cta"
              >
                Call 09648249999 <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
              </a>
            </Reveal>
          </Container>
        </section>
      </main>

      <Footer />

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)} data-testid="review-lightbox">
        <DialogContent className="max-w-3xl rounded-2xl border-divider p-3" data-testid="review-dialog-content">
          <DialogTitle className="sr-only">{open?.title}</DialogTitle>
          {open && (
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${open.id}?autoplay=1&rel=0`}
                title={open.title}
                allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
