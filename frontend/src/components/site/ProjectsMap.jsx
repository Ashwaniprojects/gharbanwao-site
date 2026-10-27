import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Container, MonoLabel, Placeholder, Reveal, SectionHeader } from "./shared";
import { BorderBeam } from "@/components/spectrumui/border-beam";
import { fetchProjects, fetchLiveProjects } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SIZES = [
  ["all", "All sizes"],
  ["lt1000", "< 1000 sqft"],
  ["1000-2000", "1000–2000"],
  ["2000-3500", "2000–3500"],
  ["gt3500", "3500+"],
];
const inSize = (s, k) => k === "all" || (k === "lt1000" && s < 1000) || (k === "1000-2000" && s >= 1000 && s < 2000) || (k === "2000-3500" && s >= 2000 && s < 3500) || (k === "gt3500" && s >= 3500);
const STAGES = ["Design", "Foundation", "Structure", "Brickwork", "Finishing", "Handover"];
const STATUS_TABS = [["all", "All"], ["ongoing", "Ongoing"], ["handed_over", "Completed"]];
const LUCKNOW_BOUNDS = [[26.73, 80.84], [26.95, 81.07]]; // default zoomed-in view — most projects live here

const Chip = ({ active, children, ...rest }) => (
  <button type="button" className={`h-9 px-3.5 rounded-full text-[13px] font-semibold border transition-colors ${active ? "bg-green border-green" : "border-divider hover:border-ink/40"}`} {...rest}>
    {children}
  </button>
);

const pinIcon = (status, isActive) => {
  const color = status === "ongoing" ? "#FFFF00" : "#93C526";
  const border = status === "ongoing" ? "rgba(0,0,0,0.35)" : "rgba(107,150,23,0.5)";
  const size = isActive ? 18 : 12;
  return L.divIcon({
    className: "gb-map-pin",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid ${border};box-shadow:${isActive ? "0 0 0 3px rgba(0,0,0,0.85)" : "0 1px 3px rgba(0,0,0,0.35)"};"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const clusterIcon = (cluster) => {
  const count = cluster.getChildCount();
  const size = count > 50 ? 40 : count > 15 ? 34 : 28;
  const fontSize = count > 50 ? 13 : count > 15 ? 12 : 11;
  return L.divIcon({
    className: "gb-map-cluster",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:#93C526;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-weight:700;font-size:${fontSize}px;color:#000;line-height:1;">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const FitToPoints = ({ locality, points }) => {
  const map = useMap();
  useEffect(() => {
    // The map sits inside a Reveal wrapper that animates from opacity 0 and
    // translateY, so Leaflet measures a mid-animation box on mount and draws
    // its bounds against the wrong size. Measure again once it has settled.
    const t = setTimeout(() => map.invalidateSize(), 450);
    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [map]);
  useEffect(() => {
    if (locality !== "all" && points.length > 0) {
      if (points.length === 1) map.setView(points[0], 15);
      else map.fitBounds(L.latLngBounds(points), { padding: [50, 50], maxZoom: 16 });
    } else {
      map.fitBounds(LUCKNOW_BOUNDS, { padding: [20, 20] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locality, JSON.stringify(points)]);
  return null;
};

/* The map is the only thing on the page that wants to capture a scroll
   gesture, and it sits mid-feed where a reader is most likely trying to move
   down the page. Leaflet's zoom and pan handlers are therefore left disabled
   until the visitor has deliberately put a finger or cursor on the map; from
   then on the gesture belongs to the map until they move away from it.
   Merely preventDefault-ing the events would not fix it — Leaflet still stops
   propagation on the wheel so the page never sees it, and on touch its own
   touch-action would swallow the swipe before the browser could scroll the
   document at all. */
const ScrollGate = ({ onEngagedChange }) => {
  const map = useMap();
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    const container = map.getContainer();
    const arm = () => setEngaged(true);
    // Only disarm when focus genuinely leaves the map. A tap on an unfocused
    // tile can bounce focus to the body and straight back, which would flip
    // this off again the instant it turned on.
    const maybeDisarm = (e) => {
      if (!container.contains(e.relatedTarget)) setEngaged(false);
    };

    container.addEventListener("pointerdown", arm);
    container.addEventListener("touchstart", arm);
    container.addEventListener("focusin", arm);
    container.addEventListener("focusout", maybeDisarm);
    return () => {
      container.removeEventListener("pointerdown", arm);
      container.removeEventListener("touchstart", arm);
      container.removeEventListener("focusin", arm);
      container.removeEventListener("focusout", maybeDisarm);
    };
  }, [map]);

  useEffect(() => {
    if (onEngagedChange) onEngagedChange(engaged);
    map.scrollWheelZoom[engaged ? "enable" : "disable"]();
    map.touchZoom[engaged ? "enable" : "disable"]();
    map.dragging[engaged ? "enable" : "disable"]();
    // touch-action is what actually releases the browser's own swipe on touch
    // devices, so it has to track the same flag. It is an inline style on
    // purpose: Leaflet sets `none` on the same element from a class rule, and
    // the inline value is what wins. "pan-x pan-y" lets the page scroll in
    // either direction; "none" hands every gesture to the map.
    map.getContainer().style.touchAction = engaged ? "none" : "pan-x pan-y";
  }, [map, engaged, onEngagedChange]);

  return null;
};

/* Shown until the map is engaged, so the reader knows why a wheel or pinch
   over it isn't doing anything. */
const MapHint = ({ engaged }) => {
  if (engaged) return null;
  return (
    <div className="pointer-events-none absolute bottom-[4.5rem] right-4 z-[1000] flex items-center gap-1.5 rounded-lg border border-divider bg-paper/95 px-3 py-2 text-[11px] font-mono uppercase tracking-[0.08em] text-ink/70" data-testid="map-interact-hint">
      <MapPin className="h-3 w-3 text-green" />
      <span>Tap to zoom &amp; drag</span>
    </div>
  );
};

const ProjectCard = ({ p }) => (
  <motion.article key={p.gb_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-gb p-6 h-full flex flex-col" data-testid="map-project-card">
    <Placeholder code={`IMG-${p.gb_id.slice(3)}`} ratio="aspect-[16/10]" label={p.locality} />
    <div className="mt-5 flex items-center justify-between">
      <span className="font-mono text-[13px] font-medium" data-testid="map-project-gbid">{p.gb_id}</span>
      <span className={`font-mono text-[10px] uppercase tracking-[0.08em] px-2 py-1 rounded ${p.status === "ongoing" ? "bg-yellow" : "bg-green"}`}>{p.status === "ongoing" ? "Ongoing" : "Handed over"}</span>
    </div>
    <h3 className="mt-2 text-xl font-bold">{p.locality}, {p.city}</h3>
    <p className="font-mono text-[12px] text-ink/60 uppercase tracking-[0.08em] mt-1">{p.plot} · {p.size_sqft.toLocaleString("en-IN")} sqft · {p.package}</p>
    <div className="mt-5">
      {p.status === "ongoing" ? (
        <div>
          <p className="mono-label text-[11px] text-ink/50 mb-2">Stage {String(p.stage).padStart(2, "0")} · {p.stage_name}</p>
          <div className="flex gap-1">
            {STAGES.map((s, i) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full ${i < p.stage ? "bg-green" : "bg-divider"}`} title={s} />
            ))}
          </div>
        </div>
      ) : (
        <p className="mono-label text-[11px] text-ink/50">Handed over · {p.handover}</p>
      )}
    </div>
    <blockquote className="mt-5 text-[15px] text-ink/75 leading-relaxed border-l-2 border-green pl-4">"{p.quote}"<footer className="mt-1 font-semibold not-italic text-ink">— {p.owner}</footer></blockquote>
    <a href={`/projects/${p.gb_id.toLowerCase()}`} className="mt-auto pt-6 inline-flex items-center gap-1 font-bold text-[15px] underline decoration-green decoration-2 underline-offset-4 hover:decoration-4" data-testid="map-project-view-link">
      View full project <ArrowRight className="h-4 w-4" />
    </a>
  </motion.article>
);

// The side panel is fed from the live content backend, not the static file.
// Field names differ from the static pins (summary / cover_image_url / slug),
// so it gets its own card. As more projects are published on the backend this
// panel fills up automatically.
const LiveProjectCard = ({ p }) => (
  <motion.article key={p.gb_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 h-full flex flex-col" data-testid="live-project-card">
    {p.cover_image_url ? (
      <div className="overflow-hidden rounded-xl border border-divider aspect-[16/10] bg-divider">
        <img src={p.cover_image_url} alt={p.title} width={800} height={500} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </div>
    ) : (
      <Placeholder code={`IMG-${p.gb_id.slice(3)}`} ratio="aspect-[16/10]" label={p.locality} />
    )}
    <div className="mt-5 flex items-center justify-between">
      <span className="font-mono text-[13px] font-medium" data-testid="live-project-gbid">{p.gb_id}</span>
      <span className={`font-mono text-[10px] uppercase tracking-[0.08em] px-2 py-1 rounded ${p.status === "ongoing" ? "bg-yellow" : "bg-green"}`}>{p.status === "ongoing" ? "Ongoing" : "Handed over"}</span>
    </div>
    <h3 className="mt-2 text-xl font-bold leading-snug">{p.locality}, {p.city}</h3>
    <p className="font-mono text-[12px] text-ink/60 uppercase tracking-[0.08em] mt-1">{p.size_sqft.toLocaleString("en-IN")} sqft</p>
    {p.summary && (
      <p className="mt-4 text-[14px] text-ink/70 leading-relaxed line-clamp-5">{p.summary}</p>
    )}
    <a href={`/projects/${p.slug || p.gb_id.toLowerCase()}`} className="mt-auto pt-6 inline-flex items-center gap-1 font-bold text-[15px] underline decoration-green decoration-2 underline-offset-4 hover:decoration-4" data-testid="live-project-view-link">
      View full project <ArrowRight className="h-4 w-4" />
    </a>
  </motion.article>
);

export const ProjectsMap = () => {
  const { data: projects = [], isLoading } = useQuery({ queryKey: ["projects-all"], queryFn: () => fetchProjects({ limit: 500 }) });
  const { data: liveProjects = [], isLoading: liveLoading, isError: liveError } = useQuery({
    queryKey: ["projects-live"],
    queryFn: () => fetchLiveProjects(),
  });
  const [status, setStatus] = useState("all");
  const [locality, setLocality] = useState("all");
  const [size, setSize] = useState("all");
  const [pkg, setPkg] = useState("all");
  const [selected, setSelected] = useState(null);
  const [mapEngaged, setMapEngaged] = useState(false);

  const localities = useMemo(() => [...new Set(projects.map((p) => p.locality))].sort(), [projects]);
  const filtered = useMemo(
    () => projects.filter((p) => (status === "all" || p.status === status) && (locality === "all" || p.locality === locality) && inSize(p.size_sqft, size) && (pkg === "all" || p.package === pkg)),
    [projects, status, locality, size, pkg]
  );
  const counts = useMemo(() => ({
    all: projects.length,
    ongoing: projects.filter((p) => p.status === "ongoing").length,
    handed_over: projects.filter((p) => p.status === "handed_over").length,
  }), [projects]);
  const active = filtered.find((p) => p.gb_id === selected) || filtered[0];
  const points = useMemo(() => filtered.map((p) => [p.lat, p.lng]), [filtered]);

  return (
    <section id="projects" className="section-gb !py-6 md:!py-8" data-testid="projects-map-section">
      <Container>
        <SectionHeader title="Explore Our Completed & Ongoing Projects" supporting={`Discover Ghar Banwao homes near you. Browse by location, project status to explore our work across Lucknow and Uttar Pradesh. ${projects.length || 297} pins and counting.`} />

        <Reveal className="mt-6 flex flex-wrap gap-1.5 p-1 rounded-full bg-wash-yellow border border-divider w-fit items-center" data-testid="map-status-tabs">
          {STATUS_TABS.map(([v, l]) => (
            <button
              key={v}
              onClick={() => { setStatus(v); setSelected(null); }}
              className={`h-9 px-4 rounded-full text-[14px] font-bold transition-colors ${status === v ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"}`}
              data-testid={`map-status-tab-${v}`}
            >
              {l} <span className="font-mono text-[11px] opacity-70">({counts[v] ?? 0})</span>
            </button>
          ))}
        </Reveal>

        <Reveal className="mt-3 flex flex-wrap items-center gap-2" data-testid="map-filter-bar">
          <Select value={locality} onValueChange={setLocality}>
            <SelectTrigger className="h-8 w-[150px] rounded-full border-divider text-[13px] font-semibold" data-testid="map-filter-locality"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All localities</SelectItem>
              {localities.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="h-8 w-[140px] rounded-full border-divider text-[13px] font-semibold" data-testid="map-filter-size"><SelectValue /></SelectTrigger>
            <SelectContent>{SIZES.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
          </Select>
          <div className="flex gap-1 flex-wrap">
            {["all", "Silver", "Gold", "Platinum"].map((v) => (
              <Chip key={v} active={pkg === v} onClick={() => setPkg(v)} data-testid={`map-filter-package-${v.toLowerCase()}`}>{v === "all" ? "All packages" : v}</Chip>
            ))}
          </div>
          <span className="ml-auto font-mono text-[12px] text-ink/60" data-testid="map-result-count">{filtered.length} projects</span>
        </Reveal>

        <div className="mt-4 grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 gb-map-scope relative rounded-2xl border border-divider bg-paper overflow-hidden">
            <BorderBeam colorFrom="rgba(147,197,38,0)" colorTo="rgba(147,197,38,0.55)" duration={6} />
            <Reveal className="relative h-[300px] lg:h-[400px]" data-testid="projects-map">
            {isLoading && <div className="absolute inset-0 z-[1000] grid place-items-center bg-paper font-mono text-[12px] text-ink/50">Loading 297 pins…</div>}
            <MapContainer bounds={LUCKNOW_BOUNDS} scrollWheelZoom={false} className="h-full w-full" style={{ height: "100%", width: "100%" }} data-testid="projects-map-canvas">
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <FitToPoints locality={locality} points={points} />
              <ScrollGate onEngagedChange={setMapEngaged} />
              <MarkerClusterGroup chunkedLoading iconCreateFunction={clusterIcon} maxClusterRadius={75} disableClusteringAtZoom={16} spiderfyOnMaxZoom spiderfyDistanceMultiplier={1.8}>
                {filtered.map((p) => (
                  <Marker
                    key={p.gb_id}
                    position={[p.lat, p.lng]}
                    icon={pinIcon(p.status, active?.gb_id === p.gb_id)}
                    eventHandlers={{
                      mouseover: (e) => { setSelected(p.gb_id); e.target.openPopup(); },
                      mouseout: (e) => e.target.closePopup(),
                      click: (e) => { setSelected(p.gb_id); e.target.openPopup(); },
                    }}
                    data-testid={`map-pin-${p.gb_id}`}
                  >
                    <Popup data-testid="map-tooltip">
                      <span className="font-mono text-[11px]">{p.gb_id} · {p.locality} · {p.status === "ongoing" ? "Ongoing" : "Handed over"}</span>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>
            <div className="absolute left-4 top-4 z-[1000] flex flex-col gap-1 font-mono text-[11px] uppercase tracking-[0.1em] bg-paper/90 backdrop-blur px-3 py-2 rounded-lg border border-divider pointer-events-none">
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-green" /> Handed over</span>
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-yellow border border-ink/20" /> Ongoing</span>
            </div>
            <div className="absolute right-4 top-4 z-[1000] font-mono text-[11px] uppercase tracking-[0.1em] bg-paper/90 px-3 py-2 rounded-lg border border-divider pointer-events-none">Lucknow · Kanpur · Varanasi</div>
            <div className="absolute bottom-4 left-4 right-4 z-[1000] flex items-end justify-between pointer-events-none">
              <MonoLabel className="bg-paper/90 px-3 py-2 rounded-lg border border-divider text-[11px]">Live map · OpenStreetMap</MonoLabel>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-paper/90 px-3 py-2 rounded-lg border border-divider"><MapPin className="h-3 w-3 text-green" /> {filtered.length}</span>
            </div>
            <MapHint engaged={mapEngaged} />
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:self-start" data-testid="map-project-panel">
            <div className="relative h-[300px] lg:h-[400px] rounded-2xl border border-divider overflow-hidden flex flex-col">
              <BorderBeam colorFrom="rgba(147,197,38,0)" colorTo="rgba(147,197,38,0.45)" duration={7} />
              <div className="relative z-10 flex-1 overflow-y-auto scrollbar-thin">
                {liveLoading ? (
                  <div className="p-6 h-full grid place-items-center font-mono text-[12px] text-ink/50">Loading live project…</div>
                ) : liveError ? (
                  <div className="p-6 h-full grid place-items-center text-center text-[13px] text-ink/60">
                    Live projects unavailable right now. Try again shortly.
                  </div>
                ) : liveProjects.length ? (
                  <LiveProjectCard p={liveProjects[0]} />
                ) : (
                  <div className="p-6 h-full grid place-items-center text-[13px] text-ink/60">
                    Live projects are coming soon — the map on the left is where we are today.
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
};
