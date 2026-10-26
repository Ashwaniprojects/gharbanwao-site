import { useState } from "react";
import Marquee from "react-fast-marquee";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Container, Reveal, SectionHeader, Stars } from "./shared";
import { TESTIMONIALS, VIDEOS } from "@/data/content";
const HOME_VIDEOS = VIDEOS.slice(0, 6);

const TCard = ({ t }) => (
  <article className="w-[300px] md:w-[380px] shrink-0 mx-2.5 card-gb p-6 flex flex-col bg-paper h-full" data-testid="testimonial-card">
    <div>
      <p className="font-bold text-[17px] leading-tight">{t.name}</p>
      <p className="text-[14px] text-ink/60">{t.locality}</p>
    </div>
    <p className="mt-4 text-[13px] flex items-center gap-2"><Stars n={t.rating} /> <span className="text-ink/60">{t.source} · {t.date}</span></p>
    <p className="mt-4 text-[15px] leading-relaxed line-clamp-5">&ldquo;{t.quote}&rdquo;</p>
    {t.project_id && (
      <div className="mt-auto pt-4 border-t border-divider flex items-center gap-3">
        <p className="text-[13px] leading-tight font-mono font-medium">{t.project_id}</p>
        <a href={`/projects/${t.project_id.toLowerCase()}`} onClick={(e) => e.preventDefault()} className="ml-auto inline-flex items-center gap-1 text-[13px] font-bold underline decoration-green decoration-2 underline-offset-4">View project <ArrowRight className="h-3.5 w-3.5" /></a>
      </div>
    )}
  </article>
);

export const Testimonials = () => {
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rows = [TESTIMONIALS.slice(0, 15), TESTIMONIALS.slice(15)];
  return (
    <section id="testimonials" className="section-gb border-t border-divider overflow-hidden" data-testid="testimonials-section">
      <Container>
        <SectionHeader title="Built on Trust. Backed by Google Reviews." supporting="Discover what homeowners say about their experience building with Ghar Banwao from the first consultation to the final handover." />
      </Container>
      <div className="mt-14 space-y-5">
        {reduce ? (
          <Container className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{TESTIMONIALS.map((t) => <TCard key={t.name} t={t} />)}</Container>
        ) : (
          rows.map((row, i) => (
            <Marquee key={i} speed={i === 0 ? 40 : 32} direction={i === 0 ? "left" : "right"} pauseOnHover gradient gradientColor="#FFFFFF" gradientWidth={80} className={i === 1 ? "hidden md:flex" : ""} data-testid={`testimonial-marquee-${i + 1}`}>
              {row.map((t) => <TCard key={t.name} t={t} />)}
            </Marquee>
          ))
        )}
      </div>
      <Container className="mt-10">
        <a href="https://www.google.com/maps/search/?api=1&query=Ghar+Banwao+Indira+Nagar+Lucknow" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-bold underline decoration-green decoration-2 underline-offset-4" data-testid="testimonials-google-link">See all 180+ Google reviews <ArrowRight className="h-4 w-4" /></a>
      </Container>
    </section>
  );
};

export const VideoTestimonials = () => {
  const [open, setOpen] = useState(null);
  return (
    <section className="section-gb bg-wash-yellow" data-testid="video-testimonials-section">
      <Container>
        <SectionHeader title="Trusted by Homeowners, Proven by Their Experiences." supporting="Hear directly from our customers about their journey with Ghar Banwao—from the first plan to the final handover." />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {HOME_VIDEOS.map((v, i) => (
            <Reveal key={v.id} delay={i * 0.05}>
              <button onClick={() => setOpen(v)} className="group w-full text-left card-gb p-3 bg-paper" data-testid={`video-card-${i + 1}`}>
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-divider bg-[#E9E9E6]">
                  <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt={v.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="h-16 w-16 rounded-full bg-green grid place-items-center shadow-lg transition-transform group-hover:scale-110">
                      <Play className="h-6 w-6 fill-paper text-paper ml-1" />
                    </span>
                  </span>
                </div>
                <div className="p-3 pt-4">
                  <p className="font-bold text-[16px] leading-snug line-clamp-2">{v.title}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <Link to="/reviews" className="inline-flex items-center gap-1.5 font-bold underline decoration-green decoration-2 underline-offset-4" data-testid="more-videos-link">More Videos <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>
      </Container>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-3xl rounded-2xl border-divider p-3" data-testid="video-lightbox">
          <DialogTitle className="sr-only">{open?.title}</DialogTitle>
          {open && (
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${open.id}?autoplay=1&rel=0`} title={open.title} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

