import axios from "axios";

// Calculator rates and resource tables ship with the app — no backend needed.
import calculatorConfig from "@/data/calculator_config.json";

export const CALCULATOR_CONFIG = calculatorConfig;

export const fetchCalculatorConfig = async () => calculatorConfig;

// Live projects come straight from the content backend. This is the source
// of truth going forward — the map panel reads from here, not from the
// static file. Right now only GB-216 is published; more will be added on the
// backend and this fetch picks them up automatically.
export const fetchLiveProjects = async (limit = 50) => {
  const base =
    process.env.CMS_BACKEND_URL ||
    process.env.REACT_APP_CMS_BACKEND_URL ||
    "https://backend-production-07ed.up.railway.app";
  const res = await fetch(`${base}/api/content/projects?limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch live projects (${res.status})`);
  const data = await res.json();
  return data.items || [];
};

// Project pins load from a static file bundled at build time.
export const fetchProjects = async (params = {}) => {
  const res = await fetch(`${process.env.PUBLIC_URL || ""}/projects.json`);
  let results = await res.json();
  const { status, locality, package: pkg, q, limit = 500 } = params;
  if (status && status !== "all") results = results.filter((p) => p.status === status);
  if (locality && locality !== "all") results = results.filter((p) => p.locality === locality);
  if (pkg && pkg !== "all") results = results.filter((p) => p.package === pkg);
  if (q) {
    const ql = q.toLowerCase();
    results = results.filter(
      (p) =>
        p.gb_id.toLowerCase().includes(ql) ||
        p.locality.toLowerCase().includes(ql) ||
        p.package.toLowerCase().includes(ql) ||
        p.city.toLowerCase().includes(ql)
    );
  }
  return results.slice(0, limit);
};

export const fetchProjectStats = async () => {
  const projects = await fetchProjects({ limit: 500 });
  return {
    handed_over: projects.filter((p) => p.status === "handed_over").length,
    ongoing: projects.filter((p) => p.status === "ongoing").length,
    total: projects.length,
    localities: [...new Set(projects.map((p) => p.locality))].sort(),
  };
};

// Lead and registration capture go through Vercel serverless functions, which
// hold the AiSensy API key server-side. See api/lead.js and api/registration.js.
export const createLead = (payload) => axios.post("/api/lead", payload).then((r) => r.data);
export const createRegistration = (payload) => axios.post("/api/registration", payload).then((r) => r.data);
