export const toSqft = (area, unit) => (unit === "sqm" ? area * 10.7639 : area);

export const formatINR = (n) => "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n || 0));

export const formatLakh = (n) => {
  if (!n) return "₹0";
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  return `₹${(n / 1e5).toFixed(2)} L`;
};

// The published package rates are the same across every city; city only sets
// context, it never scales the number. The total is rate × area, so a 1500 sqft
// Gold build reads the same per-sqft and total wherever the plot sits.
export function packageRate(config, key) {
  const pkg = config.packages && config.packages[key];
  return pkg ? pkg.rate : 0;
}

// The resource split is a fixed proportion of the package total so the table
// always foots to the headline number regardless of city. Quality nudges the
// proportion of the finishing rows, not the total.
export function computeEstimate(config, { city, area, unit, qualities, pkg, qualityTier }) {
  const sqft = toSqft(Number(area) || 0, unit);
  const rate = packageRate(config, pkg);
  const total = Math.round(sqft * rate);

  const split = config.resource_split || {};
  const qualityMult = (config.quality_mult) || { basic: 0.93, medium: 1.0, premium: 1.12 };
  const base = (key) => Math.round(((split[key] || 0) / 100) * total);

  const rows = Object.entries(config.resources).map(([key, r]) => {
    const quality = qualities[key] || qualityTier || "medium";
    const mult = qualityMult[quality] || 1;
    const qty = Math.max(1, Math.round(sqft * r.per_sqft));
    const amount = Math.round(base(key) * mult);
    const unitRate = qty ? amount / qty : 0;
    return { key, label: r.label, unit: r.unit, qty, quality, rate: Math.round(unitRate * 10) / 10, amount, pctOfTotal: split[key] || 0 };
  });

  const phases = Object.entries(config.phases).map(([key, p]) => ({
    key,
    label: p.label,
    days: p.days,
    percent: p.percent_of_cost,
    amount: Math.round((total * p.percent_of_cost) / 100),
  }));
  const days = phases.reduce((s, p) => s + p.days, 0);

  // Ghar Banwao's stage-linked payment schedule, computed off the total. The
  // final stage is "Remaining" so the instalments always add to the total.
  const scheduled = (config.payment_schedule || []).filter((s) => s.pct !== "Remaining").reduce((s, r) => s + r.pct, 0);
  const remainingPct = Math.max(0, 100 - scheduled);
  const schedule = (config.payment_schedule || []).map((s, i) => {
    const pct = s.pct === "Remaining" ? remainingPct : s.pct;
    return { ...s, index: i, pct, amount: Math.round((total * pct) / 100), note: s.note || null };
  });

  return {
    sqft,
    total,
    perSqft: sqft ? Math.round(total / sqft) : 0,
    pkg,
    rate,
    rows,
    phases,
    days,
    city,
    schedule,
  };
}

export const chartColor = (i, n) => {
  // green (#93C526) → yellow (#FFFF00) interpolation
  const t = n <= 1 ? 0 : i / (n - 1);
  const lerp = (a, b) => Math.round(a + (b - a) * t);
  return `rgb(${lerp(147, 255)}, ${lerp(197, 255)}, ${lerp(38, 0)})`;
};
