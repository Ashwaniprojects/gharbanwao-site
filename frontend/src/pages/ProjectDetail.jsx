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
import { PHONES, WHATSAPP_URL } from "@/data/content";

const STAGES = ["Design", "Foundation", "Structure", "Brickwork", "Finishing", "Handover"];
const SITE = "https://gharbanwao.com";

export default function ProjectDetail() {
  const { gbId } = useParams();
  const [project, setProject] = useState(null);
  const [siblings, setSiblings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchProjects({ limit: 500 })
      .then((all) => {
        const found = all.find((p) => p.gb_id.toLowerCase() === gbId.toLowerCase());
        setProject(found || null);
        setSiblings(all.filter((p) => p.locality === found?.locality && p.gb_id !== found?.gb_id).slice(0, 3));
      })
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
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
                  <span className="inline-flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-green-700" /> {project.plot} · {project.size_sqft.toLocaleString("en-IN")} sqft
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-green-700" /> {project.package} package
                  </span>
                  <span className="inline-flex items-center gap-2">
                    {ongoing ? <Hammer className="h-4 w-4 text-green-700" /> : <CheckCircle2 className="h-4 w-4 text-green-700" />}
                    {ongoing ? `${project.stage_name || "In progress"}` : `Handed over ${project.handover}`}
                  </span>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="overflow-hidden rounded-2xl border border-divider">
                  <Placeholder
                    code={`IMG-${project.gb_id.slice(3)}`}
                    ratio="aspect-[16/10]"
                    label={project.locality}
                  />
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
              <p className="mt-6 text-[16px] leading-relaxed text-ink/80" data-testid="project-summary">
                A {project.size_sqft.toLocaleString("en-IN")} square foot{" "}
                {project.package}-package home in {project.locality}, {project.city}. The plot is{" "}
                {project.plot.toLowerCase()}, finished to the {project.package} specification with{" "}
                {ongoing ? "construction underway" : "work completed and handed over"}{" "}
                {ongoing ? "" : `in ${project.handover}`}.
              </p>

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
