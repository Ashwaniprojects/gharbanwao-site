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

// Ghar Banwao's stage-linked payment schedule, read off the live total. Each
// instalment is only released after the matching stage is signed off — the
// last stage is "Remaining" so the instalments always add to the total.
export const CalcPaymentSchedule = ({ estimate }) => {
  if (!estimate || !Array.isArray(estimate.schedule)) return null;
  return (
    <div className="mt-4" data-testid="calc-schedule-block">
      <ol className="space-y-0">
        {estimate.schedule.map((s) => (
          <li key={s.stage} className="grid grid-cols-[1fr_auto] items-center gap-3 py-2.5 border-b border-divider last:border-0" data-testid={`calc-schedule-row-${s.index}`}>
            <div className="flex items-start gap-3 min-w-0">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green font-mono text-[10px] font-bold text-ink">{s.index + 1}</span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold leading-snug">{s.stage}</p>
                {s.note ? <p className="mt-0.5 text-[11px] text-ink/50 leading-relaxed">{s.note}</p> : null}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono text-[15px] font-bold text-green-700">{formatINR(s.amount)}</p>
              <p className="font-mono text-[11px] text-ink/50">{typeof s.pct === "number" ? `${s.pct}%` : "Balance"}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.1em] border-t border-divider pt-3" data-testid="calc-schedule-total">
        Total payable in instalments: <strong>{formatINR(estimate.total)}</strong>
      </p>
      <p className="mt-2 font-mono text-[11px] text-ink/50">Every instalment is released only after you inspect and sign off the completed stage. All payments must be completed 15 days before possession.</p>
    </div>
  );
};
