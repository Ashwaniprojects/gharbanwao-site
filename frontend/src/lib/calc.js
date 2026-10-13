export const toSqft = (area, unit) => (unit === "sqm" ? area * 10.7639 : area);

export const formatINR = (n) => "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n || 0));

export const formatLakh = (n) => {
  if (!n) return "₹0";
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  return `₹${(n / 1e5).toFixed(2)} L`;
};

export function computeEstimate(config, { city, area, unit, qualities }) {
  const sqft = toSqft(Number(area) || 0, unit);
  const mult = config.city_multipliers[city] ?? 1;
  const rows = Object.entries(config.resources).map(([key, r]) => {
    const quality = qualities[key] || "medium";
    const qty = sqft * r.per_sqft;
    const rate = r.quality[quality];
    return { key, label: r.label, unit: r.unit, qty, quality, rate, amount: Math.round(qty * rate * mult) };
  });
  const total = rows.reduce((s, r) => s + r.amount, 0);
  const phases = Object.entries(config.phases).map(([key, p]) => ({
    key,
    label: p.label,
    days: p.days,
    percent: p.percent_of_cost,
    amount: Math.round((total * p.percent_of_cost) / 100),
  }));
  const days = phases.reduce((s, p) => s + p.days, 0);
  return { sqft, total, perSqft: sqft ? Math.round(total / sqft) : 0, rows, phases, days, city, mult };
}

export const chartColor = (i, n) => {
  // green (#93C526) → yellow (#FFFF00) interpolation
  const t = n <= 1 ? 0 : i / (n - 1);
  const lerp = (a, b) => Math.round(a + (b - a) * t);
  return `rgb(${lerp(147, 255)}, ${lerp(197, 255)}, ${lerp(38, 0)})`;
};
