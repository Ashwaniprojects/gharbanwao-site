import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { FinalCTA, Footer, MobileBar } from "@/components/site/FaqCtaFooter";
import { Container, MonoLabel, Placeholder, Reveal, SectionHeader, Stars, Image } from "@/components/site/shared";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock, Feather } from "lucide-react";
import { BLOGS, BLOG_UPDATED } from "@/data/blogs";
import { fetchAuthors, fetchPosts } from "@/lib/cmsAdmin";

const SITE = "https://gharbanwao.com";
const BY_SLUG = Object.fromEntries(BLOGS.map((p) => [p.slug, p]));
const READ_MIN = 250; // rough words-per-minute for a dense cost guide

/**
 * Every post ships with five image slots but no photos yet. The code on each
 * slot (BLOG-NN-K) is permanent, so once a photo is uploaded and named the
 * same way, adding a code-to-URL entry here lights it up on the site. Codes
 * that are not mapped render as labelled placeholders instead of broken images.
 */
const BLOG_IMAGES = {};

const CATEGORIES = [
  { name: "Cost & Budget", blurb: "Rates per sq ft, worked budgets and the hidden charges nobody quotes up front." },
  { name: "Process & Planning", blurb: "The nine stages, timeline, drawings and approvals, in the order they happen." },
  { name: "Materials & Construction", blurb: "Which steel, cement, brick and waterproofing to specify, and at which stage." },
  { name: "Compliance & Risk", blurb: "LDA approvals, contracts, payments and the traps a local contractor leaves in them." },
  { name: "Local Selection", blurb: "How to choose a builder in Lucknow, and which firms are actually worth a call." },
  { name: "Ghar Bachao", blurb: "True stories of buyers who got in over their head and what they learned." },
];

const readingTime = (body) =>
  Math.max(2, Math.round(((body.match(/[\p{L}\p{N}]+/gu) || []).length) / READ_MIN));

const LIST_HEAD = {
  title: "Ghar Banwao Field Manual",
  seoTitle: "House Construction Guides for Lucknow — 30 Field Manual Posts | Ghar Banwao",
  seoDescription:
    "30 posts on house construction in Lucknow: rate per sq ft, materials, approvals, contracts and the buyer traps that cost people lakhs. No paid content.",
  keywords: ["house construction Lucknow", "construction cost Lucknow", "house building contractor Lucknow"],
  slug: "index",
};

const NOT_FOUND_HEAD = {
  title: "Post not found",
  seoTitle: "Post Not Found | Ghar Banwao",
  seoDescription: "This post has moved or was never published. Browse all 30 field manual posts instead.",
  keywords: ["ghar banwao blog"],
  slug: "not-found",
};

const escapeHtml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Turn `**bold**` runs into <strong> nodes, leaving the rest as plain text.
 *  A trailing period right after the closing markers survives, so "a number."
 *  still reads as "a number." */
function rich(text) {
  return String(text).split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) => {
    const m = /^\*\*(.+)\*\*$/.exec(part);
    return m ? <strong key={i}>{m[1]}</strong> : part;
  });
}

/** The body is the lightweight markup documented at the top of blogs.js:
 *  ## / ### headings, - lists, > pull-quotes, *stars*, !N image slots,
 *  [[slug|text]] internal links and **bold**. It returns React nodes. */
const INLINE = /\*\*([^*]+)\*\*|\[\[([^\]|]+)\|([^\]]+)\]\]|\[([^\]]+)\]\(([^)\s]+)\)/;

/** Inline markup to React nodes. [[slug|text]] becomes a Router <Link> for
 *  posts that exist; anything else is a real anchor, so a typo in one post
 *  reads as a bad link instead of silently dead-linking. */
function inline(text) {
  const nodes = [];
  let rest = String(text);
  let key = 0;
  while (rest) {
    const m = INLINE.exec(rest);
    if (!m) {
      nodes.push(rich(rest));
      break;
    }
    if (m.index > 0) nodes.push(rich(rest.slice(0, m.index)));
    if (m[1] !== undefined) {
      const i = key++;
      nodes.push(<strong key={`b-${i}`}>{m[1]}</strong>);
    } else if (m[2] !== undefined) {
      const i = key++;
      const dest = m[2].startsWith("/") ? m[2] : `/blog/${m[2]}`;
      const internal = m[2].startsWith("/") || !!BY_SLUG[m[2]];
      const cls = "font-semibold text-green-700 hover:underline";
      nodes.push(
        internal ? (
          <Link key={`i-${i}`} to={dest} className={cls}>{rich(m[3])}</Link>
        ) : (
          <a key={`e-${i}`} href={dest} target="_blank" rel="noreferrer" className={cls}>
            {rich(m[3])}
          </a>
        )
      );
    } else {
      const i = key++;
      nodes.push(
        <a key={`x-${i}`} href={m[5]} target="_blank" rel="noreferrer" className="font-semibold text-green-700 hover:underline">
          {rich(m[4])}
        </a>
      );
    }
    rest = rest.slice(m.index + m[0].length);
  }
  return nodes;
}

const BULLET = "mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-700";

/** The body is the lightweight markup documented at the top of blogs.js:
 *  ## / ### headings, - lists, > pull-quotes, *stars*, !N image slots,
 *  [[slug|text]] internal links and **bold**. Returns React nodes. */
export function renderBody(body, images) {
  const nodes = [];
  let list = null;
  const flush = () => {
    if (!list) return;
    const items = list;
    list = null;
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="mt-4 space-y-2.5">
        {items.map((text, i) => (
          <li key={i} className="flex gap-3 leading-relaxed">
            <span className={BULLET} />
            <span>{inline(text)}</span>
          </li>
        ))}
      </ul>
    );
  };
  for (const raw of String(body || "").split("\n")) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    if (line.startsWith("- ")) {
      list = list || [];
      list.push(line.slice(2));
      continue;
    }
    flush();
    if (line.startsWith("> ")) {
      nodes.push(
        <blockquote key={`q-${nodes.length}`} className="my-8 border-l-4 border-green-700 pl-5 py-1 text-[19px] font-medium leading-snug text-ink">
          {inline(line.slice(2))}
        </blockquote>
      );
      continue;
    }
    if (line === "*stars*") {
      nodes.push(
        <div key={`s-${nodes.length}`} className="my-6 flex items-center gap-3">
          <Stars n={5} />
          <span className="font-bold text-[16px]">Verified review</span>
        </div>
      );
      continue;
    }
    const slot = /^!(\d)$/.exec(line);
    if (slot) {
      const n = Number(slot[1]);
      const meta = images && images[n - 1];
      const src = meta ? BLOG_IMAGES[meta.code] : null;
      nodes.push(
        <figure key={`f-${nodes.length}`} className="my-9">
          {src ? (
            <img src={src} alt={meta.alt || ""} loading="lazy" className="w-full rounded-2xl border border-divider" />
          ) : (
            <Placeholder code={meta ? meta.code : `BLOG-${String(n).padStart(2, "0")}`} ratio="aspect-[16/9]" />
          )}
          {meta && meta.caption && (
            <figcaption className="mt-3 text-[14px] text-ink/60">{meta.caption}</figcaption>
          )}
        </figure>
      );
      continue;
    }
    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={`h-${nodes.length}`} className="mt-11 mb-3 text-[25px] font-bold leading-tight tracking-tight">
          {inline(line.slice(3))}
        </h2>
      );
      continue;
    }
    if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={`h-${nodes.length}`} className="mt-7 mb-2 text-[19px] font-bold leading-snug">
          {inline(line.slice(4))}
        </h3>
      );
      continue;
    }
    nodes.push(
      <p key={`p-${nodes.length}`} className="mt-5 leading-relaxed">
        {inline(line)}
      </p>
    );
  }
  flush();
  return nodes;
}

function Head({ post, list }) {
  const img = post.images && post.images[0];
  const imgMeta = img && BLOG_IMAGES[img.code];
  return (
    <Helmet>
      <title>{post.seoTitle || `${post.title} | Ghar Banwao`}</title>
      <meta name="description" content={post.seoDescription || ""} />
      <meta name="keywords" content={post.keywords.join(", ")} />
      <link rel="canonical" href={`${SITE}/blog${list ? "" : `/${post.slug}`}`} />
      <meta property="og:title" content={list ? "Ghar Banwao Field Manual — House Construction in Lucknow" : post.title} />
      <meta property="og:description" content={post.seoDescription || ""} />
      <meta property="og:url" content={`${SITE}/blog${list ? "" : `/${post.slug}`}`} />
      <meta property="og:type" content="article" />
      {imgMeta && <meta property="og:image" content={imgMeta} />}
      <meta name="article:section" content={post.category} />
      <meta name="article:published_time" content={BLOG_UPDATED} />
      <meta name="article:modified_time" content={BLOG_UPDATED} />
      {list ? (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Ghar Banwao Field Manual",
            description: "30 posts on house construction in Lucknow: cost per sq ft, materials, approvals, contracts and buyer risk.",
            url: `${SITE}/blog`,
            blogPost: list.map((b) => ({
              "@type": "BlogPosting",
              headline: b.title,
              description: b.seoDescription,
              datePublished: BLOG_UPDATED,
              dateModified: BLOG_UPDATED,
              url: `${SITE}/blog/${b.slug}`,
            })),
          })}
        </script>
      ) : (
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.seoDescription,
          datePublished: BLOG_UPDATED,
          dateModified: BLOG_UPDATED,
          keywords: post.keywords.join(", "),
          articleSection: post.category,
          mainEntityOfPage: `${SITE}/blog/${post.slug}`,
          author: { "@type": "Organization", name: "Ghar Banwao" },
          publisher: { "@type": "Organization", name: "Ghar Banwao", url: SITE },
          inLanguage: "en-IN",
        })}
      </script>
      )}
    </Helmet>
  );
}

function NotFound({ slug }) {
  const near = Object.keys(BY_SLUG)
    .filter((s) => s.includes(String(slug).slice(0, 12)))
    .slice(0, 3);
  return (
    <section className="section-gb">
      <Container className="max-w-2xl">
        <p className="rounded-2xl border border-divider bg-wash-yellow px-6 py-8 text-center text-[15px] leading-relaxed text-ink/70">
          There is no post at <span className="font-mono font-bold text-ink">/{escapeHtml(String(slug))}</span>. It may have
          moved, or it may never have been published.
          {near.length > 0 && (
            <span className="mt-3 block">
              Closest matches:{" "}
              {near.map((s, i) => (
                <span key={s}>
                  {i > 0 && ", "}
                  <Link to={`/blog/${s}`} className="font-bold text-green-700 underline">
                    {BY_SLUG[s].title}
                  </Link>
                </span>
              ))}
            </span>
          )}
          <span className="mt-3 block">
            Or <Link to="/blog" className="font-bold text-green-700 underline">browse all 30 posts</Link>.
          </span>
        </p>
      </Container>
    </section>
  );
}

export function BlogDetail() {
  const { slug } = useParams();
  const post = BY_SLUG[slug];
  const [cmsPost, setCmsPost] = useState(null);
  // CMS posts are fetched only for slugs the static field manual doesn't
  // know about; the two datasets never collide on a slug.
  useEffect(() => {
    setCmsPost(null);
    if (BY_SLUG[slug]) return;
    fetchPosts()
      .then((items) => setCmsPost(items.find((p) => p.slug === slug) || null))
      .catch(() => setCmsPost(null));
  }, [slug]);
  const [author, setAuthor] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    // The byline links to a named author profile when the post credits one by
    // name; a post with no author (or an unknown name) stays the team label.
    fetchAuthors()
      .then((items) => {
        const name = post?.author || "";
        setAuthor(name ? items.find((a) => a.name === name) || null : null);
      })
      .catch(() => setAuthor(null));
  }, [post]);
  const minutes = post ? readingTime(post.body) : 0;
  // Rendered once for the layout and once inside <script> for the JSON-LD
  // body, so keep the markup as a string rather than duplicating it.
  const html = useMemo(
    () =>
      post
        ? renderBody(
            post.body,
            post.images
          )
        : null,
    [post]
  );
  // A CMS post published from the admin: rendered from the backend, with the
  // same chrome. Shown only once the lookup finished and no static match.
  if (!post && cmsPost) {
    return (
      <div className="min-h-screen bg-paper text-ink" data-testid="cms-blog-detail">
        <Head post={{ ...cmsPost, title: cmsPost.title, seoTitle: cmsPost.meta_title || undefined }} />
        <AnnouncementStrip />
        <Navbar />
        <main>
          <section className="section-gb bg-wash-yellow">
            <Container>
              <div className="flex items-center gap-2 text-[13px] text-ink/55">
                <Link to="/blog" className="hover:text-green-700">Blog</Link>
                <span>›</span>
                <span>{cmsPost.category || "From the Ghar Banwao desk"}</span>
              </div>
              <div className="mt-5 max-w-3xl">
                <MonoLabel className="flex items-center gap-2">
                  <Feather className="h-3.5 w-3.5 text-green-700" /> FIELD NOTE
                </MonoLabel>
                <h1 className="mt-3 text-[34px] font-bold leading-[1.1] tracking-tight">{cmsPost.title}</h1>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-ink/60">
                  <span className="font-semibold text-ink/75">{cmsPost.author || "Ghar Banwao Editorial Team"}</span>
                  {cmsPost.published_at ? (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      {new Date(cmsPost.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  ) : null}
                </div>
              </div>
            </Container>
          </section>
          <article className="section-gb">
            <Container>
              <div className="mx-auto max-w-3xl text-[16px] text-ink/80">
                {cmsPost.cover_image_url ? (
                  <div className="mb-8 overflow-hidden rounded-2xl border border-divider">
                    <Image src={cmsPost.cover_image_url} alt={cmsPost.title} ratio="aspect-[16/9]" />
                  </div>
                ) : null}
                {cmsPost.excerpt ? (
                  <p className="text-[18px] font-medium leading-relaxed text-ink">{cmsPost.excerpt}</p>
                ) : null}
                {String(cmsPost.body || "")
                  .split(/\n{2,}/)
                  .map((para, i) => (
                    <p key={i} className="mt-5 leading-relaxed">
                      {para.trim()}
                    </p>
                  ))}
              </div>
            </Container>
          </article>
          <Related from={post || { category: "", slug }} />
          <FinalCTA />
        </main>
        <Footer />
        <MobileBar />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <Head post={NOT_FOUND_HEAD} />
        <AnnouncementStrip />
        <Navbar />
        <main>
          <NotFound slug={slug} />
          <FinalCTA />
        </main>
        <Footer />
        <MobileBar />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Head post={post} />
      <AnnouncementStrip />
      <Navbar />
      <main>
        <section className="section-gb bg-wash-yellow">
          <Container>
            <div className="flex items-center gap-2 text-[13px] text-ink/55">
              <Link to="/blog" className="hover:text-green-700">Blog</Link>
              <span>›</span>
              <span>{post.category}</span>
            </div>
            <div className="mt-5 max-w-3xl">
              <MonoLabel className="flex items-center gap-2">
                <Feather className="h-3.5 w-3.5 text-green-700" /> {post.category.toUpperCase()}
              </MonoLabel>
              <h1 className="mt-3 text-[34px] font-bold leading-[1.1] tracking-tight">{post.title}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-ink/60">
                {author ? (
                  <Link
                    to={`/author/${author.slug}`}
                    className="font-semibold text-green-700 hover:underline"
                    data-testid="blog-detail-author-link"
                  >
                    {author.name}
                  </Link>
                ) : (
                  <span className="font-semibold text-ink/75">Ghar Banwao Editorial Team</span>
                )}
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" /> Updated {new Date(BLOG_UPDATED).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {minutes} min read
                </span>
              </div>
            </div>
          </Container>
        </section>
        <article className="section-gb">
          <Container>
            <div className="mx-auto max-w-3xl text-[16px] text-ink/80">
              {html}
            </div>
          </Container>
        </article>
        <Related from={post} />
        <FinalCTA />
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}

function Related({ from }) {
  const same = BLOGS.filter((p) => p.category === from.category && p.slug !== from.slug);
  const fill = BLOGS.filter((p) => p.slug !== from.slug && p.category !== from.category);
  const list = [...same, ...fill].slice(0, 3);
  if (list.length === 0) return null;
  return (
    <section className="section-gb bg-wash-yellow">
      <Container>
        <SectionHeader label="KEEP READING" title="Three more on this subject" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {list.map((p, i) => (
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
  );
}

export function BlogIndex() {
  const [filter, setFilter] = useState("all");
  const onFilter = setFilter;
  // Fresh posts published from the admin CMS — shown above the field manual.
  // A fetch failure just means no CMS cards; the manual always renders.
  const { data: cmsPosts = [] } = useQuery({
    queryKey: ["cms-blog-posts"],
    queryFn: () => fetchPosts().catch(() => []),
  });
  const seen = new Set(BLOGS.map((p) => p.slug));
  const fresh = cmsPosts.filter((p) => p.status === "published" && !seen.has(p.slug));
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Head post={LIST_HEAD} list={BLOGS} />
      <AnnouncementStrip />
      <Navbar />
      <main>
        <section className="section-gb bg-wash-yellow">
          <Container className="max-w-4xl">
            <Reveal>
              <SectionHeader
                label="THE BUILDER'S FIELD MANUAL"
                title="House construction in Lucknow, in plain numbers."
                supporting="30 posts on cost per sq ft, materials, approvals, contracts and the traps that lose people money. Every one written for Lucknow plots, not copied from a national blog, and none of them paid content."
                align="center"
              />
            </Reveal>
          </Container>
        </section>
        {fresh.length > 0 ? (
          <section className="section-gb">
            <Container>
              <SectionHeader label="FRESH FROM THE DESK" title="Latest notes" />
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="cms-blog-cards">
                {fresh.map((p, i) => (
                  <Reveal key={`cms-${p.slug}`} delay={(i % 3) * 0.05}>
                    <Link to={`/blog/${p.slug}`} className="card-gb overflow-hidden bg-paper h-full flex flex-col group">
                      {p.cover_image_url ? (
                        <div className="overflow-hidden">
                          <Image src={p.cover_image_url} alt={p.title} ratio="aspect-[16/9]" />
                        </div>
                      ) : null}
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex items-center justify-between gap-3">
                          <MonoLabel>{p.category || "Field note"}</MonoLabel>
                          {p.published_at ? (
                            <span className="text-[12px] text-ink/45 flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {new Date(p.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-3 text-[17px] font-bold leading-snug group-hover:text-green-700 transition-colors">{p.title}</p>
                        {p.excerpt ? <p className="mt-3 text-[14px] leading-relaxed text-ink/65 flex-1">{p.excerpt}</p> : <span className="flex-1" />}
                        <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-green-700">
                          Read post <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        <section className="section-gb">
          <Container>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              <FilterChip active={filter === "all"} onClick={() => onFilter("all")} label="All 30" />
              {CATEGORIES.map((c) => (
                <FilterChip key={c.name} active={filter === c.name} onClick={() => onFilter(c.name)} label={c.name} />
              ))}
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {BLOGS.filter((p) => filter === "all" || p.category === filter).map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 0.05}>
                  <Link to={`/blog/${p.slug}`} className="card-gb p-6 bg-paper h-full flex flex-col group">
                    <div className="flex items-center justify-between gap-3">
                      <MonoLabel>{p.category}</MonoLabel>
                      <span className="text-[12px] text-ink/45 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {readingTime(p.body)} min
                      </span>
                    </div>
                    <p className="mt-3 text-[17px] font-bold leading-snug group-hover:text-green-700 transition-colors">
                      {p.title}
                    </p>
                    <p className="mt-3 text-[14px] leading-relaxed text-ink/65 flex-1">{p.seoDescription}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-green-700">
                      Read post <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
        <FinalCTA />
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}

function FilterChip({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 h-10 text-[14px] font-semibold border transition-colors ${
        active ? "bg-ink text-green border-ink" : "border-divider text-ink/70 hover:border-ink"
      }`}
    >
      {label}
    </button>
  );
}

export function BlogNotFound() {
  return <Navigate to="/blog" replace />;
}
