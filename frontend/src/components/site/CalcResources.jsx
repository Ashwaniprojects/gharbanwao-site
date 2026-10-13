import { formatINR } from "@/lib/calc";
import { useCalc } from "@/lib/calcContext";

const TIERS = ["basic", "medium", "premium"];

export const CalcResources = () => {
  const { estimate, setQuality, resetQualities, qualities } = useCalc();
  if (!estimate) return null;
  const fmtQty = (q) => (q >= 100 ? Math.round(q).toLocaleString("en-IN") : q.toFixed(1));

  return (
    <div className="overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0" data-testid="calc-resources-table">
      <table className="w-full min-w-[720px] text-[14px]">
        <thead>
          <tr className="mono-label text-[11px] text-ink/50 text-left">
            <th className="py-3 pr-4 font-medium">Resource</th>
            <th className="py-3 pr-4 font-medium">Quantity</th>
            <th className="py-3 pr-4 font-medium">Quality tier</th>
            <th className="py-3 pr-4 font-medium text-right">Rate</th>
            <th className="py-3 font-medium text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {estimate.rows.map((r) => (
            <tr key={r.key} className="border-t border-divider odd:bg-wash-yellow/60" data-testid={`calc-resource-row-${r.key}`}>
              <td className="py-3 pr-4 font-semibold">{r.label}</td>
              <td className="py-3 pr-4 font-mono text-[13px]">{fmtQty(r.qty)} {r.unit}</td>
              <td className="py-3 pr-4">
                <div className="inline-flex rounded-lg border border-divider bg-paper p-0.5" role="radiogroup" aria-label={`${r.label} quality`}>
                  {TIERS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={r.quality === t}
                      onClick={() => setQuality(r.key, t)}
                      className={`h-8 px-3 rounded-md text-[12px] font-semibold capitalize transition-colors ${r.quality === t ? "bg-green text-ink" : "text-ink/55 hover:text-ink"}`}
                      data-testid={`calc-quality-${r.key}-${t}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </td>
              <td className="py-3 pr-4 font-mono text-[13px] text-right text-ink/70">₹{r.rate}/{r.unit.replace(/s$/, "")}</td>
              <td className="py-3 font-mono text-[14px] text-right" data-testid={`calc-resource-amount-${r.key}`}>{formatINR(r.amount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-ink">
            <td className="py-4 font-bold text-[16px]" colSpan={2}>Total estimated cost</td>
            <td className="py-4">
              {Object.keys(qualities).length > 0 && (
                <button onClick={resetQualities} className="text-[12px] font-semibold underline underline-offset-4 decoration-green" data-testid="calc-reset-qualities">Reset to Medium</button>
              )}
            </td>
            <td className="py-4 font-mono text-[13px] text-right text-ink/70">{formatINR(estimate.perSqft)}/sqft</td>
            <td className="py-4 font-mono font-bold text-[18px] text-right text-green-700" data-testid="calc-resources-total">{formatINR(estimate.total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
