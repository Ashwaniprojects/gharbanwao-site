import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ImagePlus, MapPin, Building2, X } from "lucide-react";
import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { FinalCTA, Footer, MobileBar } from "@/components/site/FaqCtaFooter";
import { Container, MonoLabel, Reveal, SectionHeader, Image, Placeholder } from "@/components/site/shared";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { fetchGallery } from "@/lib/cmsAdmin";

const SITE = "https://gharbanwao.com";

// Up to ten featured projects, each with 3-5 photos. The admin manages the
// set through the backend; while it is empty (or the endpoint has not been
// deployed yet) the section shows an empty state instead of fabricated work.
export default function GalleryPage() {
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [lightbox, setLightbox] = useState(null); // { item, index }

  useEffect(() => {
    document.title = "Project Gallery — Ghar Banwao";
    fetchGallery()
      .then((items) => setEntries(items || []))
      .catch(() => setEntries([]))
      .finally(() => setLoaded(true));
  }, []);

  const shown = entries.slice(0, 10);

  const openLightbox = (item, index = 0) => setLightbox({ item, index });
  const step = (dir) => {
    setLightbox((lb) => {
      if (!lb) return lb;
      const photos = lb.item.photos || [];
      if (!photos.length) return lb;
      return { ...lb, index: (lb.index + dir + photos.length) % photos.length };
    });
  };

  return (
    <div className="min-h-screen bg-paper text-ink" data-testid="gallery-page">
      <Helmet>
        <title>Project Gallery — Ghar Banwao</title>
        <meta name="description" content="A photo-first tour of featured Ghar Banwao homes across Lucknow and Uttar Pradesh — from foundations to handover." />
        <link rel="canonical" href={`${SITE}/gallery`} />
      </Helmet>
      <AnnouncementStrip />
      <Navbar />
      <main>
        <section className="section-gb bg-wash-yellow">
          <Container className="max-w-4xl">
            <Reveal>
              <SectionHeader
                label="PROJECT GALLERY"
                title="Our featured homes, in photos."
                supporting="A photo-first look at the homes we have built across Lucknow and Uttar Pradesh. Each featured project carries a small set of on-site photos — tap any to see it full-screen."
                align="center"
              />
            </Reveal>
          </Container>
        </section>

        <section className="section-gb">
          <Container>
            {loaded && shown.length === 0 ? (
              <div className="card-gb p-10 text-center" data-testid="gallery-empty">
                <p className="font-bold text-[18px]">Featured projects coming soon.</p>
                <p className="mt-2 text-[14px] text-ink/60">
                  Photo sets for our featured homes are being curated. In the meantime, browse the full project list.
                </p>
                <Link to="/projects" className="pill-green h-11 mt-6 inline-flex px-6 text-[14px]">Browse all projects</Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2" data-testid="gallery-grid">
                {shown.map((p, i) => {
                  const photos = Array.isArray(p.photos) ? p.photos : [];
                  const cover = p.cover_image_url || photos[0] || null;
                  return (
                    <Reveal key={p.slug} delay={(i % 2) * 0.06} data-testid={`gallery-entry-${p.slug}`}>
                      <article className="card-gb overflow-hidden bg-paper">
                        <div className="grid grid-cols-4 grid-rows-2 gap-1.5 p-1.5">
                          <button
                            onClick={() => openLightbox(p, 0)}
                            className="col-span-4 row-span-2 relative overflow-hidden rounded-xl border border-divider bg-[#E9E9E6]"
                            data-testid={`gallery-open-${p.slug}`}
                          >
                            {cover ? (
                              <img src={cover} alt={p.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                            ) : (
                              <Placeholder code="PHOTO" label={p.locality} ratio="aspect-auto h-full w-full" />
                            )}
                            <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/60 to-transparent" />
                            <span className="absolute bottom-3 left-4 flex items-center gap-1.5 text-paper">
                              <ImagePlus className="h-4 w-4" />
                              <span className="font-mono text-[12px]">{photos.length || 0} photos</span>
                            </span>
                          </button>
                          {[1, 2, 3].map((n) =>
                            photos[n] ? (
                              <button
                                key={n}
                                onClick={() => openLightbox(p, n)}
                                className="relative overflow-hidden rounded-lg border border-divider bg-[#E9E9E6]"
                                data-testid={`gallery-thumb-${p.slug}-${n}`}
                              >
                                <img src={photos[n]} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                              </button>
                            ) : null
                          )}
                        </div>
                        <div className="flex flex-col p-5">
                          <MonoLabel>{[p.locality, p.city].filter(Boolean).join(", ") || "GHAR BANWAO"}</MonoLabel>
                          <h3 className="mt-2 text-[18px] font-bold leading-snug tracking-tight">{p.title}</h3>
                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink/60">
                            {p.area_sqft ? (
                              <span className="inline-flex items-center gap-1.5">
                                <Building2 className="h-3.5 w-3.5 text-green-700" /> {Number(p.area_sqft).toLocaleString("en-IN")} sqft
                              </span>
                            ) : null}
                            {p.package ? (
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-green-700" /> {p.package}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            )}
            <Reveal className="mt-12 text-center">
              <Link to="/projects" className="pill-ghost h-12 px-6 text-[15px] inline-flex items-center gap-2" data-testid="gallery-all-link">
                See the full project list
              </Link>
            </Reveal>
          </Container>
        </section>

        <FinalCTA />
      </main>
      <Footer />
      <MobileBar />

      <Dialog open={!!lightbox} onOpenChange={(o) => !o && setLightbox(null)} data-testid="gallery-lightbox">
        <DialogContent className="max-w-4xl rounded-2xl border-divider p-4" data-testid="gallery-lightbox-content">
          <DialogTitle className="sr-only">Photo</DialogTitle>
          {lightbox && (
            <div className="relative">
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-ink">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={lightbox.index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    src={(lightbox.item.photos || [lightbox.item.cover_image_url])[lightbox.index]}
                    alt={lightbox.item.title}
                    className="h-full w-full object-contain"
                  />
                </AnimatePresence>
              </div>
              <p className="mt-3 text-[14px] font-semibold">
                {lightbox.item.title}
                <span className="ml-2 font-mono text-[12px] text-ink/50">
                  {lightbox.index + 1} / {(lightbox.item.photos || [lightbox.item.cover_image_url]).length}
                </span>
              </p>
              {(lightbox.item.photos || [lightbox.item.cover_image_url]).length > 1 && (
                <div className="mt-3 flex items-center justify-between">
                  <button onClick={() => step(-1)} className="text-[13px] font-semibold underline underline-offset-4 decoration-green" data-testid="gallery-prev">
                    Previous
                  </button>
                  <button onClick={() => step(1)} className="text-[13px] font-semibold underline underline-offset-4 decoration-green" data-testid="gallery-next">
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
