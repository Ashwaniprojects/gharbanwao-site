import { ArrowRight, Star } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa6";
import { Container, Reveal, SectionHeader, Stars } from "@/components/site/shared";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/FaqCtaFooter";
import { TESTIMONIALS } from "@/data/content";
import { WHATSAPP_URL } from "@/data/content";
import { GoogleReviews } from "@/components/site/GoogleReviews";
import { FeaturedVideos } from "@/components/site/FeaturedVideos";

const StarRow = ({ rating }) => (
  <span className="inline-flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} className={`h-3.5 w-3.5 ${n <= rating ? "fill-[#FFD21F] star-gb" : "fill-none text-gray-300"}`} strokeWidth={1.5} />
    ))}
  </span>
);

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-paper text-ink" data-testid="reviews-page">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="section-gb pt-10 md:pt-16" data-testid="reviews-hero">
          <Container className="max-w-5xl">
            <SectionHeader
              label="6 CUSTOMER REVIEWS · WATCH THE HOMES"
              title="Trusted by Homeowners, Proven by Their Experiences."
              supporting="Hear directly from our customers about their journey with Ghar Banwao—from the first plan to the final handover."
              align="center"
              className="lg:[&_h2]:whitespace-nowrap lg:[&_h2]:!text-4xl"
            />
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

        {/* Featured video reviews — admin-published via the backend, with the
            bundled set as the fallback so the section never runs empty. */}
        <FeaturedVideos />

        {/* Live Google embed */}
        <GoogleReviews />

        {/* Curated Google Reviews wall */}
        <section className="section-gb" data-testid="reviews-google-section">
          <Container className="max-w-6xl">
            <SectionHeader
              label="GOOGLE REVIEWS · 4.9 / 5 AVERAGE"
              title="Built on Trust. Backed by Google Reviews."
              supporting="Discover what homeowners say about their experience building with Ghar Banwao from the first consultation to the final handover."
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
                href="https://www.google.com/maps/search/?api=1&query=Ghar+Banwao+Indira+Nagar+Lucknow"
                target="_blank"
                rel="noopener noreferrer"
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
    </div>
  );
}
