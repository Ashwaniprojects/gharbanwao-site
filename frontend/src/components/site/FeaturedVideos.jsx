import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Container, Reveal, SectionHeader } from "./shared";
import { VIDEOS } from "@/data/content";
import { fetchVideos } from "@/lib/cmsAdmin";

// The admin-published video URL can be a full YouTube watch/embed or an
// Instagram reel link. We can only embed YouTube, so pull a v= id out of a
// YouTube URL; anything else is treated as an external link with a poster.
const youtubeId = (url) => {
  const m = String(url || "").match(/[?&]v=([\w-]{6,16})|youtu\.be\/([\w-]{6,16})|youtube\.com\/embed\/([\w-]{6,16})/);
  return m ? m[1] || m[2] || m[3] : null;
};

// The admin manages the live set through the backend; when that list is empty
// (or the endpoint has not been deployed yet) the bundled set still renders,
// so the section never goes blank. Six slots.
const mergeVideos = (live) => {
  if (Array.isArray(live) && live.length) {
    return live.map((v) => ({
      key: `live-${v.slug}`,
      title: v.title,
      id: youtubeId(v.video_url),
      thumb: v.thumbnail_url,
      url: v.id ? null : v.video_url,
    }));
  }
  return VIDEOS.map((v) => ({ key: v.id, title: v.title, id: v.id, thumb: null, url: null }));
};

export const FeaturedVideos = () => {
  const [live, setLive] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    fetchVideos()
      .then(setLive)
      .catch(() => setLive([]));
  }, []);

  const videos = mergeVideos(live).slice(0, 6);

  return (
    <section className="section-gb bg-wash-yellow" data-testid="featured-videos-section">
      <Container className="max-w-6xl">
        <SectionHeader
          label="FEATURED VIDEO REVIEWS · CUSTOMER HOMES"
          title="Watch the homes Ghar Banwao has built."
          supporting="Unedited walk-throughs with the families who lived the build — no scripts, no voiceovers, just homeowners showing you what we delivered."
          align="center"
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((v, i) => (
            <Reveal key={v.key} delay={i * 0.05}>
              {v.id ? (
                <button
                  onClick={() => setOpen(v)}
                  className="group w-full text-left card-gb p-3 bg-paper"
                  data-testid={`featured-video-card-${i + 1}`}
                >
                  <div className="relative aspect-video overflow-hidden rounded-2xl border border-divider bg-[#E9E9E6]">
                    <img
                      src={v.thumb || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                      alt={v.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 grid place-items-center bg-ink/0 group-hover:bg-ink/10 transition-colors duration-300">
                      <span className="h-14 w-14 rounded-full bg-green grid place-items-center shadow-lg transition-transform group-hover:scale-110">
                        <Play className="h-5 w-5 fill-paper text-paper ml-0.5" />
                      </span>
                    </span>
                  </div>
                  <div className="p-3 pt-4">
                    <p className="font-bold text-[15px] leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">{v.title}</p>
                  </div>
                </button>
              ) : (
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full text-left card-gb p-3 bg-paper"
                  data-testid={`featured-video-card-${i + 1}`}
                >
                  <div className="relative aspect-video overflow-hidden rounded-2xl border border-divider bg-[#E9E9E6]">
                    {v.thumb ? (
                      <img src={v.thumb} alt={v.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-[13px] font-semibold text-ink/50">Watch on the platform</div>
                    )}
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="h-14 w-14 rounded-full bg-green grid place-items-center shadow-lg transition-transform group-hover:scale-110">
                        <Play className="h-5 w-5 fill-paper text-paper ml-0.5" />
                      </span>
                    </span>
                  </div>
                  <div className="p-3 pt-4">
                    <p className="font-bold text-[15px] leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">{v.title}</p>
                  </div>
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </Container>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)} data-testid="featured-video-lightbox">
        <DialogContent className="max-w-3xl rounded-2xl border-divider p-3" data-testid="featured-video-dialog">
          <DialogTitle className="sr-only">{open?.title}</DialogTitle>
          {open && open.id && (
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
    </section>
  );
};

export default FeaturedVideos;
