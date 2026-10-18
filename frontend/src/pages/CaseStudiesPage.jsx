import { useEffect, useState } from "react";
import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { FinalCTA, Footer, MobileBar } from "@/components/site/FaqCtaFooter";
import { Container, MonoLabel, Reveal, SectionHeader } from "@/components/site/shared";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Building2, Hammer, Ruler, Wallet } from "lucide-react";
import { fetchCaseStudies } from "@/lib/cmsAdmin";

/**
 * Published case studies live in the CMS backend, not in this bundle, so the
 * page loads them on mount. The list endpoint returns published stories to
 * anyone — no token needed — which is all the marketing site ever shows.
 */
export default function CaseStudiesPage() {
  const [studies, setStudies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Case Studies — Real Homes Built by Ghar Banwao";
    fetchCaseStudies()
      .then(setStudies)
      .catch(() => setError(true));
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Helmet>
        <title>Case Studies — Real Lucknow Homes, With the Numbers | Ghar Banwao</title>
        <meta
          name="description"
          content="Real houses built by Ghar Banwao in Lucknow: the plot size, the area, the months it took and what it cost — challenge, solution and the owner's own words."
        />
        <meta
          name="keywords"
          content="house construction case studies Lucknow, plot to home Lucknow, construction timeline Lucknow, turnkey house builder Lucknow, Ghar Banwao case study"
        />
        <link rel="canonical" href="https://gharbanwao.com/case-studies" />
        <meta property="og:title" content="Case Studies — Real Homes Built by Ghar Banwao" />
        <meta
          property="og:description"
          content="The plot size, the area, the months it took and what it cost — real Lucknow builds, published."
        />
        <meta property="og:url" content="https://gharbanwao.com/case-studies" />
        <meta property="og:type" content="website" />
      </Helmet>
      <AnnouncementStrip />
      <Navbar />
      <main>
        <section className="section-gb" data-testid="case-studies-hero">
          <Container className="max-w-4xl">
            <Reveal>
              <SectionHeader
                label="CASE STUDIES"
                title="The house, and the numbers behind it."
                supporting="Every study below is a home we handed over. Plot size, built-up area, months on site and the budget — alongside what went wrong, what we did about it, and the owner's own line about it."
              />
            </Reveal>
          </Container>
        </section>

        <section className="section-gb pt-0" data-testid="case-study-list">
          <Container>
            {error ? (
              <p className="rounded-2xl border border-divider bg-wash-yellow px-5 py-6 text-center text-[15px] text-ink/70">
                The case studies could not be loaded right now.{" "}
                <Link to="/" className="font-bold text-green-700 underline">
                  See our projects instead
                </Link>
                .
              </p>
            ) : studies.length === 0 ? (
              <p className="rounded-2xl border border-divider px-5 py-10 text-center text-[15px] text-ink/50">
                Case studies are being published.{" "}
                <Link to="/contact" className="font-bold text-green-700 underline">
                  Talk to us
                </Link>{" "}
                for a walkthrough of homes already handed over.
              </p>
            ) : (
              <div className="grid gap-6">
                {studies.map((study, i) => (
                  <Reveal key={study.slug} delay={Math.min(i, 3) * 0.06}>
                    <article
                      className="card-gb grid gap-0 overflow-hidden md:grid-cols-[300px_1fr]"
                      data-testid={`case-study-card-${study.slug}`}
                    >
                      <Link
                        to={`/case-studies/${study.slug}`}
                        className="block bg-[#E9E9E6]"
                        aria-label={`Read the case study: ${study.title}`}
                      >
                        {study.cover_image_url ? (
                          <img
                            src={study.cover_image_url}
                            alt=""
                            loading="lazy"
                            className="h-48 w-full object-cover md:h-full"
                          />
                        ) : (
                          <div className="flex h-48 items-center justify-center md:h-full">
                            <Building2 className="h-10 w-10 text-ink/25" />
                          </div>
                        )}
                      </Link>
                      <div className="flex flex-col p-6">
                        <div className="flex flex-wrap items-center gap-2">
                          {study.gb_id && (
                            <span className="mono-label rounded-full bg-green/10 px-2.5 py-1 text-green-700">
                              {study.gb_id}
                            </span>
                          )}
                          <span className="mono-label rounded-full bg-ink/5 px-2.5 py-1 text-ink/60">
                            {study.status === "published" ? "Published" : "Draft"}
                          </span>
                        </div>
                        <Link to={`/case-studies/${study.slug}`} className="mt-3">
                          <h3 className="display text-2xl leading-tight hover:underline">
                            {study.title}
                          </h3>
                        </Link>
                        {(study.locality || study.city) && (
                          <p className="mono-label mt-2 text-ink/50">
                            {[study.locality, study.city].filter(Boolean).join(", ")}
                          </p>
                        )}
                        {study.summary && (
                          <p className="font-sub mt-3 text-[15px] leading-relaxed text-ink/70">
                            {study.summary}
                          </p>
                        )}
                        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-divider pt-4">
                          <Fact
                            icon={<Ruler className="h-4 w-4" />}
                            value={study.area_sqft ? `${Number(study.area_sqft).toLocaleString()} sq ft` : "—"}
                            label="Area"
                          />
                          <Fact
                            icon={<Hammer className="h-4 w-4" />}
                            value={study.duration_months ? `${study.duration_months} months` : "—"}
                            label="On site"
                          />
                          <Fact
                            icon={<Wallet className="h-4 w-4" />}
                            value={study.budget_lakhs ? `₹${Number(study.budget_lakhs).toLocaleString()}L` : "—"}
                            label="Budget"
                          />
                        </div>
                        <div className="mt-5 flex-1" />
                        <Link
                          to={`/case-studies/${study.slug}`}
                          className="inline-flex items-center gap-2 text-[15px] font-bold text-green-700 hover:gap-3 transition-all"
                        >
                          Read the full story
                          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                        </Link>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </Container>
        </section>
      </main>
      <FinalCTA />
      <Footer />
      <MobileBar />
    </div>
  );
}

const Fact = ({ icon, value, label }) => (
  <div className="min-w-0">
    <span className="flex items-center gap-1.5 text-green-700">{icon}</span>
    <p className="mt-1.5 truncate text-[15px] font-bold">{value}</p>
    <MonoLabel className="text-[11px] text-ink/45">{label}</MonoLabel>
  </div>
);
