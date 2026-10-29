import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ImagePlus, MapPin, Building2 } from "lucide-react";
import { Container, MonoLabel, Reveal, SectionHeader, Placeholder } from "@/components/site/shared";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { fetchGallery } from "@/lib/cmsAdmin";

/**
 * The photo gallery lives as a section on the Projects page — every project's
 * data is right where the user is already browsing. Up to ten featured
 * projects, each carrying a small set of on-site photos; tap any to open the
 * lightbox. Admins manage the set through the backend.
 */
export default function GallerySection() {
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["cms-gallery"],
    queryFn: () => fetchGallery(),
    retry: false,
  });
  const [lightbox, setLightbox] = useState(null); // { item, index }

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
    <section id="gallery" className="section-gb" data-testid="gallery-section">
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

      <Container className="mt-12">
        {isLoading ? (
          <p className="py-16 text-center font-mono text-[14px] text-ink/50" data-testid="gallery-loading">
            Loading photos…
          </p>
        ) : shown.length === 0 ? (
          <div className="card-gb p-10 text-center" data-testid="gallery-empty">
            <p className="font-bold text-[18px]">Featured projects coming soon.</p>
            <p className="mt-2 text-[14px] text-ink/60">
              Photo sets for our featured homes are being curated — browse the project list above in the meantime.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2" data-testid="gallery-grid">
            {shown.map((p, i) => {
              const photos = Array.isArray(p.photos) ? p.photos : [];
              const cover = p.cover_image_url || photos[0] || null;
              return (
                <Reveal key={p.slug} delay={(i % 2) * 0.06} data-testid={`gallery-entry-${p.slug}`}>
                  <article className="card-gb overflow-hidden bg-paper">
                    <div className="p-4 pb-0">
                      <button
                        onClick={() => openLightbox(p, 0)}
                        aria-label={`Open ${p.title} photos`}
                        className="relative block aspect-[16/10] w-full overflow-hidden rounded-xl border border-divider bg-[#E9E9E6]"
                        data-testid={`gallery-open-${p.slug}`}
                      >
                        {cover ? (
                          <img
                            src={cover}
                            alt={p.title}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                          />
                        ) : (
                          <Placeholder code="PHOTO" label={p.locality} ratio="h-full w-full" className="rounded-xl" />
                        )}
                        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/55 to-transparent" />
                        <span className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-1.5 text-paper">
                          <ImagePlus className="h-4 w-4" />
                          <span className="font-mono text-[12px]">{photos.length || 0} photos</span>
                        </span>
                      </button>
                      {photos.length > 1 && (
                        <div className="mt-2.5 grid grid-cols-4 gap-2" data-testid={`gallery-thumbs-${p.slug}`}>
                          {photos.slice(1, 5).map((src, ti) => (
                            <button
                              key={ti}
                              onClick={() => openLightbox(p, ti + 1)}
                              aria-label={`Open photo ${ti + 2} of ${p.title}`}
                              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-divider bg-[#E9E9E6]"
                              data-testid={`gallery-thumb-${p.slug}-${ti + 1}`}
                            >
                              <img src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                            </button>
                          ))}
                          {photos.length > 5 && (
                            <div className="grid aspect-[4/3] place-items-center rounded-lg border border-divider bg-[#E9E9E6] font-mono text-[12px] text-ink/60">
                              +{photos.length - 5}
                            </div>
                          )}
                        </div>
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
      </Container>

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
    </section>
  );
}
