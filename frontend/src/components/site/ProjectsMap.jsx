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
import { fetchProjects } from "@/lib/api";
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
    <a href={`/projects/${p.gb_id.toLowerCase()}`} onClick={(e) => e.preventDefault()} className="mt-auto pt-6 inline-flex items-center gap-1 font-bold text-[15px] underline decoration-green decoration-2 underline-offset-4" data-testid="map-project-view-link">
      View full project <ArrowRight className="h-4 w-4" />
    </a>
  </motion.article>
);

export const ProjectsMap = () => {
  const { data: projects = [], isLoading } = useQuery({ queryKey: ["projects-all"], queryFn: () => fetchProjects({ limit: 500 }) });
  const [status, setStatus] = useState("all");
  const [locality, setLocality] = useState("all");
  const [size, setSize] = useState("all");
  const [pkg, setPkg] = useState("all");
  const [selected, setSelected] = useState(null);

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
    <section id="projects" className="section-gb" data-testid="projects-map-section">
      <Container>
        <SectionHeader label="LIVE / UPDATED WEEKLY" title="We don't tell you we build. We show you where." supporting={`Every green pin is a handed-over home. Every yellow pin is a site you can visit this week. ${projects.length || 297} pins and counting.`} />

        <Reveal className="mt-10 flex gap-1.5 p-1.5 rounded-full bg-wash-yellow border border-divider w-fit" data-testid="map-status-tabs">
          {STATUS_TABS.map(([v, l]) => (
            <button
              key={v}
              onClick={() => { setStatus(v); setSelected(null); }}
              className={`h-11 px-6 rounded-full text-[15px] font-bold transition-colors ${status === v ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"}`}
              data-testid={`map-status-tab-${v}`}
            >
              {l} <span className="font-mono text-[12px] opacity-70">({counts[v] ?? 0})</span>
            </button>
          ))}
        </Reveal>

        <Reveal className="mt-4 flex flex-wrap items-center gap-2" data-testid="map-filter-bar">
          <Select value={locality} onValueChange={setLocality}>
            <SelectTrigger className="h-9 w-[180px] rounded-full border-divider text-[13px] font-semibold" data-testid="map-filter-locality"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All localities</SelectItem>
              {localities.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="h-9 w-[160px] rounded-full border-divider text-[13px] font-semibold" data-testid="map-filter-size"><SelectValue /></SelectTrigger>
            <SelectContent>{SIZES.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
          </Select>
          <div className="flex gap-1.5 flex-wrap">
            {["all", "Silver", "Gold", "Platinum"].map((v) => (
              <Chip key={v} active={pkg === v} onClick={() => setPkg(v)} data-testid={`map-filter-package-${v.toLowerCase()}`}>{v === "all" ? "All packages" : v}</Chip>
            ))}
          </div>
          <span className="ml-auto font-mono text-[12px] text-ink/60" data-testid="map-result-count">{filtered.length} projects</span>
        </Reveal>

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          <Reveal className="lg:col-span-2 relative rounded-2xl border border-divider bg-paper overflow-hidden min-h-[460px] lg:min-h-[720px]" data-testid="projects-map">
            {isLoading && <div className="absolute inset-0 z-[1000] grid place-items-center bg-paper font-mono text-[12px] text-ink/50">Loading 297 pins…</div>}
            <MapContainer bounds={LUCKNOW_BOUNDS} scrollWheelZoom className="h-full w-full" style={{ height: "100%", width: "100%" }} data-testid="projects-map-canvas">
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <FitToPoints locality={locality} points={points} />
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
          </Reveal>
          <Reveal delay={0.1} className="lg:min-h-[720px]" data-testid="map-project-panel">
            {active ? <ProjectCard p={active} /> : <div className="card-gb p-6 h-full grid place-items-center text-ink/50">No projects match these filters.</div>}
          </Reveal>
        </div>
      </Container>
    </section>
  );
};
