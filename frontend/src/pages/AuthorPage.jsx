import { useEffect, useState } from "react";
import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { FinalCTA, Footer, MobileBar } from "@/components/site/FaqCtaFooter";
import { Container, MonoLabel, Reveal } from "@/components/site/shared";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Linkedin, Instagram, Youtube, Globe, Feather } from "lucide-react";
import { BLOGS } from "@/data/blogs";
import { fetchAuthors } from "@/lib/cmsAdmin";
import { scrollToTop } from "@/lib/scroll";

// A profile can carry any of these channels; the one present is what we render.
const SOCIAL_META = [
  ["linkedin", Linkedin, "LinkedIn"],
  ["instagram", Instagram, "Instagram"],
  ["youtube", Youtube, "YouTube"],
  ["website", Globe, "Website"],
];

const initials = (name = "") =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase() || "?";

export default function AuthorPage() {
  const { slug } = useParams();
  const [author, setAuthor] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    scrollToTop();
    fetchAuthors()
      .then((items) => setAuthor(items.find((a) => a.slug === slug) || null))
      .catch(() => setError(true));
  }, [slug]);

  const posts = author ? BLOGS.filter((p) => p.author === author.name) : [];
  const social = author?.social || {};

  return (
    <div className="min-h-screen bg-paper text-ink" data-testid="author-page">
      <Helmet>
        <title>{author ? `${author.name} | Ghar Banwao` : "Author | Ghar Banwao"}</title>
        <meta name="description" content={author?.bio || "Author profile — Ghar Banwao."} />
        <link rel="canonical" href={`https://gharbanwao.com/author/${slug}`} />
      </Helmet>
      <AnnouncementStrip />
      <Navbar />
      <main>
        {error || !author ? (
          <section className="section-gb">
            <Container className="max-w-2xl">
              <p className="rounded-2xl border border-divider bg-wash-yellow px-6 py-10 text-center text-[15px] leading-relaxed text-ink/70">
                This author page has moved or does not exist.{" "}
                <Link to="/blog" className="font-bold text-green-700 underline">
                  Browse the blog
                </Link>{" "}
                instead.
              </p>
            </Container>
          </section>
        ) : (
          <section className="section-gb bg-wash-yellow">
            <Container className="max-w-3xl">
              <Reveal>
                <MonoLabel className="text-green-700">AUTHOR</MonoLabel>
                <div className="mt-5 flex items-center gap-5">
                  {author.photo_url ? (
                    <img
                      src={author.photo_url}
                      alt={author.name}
                      width={96}
                      height={96}
                      className="h-24 w-24 shrink-0 rounded-full object-cover border border-divider"
                      data-testid="author-photo"
                    />
                  ) : (
                    <span
                      className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-ink text-[28px] font-extrabold text-paper"
                      data-testid="author-avatar"
                    >
                      {initials(author.name)}
                    </span>
                  )}
                  <div>
                    <h1 className="display text-[30px] md:text-[38px]">{author.name}</h1>
                    {author.title ? (
                      <p className="mt-1 text-[15px] text-ink/60" data-testid="author-title">
                        {author.title}
                      </p>
                    ) : null}
                  </div>
                </div>
                {author.bio ? (
                  <p className="mt-6 text-[16px] leading-relaxed text-ink/80" data-testid="author-bio">
                    {author.bio}
                  </p>
                ) : null}
                {Object.keys(social).length > 0 ? (
                  <div className="mt-6 flex flex-wrap gap-2.5" data-testid="author-social">
                    {SOCIAL_META.map(([key, Icon, label]) =>
                      social[key] ? (
                        <a
                          key={key}
                          href={social[key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-10 items-center gap-2 rounded-full border border-divider bg-paper px-4 text-[14px] font-semibold hover:border-green-700 hover:text-green-700 transition-colors"
                          data-testid={`author-social-${key}`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={2.25} /> {label}
                        </a>
                      ) : null
                    )}
                  </div>
                ) : null}
              </Reveal>
            </Container>
          </section>
        )}

        {author && posts.length > 0 ? (
          <section className="section-gb">
            <Container>
              <MonoLabel className="flex items-center gap-2 text-green-700">
                <Feather className="h-3.5 w-3.5" /> {posts.length} POST{posts.length > 1 ? "S" : ""} BY {author.name.toUpperCase()}
              </MonoLabel>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {posts.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 0.05}>
                    <Link to={`/blog/${p.slug}`} className="card-gb p-6 bg-paper h-full flex flex-col group">
                      <MonoLabel>{p.category}</MonoLabel>
                      <p className="mt-3 text-[16px] font-bold leading-snug group-hover:text-green-700 transition-colors flex-1">
                        {p.title}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-green-700">
                        Read post <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        <FinalCTA />
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
