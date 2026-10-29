import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { ArrowRight, Building2, CheckCircle2, Hammer, ImagePlus, MapPin } from "lucide-react";
import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { FinalCTA, Footer, MobileBar } from "@/components/site/FaqCtaFooter";
import { Container, MonoLabel, Reveal, Image, Placeholder } from "@/components/site/shared";
import GallerySection from "@/components/site/GallerySection";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { scrollToId } from "@/lib/scroll";
import { fetchProjects } from "@/lib/cmsAdmin";

const SITE = "https://gharbanwao.com";
const STAGES = ["Design", "Foundation", "Structure", "Brickwork", "Finishing", "Handover"];

const ProjectCard = ({ p, i }) => {
  const ongoing = p.status !== "handed_over";
  const stage = Math.min(Number(p.stage) || 1, STAGES.length);
  return (
    <Reveal key={p.slug} delay={(i % 3) * 0.05} data-testid={`cms-project-card-${p.slug}`}>
      <Link to={`/projects/${p.slug}`} className="card-gb flex h-full flex-col overflow-hidden bg-paper group">
        {p.cover_image_url ? (
          <Image src={p.cover_image_url} alt={p.title} ratio="aspect-[16/10]" />
        ) : (
          <Placeholder code={`IMG-${p.slug.split("-")[1] || p.slug}`} ratio="aspect-[16/10]" label={p.locality} />
        )}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-2">
            <MonoLabel>{p.gb_id || p.locality || "PROJECT"}</MonoLabel>
            <span className={`font-mono text-[10px] uppercase tracking-[0.08em] px-2 py-0.5 rounded ${ongoing ? "bg-yellow" : "bg-green"}`}>
              {ongoing ? "Ongoing" : "Handed over"}
            </span>
          </div>
          <h3 className="mt-2 text-[18px] font-bold leading-snug tracking-tight group-hover:text-green-700 transition-colors">
            {p.title}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-[13px] text-ink/60">
            <MapPin className="h-3.5 w-3.5 text-green-700" />
            {p.locality}, {p.city || "Uttar Pradesh"}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink/60">
            {p.area_sqft ? (
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-green-700" /> {Number(p.area_sqft).toLocaleString("en-IN")} sqft
              </span>
            ) : null}
            {p.package ? (
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-700" /> {p.package}
              </span>
            ) : null}
            {ongoing ? (
              <span className="inline-flex items-center gap-1.5">
                <Hammer className="h-3.5 w-3.5 text-green-700" /> {p.stage_name || `Stage ${String(stage).padStart(2, "0")}`}
              </span>
            ) : null}
          </div>
          {p.summary ? <p className="mt-3 text-[14px] leading-relaxed text-ink/70 line-clamp-2 flex-1">{p.summary}</p> : <span className="flex-1" />}
          <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-green-700">
            View project <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
};

export default function ProjectsPage() {
  const { hash } = useLocation();
  useEffect(() => {
    const id = hash.slice(1);
    if (id) setTimeout(() => scrollToId(id), 400);
  }, [hash]);
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["cms-projects-all"],
    queryFn: () => fetchProjects(),
    retry: false,
  });
  const [filter, setFilter] = useState("all");

  const shown = filter === "all" ? projects : projects.filter((p) => (filter === "ongoing" ? p.status !== "handed_over" : p.status === "handed_over"));

  return (
    <div className="min-h-screen bg-paper text-ink" data-testid="projects-page">
      <Helmet>
        <title>Our Projects in Lucknow — Completed & Ongoing | Ghar Banwao</title>
        <meta name="description" content={`${projects.length || 297}+ homes across Lucknow and Uttar Pradesh — browse completed and ongoing Ghar Banwao projects, from foundations to handover.`} />
        <link rel="canonical" href={`${SITE}/projects`} />
      </Helmet>
      <AnnouncementStrip />
      <Navbar />
      <main>
        <GallerySection />

        <section className="section-gb">
          <Container>
            <Reveal className="mb-[15px] flex flex-wrap justify-center gap-2">
              {[["all", "All projects"], ["ongoing", "Ongoing"], ["handed_over", "Completed"]].map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setFilter(v)}
                  className={`h-10 rounded-full px-5 text-[14px] font-bold border transition-colors ${filter === v ? "bg-ink text-paper border-ink" : "border-divider hover:border-ink/40"}`}
                  data-testid={`projects-filter-${v}`}
                >
                  {l}
                </button>
              ))}
            </Reveal>
            {isLoading ? (
              <p className="py-20 text-center font-mono text-[14px] text-ink/50" data-testid="projects-loading">
                Loading projects…
              </p>
            ) : shown.length === 0 ? (
              <p className="py-20 text-center text-[15px] text-ink/55" data-testid="projects-empty">
                No projects in this view yet.
                {projects.length > 0 ? " Try another filter." : " New projects appear here as soon as they are published from the admin."}
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {shown.map((p, i) => (
                  <ProjectCard key={p.slug} p={p} i={i} />
                ))}
              </div>
            )}
            <Reveal className="mt-12 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollToId("gallery")}
                  className="pill-green h-12 px-6 text-[15px] inline-flex items-center gap-2"
                  data-testid="projects-gallery-link"
                >
                  <ImagePlus className="h-[18px] w-[18px]" /> See the photo gallery
                </button>
                <a
                  href="/#projects"
                  className="pill-ghost h-12 px-6 text-[15px] inline-flex items-center gap-2"
                  data-testid="projects-map-link"
                >
                  <MapPin className="h-[18px] w-[18px]" /> See the live projects map
                </a>
              </div>
            </Reveal>
          </Container>
        </section>

        <FinalCTA />
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
