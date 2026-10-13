import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { chartColor, formatINR } from "@/lib/calc";

const TooltipBox = ({ active, payload, total }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-divider bg-paper px-3 py-2 shadow-lg font-mono text-[12px]" data-testid="calc-chart-tooltip">
      <p className="font-sans font-bold text-[13px]">{d.label}</p>
      <p>{formatINR(d.amount)} · {total ? ((d.amount / total) * 100).toFixed(1) : d.percent}%</p>
      {d.days != null && <p>{d.days} days</p>}
    </div>
  );
};

export const CalcDonut = ({ estimate }) => {
  const n = estimate.phases.length;
  return (
    <div className="relative h-[300px] mt-2" data-testid="calc-donut-chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={estimate.phases} dataKey="amount" nameKey="label" innerRadius="62%" outerRadius="92%" paddingAngle={1.5} stroke="#fff" strokeWidth={2} isAnimationActive>
            {estimate.phases.map((p, i) => <Cell key={p.key} fill={chartColor(i, n)} />)}
          </Pie>
          <Tooltip content={<TooltipBox total={estimate.total} />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="text-center">
          <p className="mono-label text-[10px] text-ink/50">Total</p>
          <p className="font-extrabold tracking-tight text-[20px] leading-tight" data-testid="calc-donut-total">{formatINR(estimate.total)}</p>
        </div>
      </div>
    </div>
  );
};

export const CalcTimeline = ({ estimate }) => {
  const n = estimate.phases.length;
  const max = Math.max(...estimate.phases.map((p) => p.days));
  return (
    <div className="mt-4" data-testid="calc-timeline-chart">
      <ul className="space-y-2.5">
        {estimate.phases.map((p, i) => (
          <li key={p.key} className="grid grid-cols-[130px_1fr] md:grid-cols-[170px_1fr] items-center gap-3 group" data-testid={`calc-timeline-row-${p.key}`}>
            <span className="font-mono text-[11px] md:text-[12px] text-right truncate">{p.label}</span>
            <div className="flex items-center gap-3">
              <div className="h-5 rounded-r-md transition-[width] duration-500 ease-out group-hover:brightness-95" style={{ width: `${(p.days / max) * 60}%`, background: chartColor(i, n) }} />
              <span className="font-mono text-[11px] whitespace-nowrap">{p.days} Days · {formatINR(p.amount)}</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.1em] border-t border-divider pt-3" data-testid="calc-timeline-total">Overall duration: <strong>{estimate.days} days</strong></p>
    </div>
  );
};
