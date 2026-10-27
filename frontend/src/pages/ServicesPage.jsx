import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { FinalCTA, Footer, MobileBar } from "@/components/site/FaqCtaFooter";
import { Container, MonoLabel, Reveal, SectionHeader, Image } from "@/components/site/shared";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { SERVICES, PHONES } from "@/data/content";
import { scrollToId } from "@/lib/scroll";

const SITE = "https://gharbanwao.com";

/* One shared layout serves both the index ("/services") and an individual
 * service ("/services/:slug"). With a slug it renders that service's detail;
 * without one it lists all four as cards that link into their detail pages. */
function ServicesShell({ service }) {
  const seoTitle = service
    ? `${service.title} in Lucknow | Ghar Banwao`
    : "Construction Services in Lucknow | Ghar Banwao";
  const seoDesc = service
    ? `${service.tagline} ${service.intro}`
    : "Architecture, turnkey construction with materials, interior design and renovation across Lucknow and eight UP cities — every service from one accountable team.";

  return (
    <div className="min-h-screen bg-paper text-ink" data-testid="services-page">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta name="keywords" content="construction services Lucknow, house construction Lucknow, home builder Lucknow, Ghar Banwao services" />
        <link rel="canonical" href={`${SITE}/services${service ? `/${service.slug}` : ""}`} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:type" content="website" />
      </Helmet>
      <AnnouncementStrip />
      <Navbar />
      <main>
        {service ? (
          <ServiceDetail service={service} />
        ) : (
          <ServicesIndex />
        )}
        <FinalCTA />
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}

function ServicesIndex() {
  return (
    <>
      <section className="section-gb bg-wash-yellow">
        <Container className="max-w-4xl">
          <Reveal>
            <SectionHeader
              label="WHAT WE DO"
              title="Four things we do. Nothing we don't."
              supporting="Pick the part of the build you need — planning, the build itself, the finishing layer, or a makeover on an existing home. Each is its own service page with exactly what is included."
              align="center"
            />
          </Reveal>
        </Container>
      </section>

      <section className="section-gb">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {SERVICES.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.05} data-testid={`service-tile-${s.slug}`}>
                <Link to={`/services/${s.slug}`} className="card-gb flex h-full flex-col overflow-hidden bg-paper group">
                  <Image src={s.img} alt={s.title} ratio="aspect-[16/9]" />
                  <div className="flex-1 p-6">
                    <h3 className="text-[22px] font-bold tracking-tight leading-tight group-hover:text-green-700 transition-colors">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-[15px] text-ink/65">{s.tagline}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-bold text-green-700">
                      Explore {s.title.split(" ")[0].toLowerCase()} service <ArrowRight className="h-4 w-4 transition-[gap] group-hover:ml-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function ServiceDetail({ service: s }) {
  return (
    <>
      <section className="section-gb bg-wash-yellow">
        <Container>
          <div className="flex items-center gap-2 text-[13px] text-ink/55">
            <Link to="/services" className="hover:text-green-700">Services</Link>
            <span>›</span>
            <span>{s.title}</span>
          </div>
          <div className="mt-6 grid gap-8 lg:grid-cols-2 items-center">
            <Reveal>
              <MonoLabel className="text-green-700">OUR SERVICE</MonoLabel>
              <h1 className="display mt-3 text-[34px] md:text-[46px] leading-[1.05] tracking-tight" data-testid="service-title">
                {s.title}
              </h1>
              <p className="mt-5 text-[17px] leading-relaxed text-ink/75">{s.intro}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => scrollToId("contact")}
                  className="pill-green h-12 px-6 text-[15px] inline-flex items-center gap-2"
                  data-testid="service-cta-book"
                >
                  Book a free consultation <ArrowRight className="h-[18px] w-[18px]" />
                </button>
                <a href={`tel:${PHONES[0]}`} className="pill-ghost h-12 px-6 text-[15px]">
                  Call {PHONES[0]}
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Image src={s.img} alt={s.title} ratio="aspect-[4/3]" />
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="section-gb">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader title="What this covers" supporting="The core of the service — what you get when you choose us for this." />
            <ul className="mt-7 grid gap-3">
              {s.points.map((p, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink/80" data-testid={`service-point-${i}`}>
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeader title="What is included" supporting={'Every one of these is written into the agreement before work begins — no "we will sort it later".'} />
            <div className="mt-7 grid gap-3">
              {s.includes.map((it, i) => (
                <div key={i} className="card-gb flex items-center gap-3 p-4" data-testid={`service-includes-${i}`}>
                  <span className="mono-label text-green-700">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[15px] text-ink/80">{it}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

    </>
  );
}

export function ServicesIndexPage() {
  return <ServicesShell service={null} />;
}

export function ServiceDetailPage() {
  const { slug } = useParams();
  const service = SERVICES.find((s) => s.slug === slug);
  const [redirect, setRedirect] = useState(service ? null : "");
  useEffect(() => {
    if (!service) setRedirect("/services");
  }, [service]);
  if (redirect && window.location.pathname !== redirect) {
    window.location.href = redirect;
    return null;
  }
  if (!service) return null;
  return <ServicesShell service={service} />;
}
