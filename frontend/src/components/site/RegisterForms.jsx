import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CITIES } from "@/data/content";
import { createRegistration } from "@/lib/api";

const VENDOR_CATEGORIES = ["Cement & Building Materials", "Steel & TMT", "Tiles & Sanitaryware", "Electrical & Plumbing", "Paints & Finishes", "Other"];
const EXPERIENCE = ["New / first-time", "1–3 years", "3–5 years", "5+ years"];
const ROLES = ["Site Engineer", "Site Supervisor", "Architect / Designer", "Interior Designer", "Quality Inspector", "Customer Success", "Other"];

const FIELDS = {
  vendor: { extra: "category", extraLabel: "Category", extraOptions: VENDOR_CATEGORIES, companyLabel: "Company / firm name", messageLabel: "What can you supply, and at what volume?" },
  channel_partner: { extra: "experience_years", extraLabel: "Years active in real estate / referrals", extraOptions: EXPERIENCE, companyLabel: "Firm name (if any)", messageLabel: "Which localities do you operate in?" },
  hiring: { extra: "role", extraLabel: "Role you're applying for", extraOptions: ROLES, companyLabel: "Current employer (if any)", messageLabel: "Tell us about your experience" },
};

export const RegisterForm = ({ type }) => {
  const cfg = FIELDS[type];
  const [f, setF] = useState({ name: "", phone: "", email: "", city: "Lucknow", company_name: "", extra: "", message: "" });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e?.target ? e.target.value : e }));

  const mutation = useMutation({
    mutationFn: createRegistration,
    onSuccess: (res) => {
      toast.success("Received. We'll reach out within 2 business days.");
      // If the WhatsApp push did not go through, hand the user a pre-filled
      // chat so the registration still reaches us.
      if (res && res.whatsapp_fallback) {
        window.open(res.whatsapp_fallback, "_blank", "noopener");
      }
      setF({ name: "", phone: "", email: "", city: "Lucknow", company_name: "", extra: "", message: "" });
    },
    onError: () => toast.error("Could not submit. Please WhatsApp us at 09648249999."),
  });

  const submit = (e) => {
    e.preventDefault();
    mutation.mutate({
      type,
      name: f.name,
      phone: f.phone,
      email: f.email || undefined,
      city: f.city,
      company_name: f.company_name || undefined,
      [cfg.extra]: f.extra || undefined,
      message: f.message || undefined,
    });
  };

  return (
    <form onSubmit={submit} className="card-gb p-6 md:p-8 bg-paper grid gap-4" data-testid={`register-form-${type}`}>
      <div className="grid sm:grid-cols-2 gap-4">
        <input required placeholder="Full name" value={f.name} onChange={set("name")} className="input-gb" data-testid={`register-${type}-name-input`} />
        <input required type="tel" pattern="[0-9+ ]{10,14}" placeholder="Phone number" value={f.phone} onChange={set("phone")} className="input-gb" data-testid={`register-${type}-phone-input`} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input type="email" placeholder="Email (optional)" value={f.email} onChange={set("email")} className="input-gb" data-testid={`register-${type}-email-input`} />
        <Select value={f.city} onValueChange={set("city")}>
          <SelectTrigger className="h-12 rounded-lg border-divider text-[16px]" data-testid={`register-${type}-city-select`}><SelectValue placeholder="City" /></SelectTrigger>
          <SelectContent>{[...CITIES, "Other"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input placeholder={cfg.companyLabel} value={f.company_name} onChange={set("company_name")} className="input-gb" data-testid={`register-${type}-company-input`} />
        <Select value={f.extra} onValueChange={set("extra")}>
          <SelectTrigger className="h-12 rounded-lg border-divider text-[16px]" data-testid={`register-${type}-extra-select`}><SelectValue placeholder={cfg.extraLabel} /></SelectTrigger>
          <SelectContent>{cfg.extraOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <textarea placeholder={cfg.messageLabel} value={f.message} onChange={set("message")} rows={3} className="input-gb resize-none" data-testid={`register-${type}-message-input`} />
      <button type="submit" disabled={mutation.isPending} className="pill-green h-14 text-[17px] disabled:opacity-60" data-testid={`register-${type}-submit-button`}>
        {mutation.isPending ? "Submitting…" : "Submit"} <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </form>
  );
};
