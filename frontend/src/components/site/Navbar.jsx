import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { SearchOverlay } from "./SearchOverlay";
import { NAV, PHONES, SERVICES_MENU } from "@/data/content";
import { scrollToId } from "@/lib/scroll";

export const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) setServicesOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (id) => {
    setMenuOpen(false);
    setServicesOpen(false);
    // Home, About and Reviews are their own routes, so they must not fall
    // through to scrollToId below, which assumes we are already on the homepage.
    if (id === "home") {
      window.location.href = "/";
      return;
    }
    if (id === "about" || id === "reviews") {
      window.location.href = `/${id}`;
      return;
    }
    if (window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    scrollToId(id);
  };

  const goServiceItem = (item) => {
    setServicesOpen(false);
    if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      go(item.id);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-[84px] md:h-[92px] bg-paper/90 backdrop-blur-xl border-b border-divider no-print" data-testid="navbar">
        <div className="mx-auto w-full max-w-[1360px] px-5 md:px-6 h-full flex items-center gap-4 xl:gap-6">
          <Logo />
          <nav className="hidden lg:flex items-center gap-0.5 ml-2" aria-label="Primary">
            {NAV.map((n) =>
              n.id === "services" ? (
                <div key={n.id} ref={servicesRef} className="relative">
                  <button
                    onClick={() => setServicesOpen((p) => !p)}
                    className="px-3 py-2 text-[15px] font-semibold rounded-full hover:bg-wash-green transition-colors inline-flex items-center gap-1"
                    aria-expanded={servicesOpen}
                    data-testid="nav-link-services"
                  >
                    {n.label} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-[calc(100%+8px)] w-[280px] rounded-xl border border-divider bg-paper shadow-xl p-2"
                        data-testid="nav-services-dropdown"
                      >
                        {SERVICES_MENU.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => goServiceItem(item)}
                            className="w-full text-left px-3 py-2.5 rounded-lg text-[14px] font-semibold hover:bg-wash-green transition-colors flex items-center justify-between"
                            data-testid={`nav-services-item-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                          >
                            {item.label}
                            {item.external && <span className="font-mono text-[10px] text-ink/40">↗ nakshaabanwao.com</span>}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  key={n.id}
                  onClick={() => go(n.id)}
                  className="px-3 py-2 text-[15px] font-semibold rounded-full hover:bg-wash-green transition-colors"
                  data-testid={`nav-link-${n.id}`}
                >
                  {n.label}
                </button>
              )
            )}
          </nav>
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex ml-auto items-center gap-3 h-11 w-[160px] xl:w-[180px] rounded-full border border-divider bg-paper px-4 text-left text-ink/50 text-[14px] hover:border-ink/40 transition-colors"
            data-testid="nav-search-trigger"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 truncate">Search projects, services, FAQs</span>
            <kbd className="font-mono text-[11px] border border-divider rounded px-1.5">/</kbd>
          </button>
          <button onClick={() => setSearchOpen(true)} className="md:hidden ml-auto h-10 w-10 grid place-items-center rounded-full border border-divider" aria-label="Search" data-testid="nav-search-icon">
            <Search className="h-4 w-4" />
          </button>
          <button onClick={() => go("contact")} className="hidden md:inline-flex pill-green h-11 px-5 text-[15px] whitespace-nowrap" data-testid="nav-cta-consultation">
            Book Free Consultation
          </button>
          <a href={`tel:${PHONES[0]}`} className="hidden xl:flex items-center gap-2 font-mono text-[13px] font-bold tracking-wide bg-yellow px-3 py-2 rounded-full" data-testid="nav-phone">
            <Phone className="h-4 w-4 text-ink" /> {PHONES[0]}
          </a>
          <button onClick={() => setMenuOpen((p) => !p)} className="lg:hidden h-10 w-10 grid place-items-center rounded-full border border-divider" aria-label="Menu" data-testid="nav-menu-toggle">
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="lg:hidden absolute inset-x-0 top-full bg-paper border-b border-divider p-6 flex flex-col gap-1 max-h-[calc(100vh-84px)] overflow-y-auto"
              data-testid="nav-mobile-menu"
            >
              {NAV.map((n) =>
                n.id === "services" ? (
                  <div key={n.id} className="flex flex-col">
                    <p className="px-3 py-3 text-[17px] font-semibold text-ink/50 mono-label">{n.label}</p>
                    {SERVICES_MENU.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => goServiceItem(item)}
                        className="text-left px-5 py-3 text-[16px] font-semibold rounded-lg hover:bg-wash-green"
                        data-testid={`nav-mobile-services-item-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      >
                        {item.label}{item.external && " ↗"}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button key={n.id} onClick={() => go(n.id)} className="text-left px-3 py-3 text-[17px] font-semibold rounded-lg hover:bg-wash-green" data-testid={`nav-mobile-link-${n.id}`}>
                    {n.label}
                  </button>
                )
              )}
              <button onClick={() => go("contact")} className="pill-green h-12 mt-3" data-testid="nav-mobile-cta">
                Book Free Consultation
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
