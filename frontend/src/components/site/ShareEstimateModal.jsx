import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createLead } from "@/lib/api";
import { useCalc } from "@/lib/calcContext";
import { formatINR } from "@/lib/calc";

export const ShareEstimateModal = ({ open, onClose }) => {
  const { estimate, inputs } = useCalc();
  const [form, setForm] = useState({ name: "", phone: "", whatsapp_ok: true });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const mutation = useMutation({
    mutationFn: createLead,
    onSuccess: (res) => {
      toast.success("Estimate on its way to your WhatsApp.", { description: "Our team will also call within 2 hours on business days." });
      // If the WhatsApp push did not go through, open a pre-filled chat so the
      // estimate still reaches us.
      if (res && res.whatsapp_fallback) {
        window.open(res.whatsapp_fallback, "_blank", "noopener");
      }
      setForm({ name: "", phone: "", whatsapp_ok: true });
      onClose();
    },
    onError: () => toast.error("Could not send. Please try again or WhatsApp us at 09648249999."),
  });

  const submit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...form,
      city: inputs.city,
      plot_size: `${inputs.area} ${inputs.unit}`,
      source: "share_estimate",
      estimate: estimate && { total: estimate.total, per_sqft: estimate.perSqft, sqft: Math.round(estimate.sqft), city: inputs.city, qualities: Object.fromEntries(estimate.rows.map((r) => [r.key, r.quality])) },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-2xl border-divider max-w-md" data-testid="share-estimate-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold tracking-tight">Share your estimate</DialogTitle>
          <DialogDescription className="text-ink/60">
            We'll send {estimate ? <strong className="text-ink">{formatINR(estimate.total)}</strong> : "the estimate"} as a PDF to your WhatsApp. No spam, no follow-up calls unless you ask.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 mt-2">
          <input required placeholder="Your name" value={form.name} onChange={set("name")} className="input-gb" data-testid="share-name-input" />
          <input required type="tel" pattern="[0-9+ ]{10,14}" placeholder="Phone number" value={form.phone} onChange={set("phone")} className="input-gb" data-testid="share-phone-input" />
          <label className="flex items-center gap-3 text-[15px] font-medium">
            <input type="checkbox" checked={form.whatsapp_ok} onChange={set("whatsapp_ok")} className="h-5 w-5 accent-[#93C526]" data-testid="share-whatsapp-checkbox" />
            WhatsApp OK? Send the PDF there.
          </label>
          <button type="submit" disabled={mutation.isPending} className="pill-green h-12 disabled:opacity-60" data-testid="share-submit-button">
            {mutation.isPending ? "Sending…" : "Send my estimate"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
