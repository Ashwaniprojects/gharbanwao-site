import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search, X, CornerDownLeft, ArrowUpRight } from "lucide-react";
import { fetchLiveProjects } from "@/lib/api";
import { fetchPosts } from "@/lib/cmsAdmin";
import { FAQS, SERVICES, SEARCH_POPULAR } from "@/data/content";
import { BLOGS } from "@/data/blogs";

// Every site page, so the overlay can deep-link anywhere on gharbanwao.com.
const PAGES = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Services", "/services"],
  ["Projects", "/projects"],
  ["Project Gallery", "/projects#gallery"],
  ["Blog", "/blog"],
  ["Reviews", "/reviews"],
  ["Cost Calculator", "/calculator"],
  ["FAQs", "/faq"],
  ["Contact", "/contact"],
  ["Vendor & Partner Registration", "/register"],
  ["Privacy Policy", "/privacy"],
  ["Terms & Conditions", "/terms"],
];

// Tab order doubles as the "All" group order: the kinds a buyer cares about
// most first.
const TABS = [
  { key: "all", label: "All" },
  { key: "project", label: "Projects" },
  { key: "post", label: "Blog" },
  { key: "service", label: "Services" },
  { key: "faq", label: "FAQs" },
  { key: "page", label: "Pages" },
];

const KIND_LABEL = { project: "PROJECT", post: "BLOG", service: "SERVICE", faq: "FAQ", page: "PAGE" };
const KIND_ORDER = ["project", "post", "service", "faq", "page"];

// Live rows are sparse: gb_id, package and plot can all be null. Derive the
// display code from the title ("GB-216 | …") or the slug the same way the map
// card does, so a missing gb_id never blanks a result row.
const deriveGbId = (p) =>
  p.gb_id || (String(p.title || "").match(/GB-\d+/i) || String(p.slug || "").match(/gb-\d+/i) || [""])[0].toUpperCase() || "";

const shortTitle = (p) => (p.title ? p.title.split("|").slice(1).join("|").trim() : "");

const slugOf = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const SearchOverlay = ({ open, onClose }) => {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("all");
  const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem("gb-recent") || "[]"));
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const live = useQuery({ queryKey: ["projects-live-search"], queryFn: () => fetchLiveProjects(), enabled: open, retry: false });
  const posts = useQuery({ queryKey: ["cms-posts-search"], queryFn: () => fetchPosts(), enabled: open, retry: false });

  const loading = live.isPending || posts.isPending;

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const entries = useMemo(() => {
    const list = [];
    for (const p of live.data || []) {
      const gbId = deriveGbId(p);
      const place = [p.locality, p.city].filter(Boolean).join(", ");
      const size = p.area_sqft ?? p.size_sqft;
      list.push({
        kind: "project",
        key: `project-${p.slug || gbId}`,
        title: place || shortTitle(p) || gbId || "Project",
        sub: [shortTitle(p), size ? `${Number(size).toLocaleString("en-IN")} sqft` : null, p.package].filter(Boolean).join(" · "),
        meta: [gbId, p.status === "handed_over" ? "Handed over" : "Ongoing", p.plot_dimensions].filter(Boolean).join(" · "),
        to: `/projects/${p.slug || gbId.toLowerCase()}`,
        thumb: p.cover_image_url || null,
      });
    }
    // The field manual ships in the bundle; CMS posts come from the admin.
    // Dedupe on slug and keep the first (the blog page itself renders the
    // static post when both exist, so the link lands on the same page).
    for (const b of BLOGS) {
      if ((posts.data || []).some((p) => slugOf(p.title) === b.slug)) continue;
      list.push({ kind: "post", key: `post-${b.slug}`, title: b.title, sub: [b.category, "Field manual"].filter(Boolean).join(" · "), meta: "", to: `/blog/${b.slug}` });
    }
    for (const p of posts.data || []) {
      if (BLOGS.some((b) => b.slug === p.slug)) continue;
      list.push({
        kind: "post",
        key: `post-${p.slug}`,
        title: p.title,
        sub: [p.category, p.author].filter(Boolean).join(" · "),
        meta: p.published_at ? new Date(p.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Ghar Banwao desk",
        to: `/blog/${p.slug}`,
      });
    }
    for (const s of SERVICES) {
      list.push({
        kind: "service",
        key: `service-${s.slug}`,
        title: s.title,
        sub: s.tagline || s.text,
        meta: s.external ? "Naksha Abanwao — sister studio" : "Ghar Banwao",
        to: s.external || `/services/${s.slug}`,
        external: Boolean(s.external),
      });
    }
    FAQS.forEach(([question, answer], i) => {
      list.push({ kind: "faq", key: `faq-${i}`, title: question, sub: answer, meta: "From our FAQ", to: "/faq" });
    });
    for (const [title, to] of PAGES) {
      list.push({ kind: "page", key: `page-${to}`, title, sub: to === "/" ? "gharbanwao.com" : `gharbanwao.com${to}`, meta: "", to });
    }
    return list;
  }, [live.data, posts.data]);

  const byKind = useMemo(() => {
    const m = {};
    for (const k of KIND_ORDER) m[k] = [];
    for (const e of entries) m[e.kind].push(e);
    return m;
  }, [entries]);

  const needle = q.trim().toLowerCase();
  const matched = useMemo(() => {
    if (!needle) return null;
    const scored = [];
    for (const e of entries) {
      const fields = [e.title, e.sub, e.meta].map((s) => String(s || "").toLowerCase());
      const positions = fields.map((f) => (f ? f.indexOf(needle) : -1));
      const best = Math.min(...positions.filter((p) => p >= 0));
      if (best === -1) continue;
      const rank = positions[0] === 0 ? 0 : positions[0] > 0 ? 1 : positions[1] >= 0 ? 2 : 3;
      scored.push({ e, rank, best });
    }
    scored.sort((a, b) => a.rank - b.rank || a.best - b.best);
    return scored.map((s) => s.e);
  }, [needle, entries]);

  // What the current tab shows: "all" = top few of every kind, grouped; a
  // specific tab = up to 12 of that kind plus a "view all" row.
  const view = useMemo(() => {
    if (tab === "all") {
      const groups = matched
        ? KIND_ORDER.map((k) => ({ kind: k, items: matched.filter((e) => e.kind === k).slice(0, 3) })).filter((g) => g.items.length)
        : KIND_ORDER.map((k) => ({ kind: k, items: byKind[k].slice(0, k === "page" ? 6 : 3) })).filter((g) => g.items.length);
      return { grouped: true, groups };
    }
    const items = matched ? matched.filter((e) => e.kind === tab).slice(0, 12) : byKind[tab].slice(0, 12);
    return { grouped: false, items, total: matched ? matched.filter((e) => e.kind === tab).length : byKind[tab].length };
  }, [tab, matched, byKind]);

  const pick = view.grouped ? view.groups[0]?.items[0] : view.items[0];

  const commit = (item, term) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(next);
    localStorage.setItem("gb-recent", JSON.stringify(next));
    onClose();
    if (item.external) window.open(item.to, "_blank", "noopener");
    else navigate(item.to);
  };

  const onEnter = () => {
    if (!pick || !needle) return;
    commit(pick, needle);
  };

  const Row = ({ e }) => (
    <button
      key={e.key}
      onClick={() => commit(e, e.title)}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-wash-yellow text-left"
      data-testid={`search-result-${e.kind}`}
    >
      {e.thumb ? (
        <img src={e.thumb} alt="" width={44} height={44} loading="lazy" className="h-11 w-11 rounded-lg border border-divider object-cover shrink-0" />
      ) : (
        <div className="h-11 w-11 rounded-lg bg-[#E9E9E6] grid place-items-center font-mono text-[9px] shrink-0 text-ink/50">{KIND_LABEL[e.kind].slice(0, 3)}</div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="mono-label text-[10px] text-green-700">{KIND_LABEL[e.kind]}</span>
          {e.kind === "project" && (
            <span className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded ${e.meta?.includes("Ongoing") ? "bg-yellow" : "bg-green"}`}>
              {e.meta?.includes("Ongoing") ? "Ongoing" : "Handed over"}
            </span>
          )}
        </div>
        <p className="text-[15px] font-semibold truncate mt-0.5">{e.title}</p>
        {e.sub ? <p className="text-[13px] text-ink/55 truncate">{e.sub}</p> : null}
      </div>
      {e.external ? (
        <ArrowUpRight className="h-4 w-4 text-ink/40 shrink-0" />
      ) : (
        <CornerDownLeft className="h-3.5 w-3.5 text-ink/30 shrink-0" />
      )}
    </button>
  );

  const GROUP_HEADER = { project: "Projects", post: "From the blog", service: "Services", faq: "FAQs", page: "Pages" };
  const groupHeader = (kind) => (
    <p className="mono-label text-ink/50 text-[11px] mt-4 mb-1">{GROUP_HEADER[kind]}</p>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm flex items-start justify-center p-4 pt-[8vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          data-testid="search-overlay"
        >
          <motion.div
            className="w-full max-w-3xl bg-paper rounded-2xl border border-divider shadow-2xl overflow-hidden"
            initial={{ y: 16, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 16, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 h-16 border-b border-divider">
              <Search className="h-5 w-5 text-green" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onEnter()}
                placeholder="Search projects, guides, services, pages…"
                className="flex-1 bg-transparent text-[17px] font-medium outline-none placeholder:text-ink/40"
                data-testid="search-input"
              />
              <button onClick={onClose} className="h-9 w-9 grid place-items-center rounded-full hover:bg-wash-yellow" aria-label="Close search" data-testid="search-close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-1 px-5 pt-4 flex-wrap" role="tablist">
              {TABS.map((t) => {
                const count = t.key === "all" ? entries.length : byKind[t.key]?.length || 0;
                return (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={tab === t.key}
                    onClick={() => setTab(t.key)}
                    className={`px-3 h-9 rounded-full text-[14px] font-semibold transition-colors ${tab === t.key ? "bg-green text-ink" : "hover:bg-wash-green"}`}
                    data-testid={`search-tab-${t.key}`}
                  >
                    {t.label} <span className="font-mono text-[11px] opacity-60 ml-1">{needle ? (matched?.filter((e) => e.kind === t.key).length || 0) : count}</span>
                  </button>
                );
              })}
            </div>
            <div className="p-5 max-h-[52vh] overflow-y-auto" data-testid="search-results">
              {!needle && (
                <div className="mb-5">
                  <p className="mono-label text-ink/50 mb-2">{recent.length ? "Recent" : "Popular searches"}</p>
                  <div className="flex flex-wrap gap-2">
                    {(recent.length ? recent : SEARCH_POPULAR).map((s) => (
                      <button key={s} onClick={() => setQ(s)} className="px-3 h-8 rounded-full border border-divider text-[13px] font-medium hover:border-ink/50" data-testid="search-popular-chip">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {needle && loading && view.grouped && view.groups.length === 0 && (
                <p className="text-ink/50 font-mono text-[13px] p-3">Fetching live content…</p>
              )}
              {view.grouped ? (
                view.groups.map((g) => (
                  <div key={g.kind}>
                    {view.groups.length > 1 && groupHeader(g.kind)}
                    {g.items.map((e) => <Row key={e.key} e={e} />)}
                  </div>
                ))
              ) : (
                <>
                  {view.items.map((e) => <Row key={e.key} e={e} />)}
                  {view.total > view.items.length && (
                    <button
                      onClick={() => {
                        onClose();
                        const to = { project: "/projects", post: "/blog", service: "/services", faq: "/faq", page: "/" }[tab];
                        navigate(to);
                      }}
                      className="w-full text-center font-mono text-[12px] text-green-700 py-2 hover:underline"
                    >
                      View all {view.total} in {TABS.find((t) => t.key === tab)?.label} →
                    </button>
                  )}
                </>
              )}
              {needle && (!view.grouped ? view.items.length === 0 : view.groups.length === 0) && (
                <p className="text-ink/50 text-[15px] p-3" data-testid="search-empty">No matches. Try a locality, GB-ID, package or service.</p>
              )}
            </div>
            <div className="px-5 h-10 border-t border-divider flex items-center gap-4 font-mono text-[11px] text-ink/50">
              <span className="flex items-center gap-1"><CornerDownLeft className="h-3 w-3" /> open top match</span>
              <span>esc close</span>
              <span>/ open</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
