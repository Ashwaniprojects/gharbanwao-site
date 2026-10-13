import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Download, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Container, MonoLabel, Reveal, SectionHeader } from "./shared";
import { UnitToggle } from "./HeroCalculator";
import { CalcDonut, CalcTimeline } from "./CalcCharts";
import { CalcResources } from "./CalcResources";
import { ShareEstimateModal } from "./ShareEstimateModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCalc } from "@/lib/calcContext";
import { formatINR } from "@/lib/calc";
import { scrollToId } from "@/lib/scroll";
import { downloadEstimatePDF } from "@/lib/pdf";

const Field = ({ label, children }) => (
  <label className="grid gap-1.5">
    <span className="text-[13px] font-semibold text-ink/70">{label}</span>
    {children}
  </label>
);

export const CalculatorSection = ({ standalone = false }) => {
  const { config, inputs, setInput, estimate, step, setStep, isError } = useCalc();
  const [shareOpen, setShareOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!estimate) return;
    setPdfLoading(true);
    try {
      await downloadEstimatePDF({ estimate, inputs, config });
    } catch {
      toast.error("Could not generate the PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <section id="calculator" className={`section-gb ${standalone ? "" : "border-t border-divider"}`} data-testid="calculator-section">
      <Container>
        <SectionHeader label="PLANNING TOOL" title="What will your home actually cost?" supporting={`Honest numbers. Phase-wise. No one-page quote with "consultation fee extra." Updated to October 2026 Lucknow rates.`} />

        <Reveal className="mt-12 rounded-2xl bg-wash-yellow border border-divider p-6 md:p-8" data-testid="calculator-step1">
          <div className="flex items-center justify-between mb-6">
            <MonoLabel>Step 01 · Inputs</MonoLabel>
            <MonoLabel className="text-ink/40">Rates updated {config?.updated || "—"}</MonoLabel>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Select State">
              <Select value={inputs.state} onValueChange={(v) => setInput("state", v)}>
                <SelectTrigger className="h-12 rounded-lg border-divider bg-paper text-[16px] font-medium" data-testid="calc-state-dropdown"><SelectValue /></SelectTrigger>
                <SelectContent>{(config?.states || ["Uttar Pradesh"]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Select City">
              <Select value={inputs.city} onValueChange={(v) => setInput("city", v)}>
                <SelectTrigger className="h-12 rounded-lg border-divider bg-paper text-[16px] font-medium" data-testid="calc-city-dropdown"><SelectValue /></SelectTrigger>
                <SelectContent>{(config?.cities || ["Lucknow"]).map((c) => <SelectItem key={c} value={c} data-testid={`calc-city-option-${c.toLowerCase()}`}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <div className="grid gap-1.5">
              <span className="text-[13px] font-semibold text-ink/70">Plot Area</span>
              <div className="flex gap-2">
                <input type="number" min="100" value={inputs.area} onChange={(e) => setInput("area", e.target.value === "" ? "" : Number(e.target.value))} className="input-gb flex-1 font-mono" data-testid="calc-area-input" />
                <UnitToggle value={inputs.unit} onChange={(v) => setInput("unit", v)} idPrefix="calc" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center gap-4 border-t border-ink/10 pt-6">
            <div className="flex flex-wrap gap-x-8 gap-y-2 flex-1" data-testid="calc-live-preview">
              <p className="text-[15px]">Cost per sqft: <strong className="font-mono text-[17px]" data-testid="calc-preview-per-sqft">{estimate ? formatINR(estimate.perSqft) : "—"}</strong></p>
              <p className="text-[15px]">Total Estimated Cost: <strong className="font-mono text-[17px] text-green-700" data-testid="calc-preview-total">{estimate ? formatINR(estimate.total) : "—"}</strong></p>
              {isError && <p className="text-red-600 text-[14px]" data-testid="calc-error">Rates could not be loaded.</p>}
            </div>
            <button onClick={() => setStep(step === 1 ? 2 : 1)} className="btn-animated" data-testid="calc-next-button">
              {step === 1 ? "Next" : "Edit inputs"} <ArrowRight className={`arr-icon h-[18px] w-[18px] transition-transform ${step === 1 ? "" : "rotate-180"}`} strokeWidth={2.5} />
            </button>
          </div>
        </Reveal>

        <AnimatePresence initial={false}>
          {step >= 2 && estimate && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden" data-testid="calculator-step2">
              <div className="pt-8">
                <MonoLabel className="block mb-5">Step 02 · Cost breakdown · {inputs.city} · {Math.round(estimate.sqft).toLocaleString("en-IN")} sqft</MonoLabel>
                <div className="grid lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-4 card-gb p-6" data-testid="calc-donut-block">
                    <h3 className="text-[18px] font-bold">Phase-wise split</h3>
                    <CalcDonut estimate={estimate} />
                  </div>
                  <div className="lg:col-span-8 card-gb p-6" data-testid="calc-timeline-block">
                    <h3 className="text-[18px] font-bold">Timeline · days per phase</h3>
                    <CalcTimeline estimate={estimate} />
                  </div>
                  <div className="lg:col-span-12 card-gb p-6 md:p-8" data-testid="calc-resources-block">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-5">
                      <div>
                        <h3 className="text-[18px] font-bold">Resource allocation</h3>
                        <p className="text-[14px] text-ink/60">Change a quality tier. The total recalculates live. Default is Medium — matches real market pricing.</p>
                      </div>
                    </div>
                    <CalcResources />
                  </div>
                </div>

                <div className="mt-8 flex flex-col md:flex-row md:items-center gap-3 md:justify-end no-print" data-testid="calculator-step3">
                  <MonoLabel className="md:mr-auto">Step 03 · Actions</MonoLabel>
                  <button onClick={handleDownloadPdf} disabled={pdfLoading} className="btn-animated disabled:opacity-60" data-testid="calc-download-pdf-button">
                    <Download className="arr-icon h-[18px] w-[18px]" strokeWidth={2.5} /> {pdfLoading ? "Preparing PDF…" : "Download PDF"}
                  </button>
                  <button onClick={() => window.print()} className="btn-animated" data-testid="calc-print-button"><Printer className="arr-icon h-[18px] w-[18px]" strokeWidth={2.5} /> Print Final Estimate</button>
                  <button onClick={() => setShareOpen(true)} className="btn-animated" data-testid="calc-share-button"><Share2 className="arr-icon h-[18px] w-[18px]" strokeWidth={2.5} /> Share Final Estimate</button>
                  <button onClick={() => scrollToId("contact")} className="btn-animated" data-testid="calc-book-visit-button">Book Free Site Visit <ArrowRight className="arr-icon h-[18px] w-[18px]" strokeWidth={2.5} /></button>
                </div>
                <p className="mt-2 text-right text-[12px] text-ink/50 no-print" data-testid="calc-download-pdf-hint">Download the PDF to send it to family or save for your records — no sign-up needed.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-8 font-mono text-[11px] leading-relaxed text-ink/50 max-w-4xl" data-testid="calc-legal">
          Costs shown are approximate for each resource. Actual cost estimates may vary for your city and your specific requirements. Not a binding quote. Available at Ghar Banwao official offices and partner outlets. Default quality is set to Medium — you can change this.
        </p>
      </Container>
      <ShareEstimateModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </section>
  );
};
