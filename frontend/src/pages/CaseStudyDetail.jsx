import { useEffect, useState } from "react";
import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { FinalCTA, Footer, MobileBar } from "@/components/site/FaqCtaFooter";
import { Container, MonoLabel, Reveal, SectionHeader } from "@/components/site/shared";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  Hammer,
  Quote,
  Ruler,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { fetchCaseStudy } from "@/lib/cmsAdmin";

const FALLBACK_IMAGE = "https://images.gharbanwao.com/case-studies/default.jpg";

/**
 * A single case study, fetched by slug. The backend only returns published
 * stories here, so a draft or unknown slug reaches the 404 path rather than
 * leaking a half-written draft.
 */
export default function CaseStudyDetail() {
  const { slug } = useParams();
  const [study, setStudy] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setStudy(null);
    setNotFound(false);
    setFailed(false);
    fetchCaseStudy(slug)
      .then(setStudy)
      .catch((err) => {
        if (err && err.response && err.response.status === 404) setNotFound(true);
        else setFailed(true);
      });
  }, [slug]);

  const photos = Array.isArray(study?.photos) ? study.photos : [];

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Helmet>
        <title>
          {study ? `${study.title} — Case Study | Ghar Banwao` : "Case Study | Ghar Banwao"}
        </title>
        {study && (
          <>
            <meta name="description" content={study.summary || ""} />
            <link rel="canonical" href={`https://gharbanwao.com/case-studies/${study.slug}`} />
            <meta property="og:title" content={study.title} />
            <meta property="og:description" content={study.summary || ""} />
            <meta property="og:type" content="article" />
            <meta property="og:image" content={study.cover_image_url || photos[0]} />
          </>
        )}
      </Helmet>
      <AnnouncementStrip />
      <Navbar />
      <main>
        {!study && !notFound && !failed && <Loading />}

        {failed && (
          <section className="section-gb">
            <Container className="max-w-2xl">
              <p className="rounded-2xl border border-divider bg-wash-yellow px-6 py-8 text-center text-[15px] text-ink/70">
                This case study could not be loaded right now.{" "}
                <Link to="/case-studies" className="font-bold text-green-700 underline">
                  Back to all case studies
                </Link>
              </p>
            </Container>
          </section>
        )}

        {notFound && (
          <section className="section-gb" data-testid="case-study-not-found">
            <Container className="max-w-2xl">
              <div className="card-gb px-6 py-12 text-center">
                <p className="mono-label text-green-700">NOT FOUND</p>
                <h1 className="display mt-3 text-3xl">That case study isn't published.</h1>
                <p className="font-sub mt-3 text-[15px] text-ink/70">
                  It may have been unpublished, or the link may be mistyped.
                </p>
                <Link
                  to="/case-studies"
                  className="mt-6 inline-flex items-center gap-2 text-[15px] font-bold text-green-700 hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" /> All case studies
                </Link>
              </div>
            </Container>
          </section>
        )}

        {study && (
          <article data-testid={`case-study-${study.slug}`}>
            <section className="section-gb">
              <Container className="max-w-3xl">
                <Reveal>
                  <Link
                    to="/case-studies"
                    className="inline-flex items-center gap-2 text-[14px] font-bold text-ink/55 hover:text-green-700"
                    data-testid="case-study-back"
                  >
                    <ArrowLeft className="h-4 w-4" /> All case studies
                  </Link>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {study.gb_id && (
                      <span className="mono-label rounded-full bg-green/10 px-3 py-1 text-green-700">
                        {study.gb_id}
                      </span>
                    )}
                    <span className="mono-label text-ink/50">
                      {[study.locality, study.city].filter(Boolean).join(", ")}
                    </span>
                  </div>
                  <h1 className="display mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl">
                    {study.title}
                  </h1>
                  {(study.summary || study.owner) && (
                    <p className="font-sub mt-5 text-base leading-relaxed text-ink/70 md:text-lg">
                      {study.summary}
                    </p>
                  )}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {study.duration_months && (
                      <Chip icon={<Hammer className="h-4 w-4" />} text={`${study.duration_months} months on site`} />
                    )}
                    {study.area_sqft && (
                      <Chip icon={<Ruler className="h-4 w-4" />} text={`${Number(study.area_sqft).toLocaleString()} sq ft built-up`} />
                    )}
                    {study.budget_lakhs && (
                      <Chip icon={<Wallet className="h-4 w-4" />} text={`₹${Number(study.budget_lakhs).toLocaleString()} lakh budget`} />
                    )}
                    {study.package && <Chip icon={<ShieldCheck className="h-4 w-4" />} text={`${study.package} package`} />}
                    {study.owner && <Chip icon={<Compass className="h-4 w-4" />} text={`Owner: ${study.owner}`} />}
                  </div>
                </Reveal>
              </Container>
            </section>

            <Gallery photos={photos} cover={study.cover_image_url} />

            <section className="section-gb" data-testid="case-study-story">
              <Container className="max-w-3xl">
                <Reveal>
                  <SectionHeader
                    label="THE STAGES"
                    title="The same three stages, every time."
                    supporting="Every home we hand over moves through the same three stages, so each case study is written the same way. The differences are in the plot, the monsoon and the owners — never in the process."
                  />
                </Reveal>

                <div className="mt-10 grid gap-6">
                  <Stage
                    index="01"
                    title="Challenge"
                    icon={<Compass className="h-5 w-5" />}
                    body={study.challenge}
                  />
                  <Stage
                    index="02"
                    title="Solution"
                    icon={<Hammer className="h-5 w-5" />}
                    body={study.solution}
                  />
                  <Stage
                    index="03"
                    title="Handover"
                    icon={<ShieldCheck className="h-5 w-5" />}
                    body="The keys hand over with a 10-year structural warranty, the maintenance team on call and the full document file — approvals, material brands and the signed completion record — in the owner's hands."
                  />
                </div>
              </Container>
            </section>

            {(study.quote || study.owner) && (
              <section className="section-gb">
                <Container className="max-w-3xl">
                  <Reveal>
                    <figure className="card-gb relative bg-wash-yellow p-8 md:p-10" data-testid="case-study-quote">
                      <Quote className="absolute right-8 top-8 h-9 w-9 text-green-700/25" />
                      <blockquote className="font-sub text-xl font-semibold leading-relaxed md:text-2xl">
                        {study.quote || "The keys handed over with the complete file."}
                      </blockquote>
                      {study.owner && (
                        <figcaption className="mono-label mt-5 text-ink/55">
                          — {study.owner}
                          {study.locality ? `, ${study.locality}` : ""}
                        </figcaption>
                      )}
                    </figure>
                  </Reveal>
                </Container>
              </section>
            )}

            <Metrics study={study} />
          </article>
        )}
      </main>
      <FinalCTA />
      <Footer />
      <MobileBar />
    </div>
  );
}

const Loading = () => (
  <section className="section-gb">
    <Container className="max-w-3xl">
      <div className="h-4 w-24 animate-pulse rounded bg-ink/10" />
      <div className="mt-5 h-12 w-full animate-pulse rounded bg-ink/10" />
      <div className="mt-3 h-12 w-3/4 animate-pulse rounded bg-ink/10" />
    </Container>
  </section>
);

const Chip = ({ icon, text }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-divider bg-paper px-3.5 py-2 text-[13px] font-semibold text-ink/75">
    <span className="text-green-700">{icon}</span>
    {text}
  </span>
);

const Gallery = ({ photos, cover }) => {
  const sources = Array.from(new Set([cover, ...photos].filter(Boolean)));
  if (sources.length === 0) return null;
  return (
    <section className="section-gb pt-0" data-testid="case-study-gallery">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2">
          {sources.slice(0, 6).map((src, i) => (
            <Reveal key={src} delay={Math.min(i, 4) * 0.05}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-divider bg-[#E9E9E6]">
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    if (e.currentTarget.dataset.fallback !== "1") {
                      e.currentTarget.dataset.fallback = "1";
                      e.currentTarget.src = FALLBACK_IMAGE;
                    } else {
                      e.currentTarget.style.display = "none";
                    }
                  }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};

const Stage = ({ index, title, icon, body }) => (
  <Reveal>
    <div className="card-gb grid gap-4 p-6 sm:grid-cols-[56px_1fr] md:p-7">
      <div className="flex items-center justify-center rounded-xl bg-green/10 text-green-700">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-3">
          <span className="mono-label text-ink/40">{index}</span>
          <h3 className="text-[19px] font-bold">{title}</h3>
        </div>
        <p className="font-sub mt-3 text-[15px] leading-relaxed text-ink/75">
          {body || "Not published yet for this home."}
        </p>
      </div>
    </div>
  </Reveal>
);

const Metrics = ({ study }) => {
  const rows = [
    { icon: <Compass className="h-4 w-4" />, label: "GB ID", value: study.gb_id },
    { icon: <Building2 className="h-4 w-4" />, label: "Locality", value: study.locality },
    { icon: <Clock className="h-4 w-4" />, label: "City", value: study.city },
    { icon: <Ruler className="h-4 w-4" />, label: "Plot dimensions", value: study.plot_dimensions },
    {
      icon: <Ruler className="h-4 w-4" />,
      label: "Built-up area",
      value: study.area_sqft ? `${Number(study.area_sqft).toLocaleString()} sq ft` : null,
    },
    { icon: <ShieldCheck className="h-4 w-4" />, label: "Package", value: study.package },
    {
      icon: <Hammer className="h-4 w-4" />,
      label: "Duration",
      value: study.duration_months ? `${study.duration_months} months` : null,
    },
    {
      icon: <Wallet className="h-4 w-4" />,
      label: "Budget",
      value: study.budget_lakhs ? `₹${Number(study.budget_lakhs).toLocaleString()} lakh` : null,
    },
  ].filter((r) => r.value);

  if (rows.length === 0) return null;
  return (
    <section className="section-gb" data-testid="case-study-metrics">
      <Container className="max-w-3xl">
        <Reveal>
          <div className="card-gb p-6 md:p-7">
            <div className="flex items-center gap-2 border-b border-divider pb-4">
              <CheckCircle2 className="h-5 w-5 text-green-700" />
              <h2 className="text-[19px] font-bold">Build summary</h2>
            </div>
            <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4 border-b border-divider/60 pb-3">
                  <dt className="flex items-center gap-2 text-[13px] font-medium text-ink/50">
                    <span className="text-green-700">{row.icon}</span>
                    {row.label}
                  </dt>
                  <dd className="text-right text-[15px] font-bold">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mono-label mt-6 text-ink/40">
              Published{" "}
              {study.published_at
                ? new Date(study.published_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "today"}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};
