import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, X, CornerDownLeft } from "lucide-react";
import { fetchProjects } from "@/lib/api";
import { FAQS, SERVICES, SEARCH_POPULAR } from "@/data/content";
import { scrollToId } from "@/lib/scroll";

const LEARN = [
  { title: "How payments link to stages", id: "why" },
  { title: "Our 6-stage construction process", id: "process" },
  { title: "Brands we use on site", id: "materials" },
];
const TABS = ["Projects", "Services", "Learn", "FAQs"];

export const SearchOverlay = ({ open, onClose }) => {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("Projects");
  const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem("gb-recent") || "[]"));
  const inputRef = useRef(null);

  const { data: projects = [] } = useQuery({ queryKey: ["projects-all"], queryFn: () => fetchProjects({ limit: 500 }), enabled: open });

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const needle = q.trim().toLowerCase();
  const results = useMemo(() => {
    const match = (s) => s.toLowerCase().includes(needle);
    return {
      Projects: needle ? projects.filter((p) => [p.gb_id, p.locality, p.package, p.plot, p.city, String(p.size_sqft)].some(match)).slice(0, 12) : projects.slice(0, 6),
      Services: SERVICES.filter((s) => !needle || match(s.title) || match(s.text)),
      Learn: LEARN.filter((l) => !needle || match(l.title)),
      FAQs: FAQS.filter(([question, a]) => !needle || match(question) || match(a)).slice(0, 8),
    };
  }, [needle, projects]);

  const commit = (term, id) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(next);
    localStorage.setItem("gb-recent", JSON.stringify(next));
    onClose();
    if (id) setTimeout(() => scrollToId(id), 150);
  };

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
                placeholder="Search GB-229, Gomti Nagar, turnkey, warranty…"
                className="flex-1 bg-transparent text-[17px] font-medium outline-none placeholder:text-ink/40"
                data-testid="search-input"
              />
              <button onClick={onClose} className="h-9 w-9 grid place-items-center rounded-full hover:bg-wash-yellow" aria-label="Close search" data-testid="search-close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-1 px-5 pt-4" role="tablist">
              {TABS.map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`px-3 h-9 rounded-full text-[14px] font-semibold transition-colors ${tab === t ? "bg-green text-ink" : "hover:bg-wash-green"}`}
                  data-testid={`search-tab-${t.toLowerCase()}`}
                >
                  {t} <span className="font-mono text-[11px] opacity-60 ml-1">{results[t].length}</span>
                </button>
              ))}
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
              {tab === "Projects" &&
                results.Projects.map((p) => (
                  <button key={p.gb_id} onClick={() => commit(p.gb_id, "projects")} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-wash-yellow text-left" data-testid={`search-result-project-${p.gb_id}`}>
                    <div className="h-12 w-12 rounded-lg bg-[#E9E9E6] grid place-items-center font-mono text-[9px] shrink-0">IMG</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[13px] font-medium">{p.gb_id}</span>
                        <span className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded ${p.status === "ongoing" ? "bg-yellow" : "bg-green"}`}>{p.status === "ongoing" ? "Ongoing" : "Handed over"}</span>
                      </div>
                      <p className="text-[15px] font-semibold truncate">{p.locality}, {p.city} · {p.plot}</p>
                    </div>
                    <span className="font-mono text-[12px] text-ink/60">{p.package}</span>
                  </button>
                ))}
              {tab === "Services" &&
                results.Services.map((s) => (
                  <button key={s.title} onClick={() => commit(s.title, "services")} className="w-full p-3 rounded-xl hover:bg-wash-yellow text-left" data-testid="search-result-service">
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-[14px] text-ink/60">{s.text}</p>
                  </button>
                ))}
              {tab === "Learn" &&
                results.Learn.map((l) => (
                  <button key={l.title} onClick={() => commit(l.title, l.id)} className="w-full p-3 rounded-xl hover:bg-wash-yellow text-left font-semibold" data-testid="search-result-learn">
                    {l.title}
                  </button>
                ))}
              {tab === "FAQs" &&
                results.FAQs.map(([question]) => (
                  <button key={question} onClick={() => commit(question, "faq")} className="w-full p-3 rounded-xl hover:bg-wash-yellow text-left font-semibold text-[15px]" data-testid="search-result-faq">
                    {question}
                  </button>
                ))}
              {results[tab].length === 0 && <p className="text-ink/50 text-[15px] p-3" data-testid="search-empty">No matches. Try a locality, GB-ID or package name.</p>}
            </div>
            <div className="px-5 h-10 border-t border-divider flex items-center gap-4 font-mono text-[11px] text-ink/50">
              <span className="flex items-center gap-1"><CornerDownLeft className="h-3 w-3" /> select</span>
              <span>esc close</span>
              <span>/ open</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
