import { useEffect, useState } from "react";
import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { FinalCTA, Footer, MobileBar } from "@/components/site/FaqCtaFooter";
import { Container, MonoLabel, Reveal, SectionHeader, Placeholder } from "@/components/site/shared";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Hammer,
  MapPin,
  Quote,
  Ruler,
} from "lucide-react";
import { fetchProjects } from "@/lib/api";
import { fetchProjects as fetchCmsProjects } from "@/lib/cmsAdmin";
import { PHONES, WHATSAPP_URL } from "@/data/content";
import { Image as CmsImage } from "@/components/site/shared";

const STAGES = ["Design", "Foundation", "Structure", "Brickwork", "Finishing", "Handover"];
const SITE = "https://gharbanwao.com";

// Turn a pasted YouTube / Instagram link into something we can embed inline.
// Anything else falls through to a plain "watch on X" link rather than a guess.
const toEmbed = (raw) => {
  const url = String(raw || "").trim();
  if (!url) return null;
  let m = url.match(/(?:youtu\.be\/|[?&]v=|youtube\.com\/(?:embed|shorts)\/)([\w-]{11})/);
  if (m) return { kind: "youtube", id: m[1], src: `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0` };
  m = url.match(/instagram\.com\/(?:reel|p|tv)\/([\w.-]+)/);
  if (m) return { kind: "instagram", id: m[1], src: `https://www.instagram.com/p/${m[1]}/embed/` };
  return { kind: "external", src: url };
};

const ReviewVideo = ({ url }) => {
  const embed = toEmbed(url);
  if (!embed) return null;
  if (embed.kind === "youtube") {
    return (
      <div className="mt-4 overflow-hidden rounded-2xl border border-divider bg-black" data-testid="project-review-video">
        <iframe
          className="aspect-video w-full"
          src={embed.src}
          title="Project review video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  if (embed.kind === "instagram") {
    return (
      <div className="mt-4 overflow-hidden rounded-2xl border border-divider" data-testid="project-review-video">
        <iframe className="w-full" style={{ height: 500 }} src={embed.src} title="Project review video" allow="encrypted-media" />
      </div>
    );
  }
  return (
    <a
      href={embed.src}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-2 rounded-full border border-divider px-4 h-10 text-[14px] font-bold hover:border-green-700 hover:text-green-700"
      data-testid="project-review-video"
    >
      ▶ Watch the review video
    </a>
  );
};

/*
 * Two project sources: the CMS (admin-managed, with real photos) and the
 * static map seed (297 pins). The CMS wins — an admin-published project is
 * the freshest record — and the map record fills any field the CMS project
 * left empty (plot, size, stage, quote).
 */
function normalizeCms(p) {
  const photos = Array.isArray(p.photos) ? p.photos : [];
  return {
    ...p,
    from_cms: true,
    status: p.status === "handed_over" ? "handed_over" : "ongoing",
    gb_id: p.gb_id || "",
    photos,
    cover_image_url: p.cover_image_url || photos[0] || null,
    plot: p.plot_dimensions || "",
    size_sqft: p.size_sqft || p.area_sqft || null,
    stage: p.stage ? Math.min(Number(p.stage), STAGES.length) : 6,
    stage_name: p.stage_name || (p.status === "handed_over" ? "Handed over" : ""),
    handover: p.handover || (p.status === "handed_over" ? String(p.handover_date || "").slice(0, 4) : ""),
    owner: p.owner || "",
    quote: p.quote || p.summary || "",
    lat: p.lat ?? null,
    lng: p.lng ?? null,
  };
}

export default function ProjectDetail() {
  const { gbId } = useParams();
  const [project, setProject] = useState(null);
  const [siblings, setSiblings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    const cmsPromise = fetchCmsProjects()
      .then((cms) =>
        cms.find((p) => p.slug.toLowerCase() === gbId.toLowerCase()) ||
        cms.find((p) => p.gb_id && p.gb_id.toLowerCase() === gbId.toLowerCase()) ||
        null,
      )
      .catch(() => null);

    cmsPromise.then((cmsMatch) => {
      fetchProjects({ limit: 500 })
        .then((all) => {
          const byCode = all.find((p) => p.gb_id.toLowerCase() === gbId.toLowerCase()) || null;
          const base = cmsMatch ? normalizeCms(cmsMatch) : byCode;
          if (!base) {
            setProject(null);
            return;
          }
          // Merge: CMS fields win, map seed fills the gaps it knows.
          const merged = { ...(byCode || {}), ...base };
          merged.size_sqft = base.size_sqft || byCode?.size_sqft || null;
          merged.plot = base.plot || byCode?.plot || "";
          merged.stage = base.from_cms ? merged.stage : base.stage;
          setProject(merged);
          setSiblings(
            all.filter((p) => p.locality === merged.locality && p.gb_id !== merged.gb_id).slice(0, 3),
          );
        })
        .catch(() => setProject(cmsMatch ? normalizeCms(cmsMatch) : null))
        .finally(() => setLoading(false));
    });
  }, [gbId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <AnnouncementStrip />
        <Navbar />
        <main className="section-gb">
          <Container>
            <p className="py-16 text-center font-mono text-[14px] text-ink/50">Loading project…</p>
          </Container>
        </main>
        <Footer />
        <MobileBar />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <AnnouncementStrip />
        <Navbar />
        <main>
          <section className="section-gb">
            <Container className="max-w-2xl">
              <p className="rounded-2xl border border-divider bg-wash-yellow px-6 py-10 text-center text-[15px] leading-relaxed text-ink/70">
                We could not find project{" "}
                <span className="font-mono font-bold text-ink">{gbId}</span>. It may have been
                completed or the code changed.{" "}
                <Link to="/" className="font-bold text-green-700 underline">
                  Back to all projects
                </Link>
                .
              </p>
            </Container>
          </section>
          <FinalCTA />
        </main>
        <Footer />
        <MobileBar />
      </div>
    );
  }

  const ongoing = project.status === "ongoing";
  const stagePct = ongoing ? Math.min(100, (project.stage / STAGES.length) * 100) : 100;

  return (
    <div className="min-h-screen bg-paper text-ink" data-testid="project-detail-page">
      <Helmet>
        <title>{`${project.gb_id} · ${project.locality}, ${project.city} | Ghar Banwao`}</title>
        <meta
          name="description"
          content={`${project.size_sqft.toLocaleString("en-IN")} sq ft ${project.package} package home in ${project.locality}, ${project.city}. ${ongoing ? `Now in the ${project.stage_name || "construction"} stage.` : `Handed over ${project.handover}.`}`}
        />
        <link rel="canonical" href={`${SITE}/projects/${gbId}`} />
        <meta property="og:title" content={`${project.gb_id} · ${project.locality}, ${project.city}`} />
        <meta property="og:description" content={project.quote} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Residence",
              name: `${project.gb_id} — ${project.locality}`,
              address: {
                "@type": "PostalAddress",
                addressLocality: project.locality,
                addressRegion: "Uttar Pradesh",
                addressCountry: "IN",
              },
              description: project.quote,
            }),
          }}
        />
      </Helmet>
      <AnnouncementStrip />
      <Navbar />
      <main>
        {/* Header */}
        <section className="section-gb bg-wash-yellow">
          <Container>
            <Link to="/" className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink/60 hover:text-green-700">
              <ArrowLeft className="h-4 w-4" /> All projects
            </Link>
            <div className="mt-6 grid gap-8 lg:grid-cols-2 items-center">
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="mono-label text-green-700">{project.gb_id}</span>
                  <span
                    className={`font-mono text-[11px] uppercase tracking-[0.08em] px-2 py-1 rounded ${
                      ongoing ? "bg-yellow" : "bg-green"
                    }`}
                  >
                    {ongoing ? "Ongoing" : "Handed over"}
                  </span>
                </div>
                <h1 className="display mt-3 text-[34px] md:text-[46px] leading-[1.05] tracking-tight">
                  {project.locality}, <span className="text-green-700">{project.city}</span>
                </h1>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-[15px] text-ink/70">
                  {project.size_sqft || project.plot ? (
                    <span className="inline-flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-green-700" />
                      {[project.plot, project.size_sqft ? `${Number(project.size_sqft).toLocaleString("en-IN")} sqft` : ""]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  ) : null}
                  {project.package ? (
                    <span className="inline-flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-green-700" /> {project.package} package
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-2">
                    {ongoing ? <Hammer className="h-4 w-4 text-green-700" /> : <CheckCircle2 className="h-4 w-4 text-green-700" />}
                    {ongoing ? `${project.stage_name || "In progress"}` : `Handed over ${project.handover || ""}`.trim()}
                  </span>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="overflow-hidden rounded-2xl border border-divider" data-testid="project-detail-hero">
                  {project.cover_image_url ? (
                    <CmsImage src={project.cover_image_url} alt={project.title || project.gb_id} ratio="aspect-[16/10]" />
                  ) : (
                    <Placeholder
                      code={`IMG-${(project.gb_id || "000").slice(3)}`}
                      ratio="aspect-[16/10]"
                      label={project.locality}
                    />
                  )}
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* Body */}
        <section className="section-gb">
          <Container className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionHeader title="The build" />
              {project.summary ? (
                <p className="mt-6 text-[16px] leading-relaxed text-ink/80" data-testid="project-summary">{project.summary}</p>
              ) : (
                <p className="mt-6 text-[16px] leading-relaxed text-ink/80" data-testid="project-summary">
                  A {project.size_sqft ? `${Number(project.size_sqft).toLocaleString("en-IN")} square foot ` : ""}
                  {project.package ? `${project.package}-package ` : ""}home in {project.locality}, {project.city}.{" "}
                  {project.plot ? `The plot is ${project.plot.toLowerCase()}, ` : ""}
                  {ongoing ? "construction is underway" : "the work was completed and handed over"}
                  {!ongoing && project.handover ? ` in ${project.handover}` : ""}.
                </p>
              )}

              {Array.isArray(project.photos) && project.photos.length > 0 ? (
                <div className="mt-8" data-testid="project-photo-gallery">
                  <MonoLabel>PROJECT PHOTOS</MonoLabel>
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                    {project.photos.map((src, i) => (
                      <CmsImage
                        key={i}
                        src={src}
                        alt={`${project.gb_id} photo ${i + 1}`}
                        ratio={project.photos.length === 1 ? "aspect-[16/10]" : "aspect-[4/3]"}
                        className={project.photos.length === 1 ? "md:col-span-3" : ""}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-8 card-gb p-6 bg-wash-yellow">
                <div className="flex items-center gap-2">
                  <Quote className="h-5 w-5 text-green-700" />
                  <span className="mono-label text-green-700">OWNER SAYS</span>
                </div>
                <blockquote className="mt-3 text-[18px] font-medium leading-relaxed text-ink">
                  “{project.quote}”
                </blockquote>
                <p className="mt-3 text-[14px] text-ink/60">— {project.owner}</p>
              </div>

              {(project.review_text || project.review_video_url) ? (
                <div className="mt-8 card-gb p-6" data-testid="project-review">
                  <div className="flex items-center gap-2">
                    <Quote className="h-5 w-5 text-green-700" />
                    <span className="mono-label text-green-700">CLIENT REVIEW</span>
                  </div>
                  {project.review_text ? (
                    <p className="mt-3 text-[16px] leading-relaxed text-ink/85">{project.review_text}</p>
                  ) : null}
                  {project.review_video_url ? <ReviewVideo url={project.review_video_url} /> : null}
                </div>
              ) : null}

              {/* Stage progress */}
              <div className="mt-10">
                <h3 className="text-[20px] font-bold tracking-tight">
                  {ongoing ? "Where the build is now" : "Completion"}
                </h3>
                <div className="mt-5 card-gb p-6">
                  <div className="flex items-center justify-between text-[13px] font-mono text-ink/50">
                    <span>{ongoing ? `Stage ${String(project.stage).padStart(2, "0")} of ${STAGES.length}` : "Complete"}</span>
                    <span>{Math.round(stagePct)}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-divider">
                    <div className="h-full rounded-full bg-green" style={{ width: `${stagePct}%` }} />
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {STAGES.map((s, i) => {
                      const done = ongoing ? i < project.stage : true;
                      return (
                        <div key={s} className="text-center">
                          <div
                            className={`mx-auto grid h-8 w-8 place-items-center rounded-full border text-[11px] font-bold ${
                              done ? "border-green bg-green text-ink" : "border-divider text-ink/40"
                            }`}
                          >
                            {i + 1}
                          </div>
                          <p className="mt-1.5 text-[11px] font-medium text-ink/60">{s}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="card-gb sticky top-24 p-6">
                <MonoLabel>PROJECT SPECS</MonoLabel>
                <dl className="mt-4 grid gap-4 text-[14px]">
                  {[
                    ["Reference", project.gb_id],
                    ["Locality", project.locality],
                    ["City", project.city],
                    ["Plot", project.plot],
                    ["Built area", `${project.size_sqft.toLocaleString("en-IN")} sq ft`],
                    ["Package", project.package],
                    ["Status", ongoing ? "Ongoing" : `Handed over · ${project.handover}`],
                    ["Owner", project.owner],
                  ].map(([k, v]) => (
                    <div key={k} className="border-b border-divider pb-3">
                      <dt className="mono-label text-[11px] text-ink/40">{k.toUpperCase()}</dt>
                      <dd className="mt-1 font-semibold text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>

                <a
                  href={`https://www.openstreetmap.org/?mlon=${project.lng}&mlat=${project.lat}&zoom=16`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-green-700 hover:underline"
                  data-testid="project-map-link"
                >
                  <MapPin className="h-4 w-4" /> See {project.locality} on the map
                </a>

                <div className="mt-6 flex flex-col gap-2">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="pill-yellow h-11 text-[14px] inline-flex items-center justify-center gap-2">
                    Ask about this build
                  </a>
                  <a href={`tel:${PHONES[0]}`} className="pill-ghost h-11 text-[14px]">
                    Call {PHONES[0]}
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Related */}
        {siblings.length > 0 && (
          <section className="section-gb bg-wash-yellow">
            <Container>
              <SectionHeader title={`More homes in ${project.locality}`} />
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {siblings.map((p, i) => (
                  <Reveal key={p.gb_id} delay={i * 0.05}>
                    <Link to={`/projects/${p.gb_id.toLowerCase()}`} className="card-gb p-5 bg-paper h-full flex flex-col group">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[13px]">{p.gb_id}</span>
                        <span className={`font-mono text-[10px] uppercase tracking-[0.08em] px-2 py-0.5 rounded ${p.status === "ongoing" ? "bg-yellow" : "bg-green"}`}>
                          {p.status === "ongoing" ? "Ongoing" : "Done"}
                        </span>
                      </div>
                      <p className="mt-3 text-[16px] font-bold group-hover:text-green-700 transition-colors">
                        {p.size_sqft.toLocaleString("en-IN")} sqft · {p.package}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-green-700">
                        View project <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        )}

        <FinalCTA />
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
