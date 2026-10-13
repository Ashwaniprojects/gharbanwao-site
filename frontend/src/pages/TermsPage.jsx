import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { Footer, MobileBar } from "@/components/site/FaqCtaFooter";
import { Container, Reveal, SectionHeader } from "@/components/site/shared";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-paper text-ink" data-testid="terms-page">
      <AnnouncementStrip />
      <Navbar />
      <main>
        <section className="section-gb" data-testid="terms-hero">
          <Container className="max-w-3xl">
            <Reveal>
              <SectionHeader label="TERMS & CONDITIONS" title="The agreement between us." align="center" />
            </Reveal>
            <Reveal className="mt-4">
              <p className="text-[14px] text-ink/60 text-center">Last updated: January 2026</p>
            </Reveal>
          </Container>
        </section>

        <section className="section-gb bg-wash-yellow" data-testid="terms-content">
          <Container className="max-w-3xl">
            {[
              { title: "Agreement scope", body: "These terms govern all construction, design, renovation, and interior services provided by Ghar Banwao. By signing a project agreement or submitting a consultation request, you agree to these terms. If you do not agree, do not proceed with the service." },
              { title: "Quotations and pricing", body: "Quotes are valid for 30 days from the date of issue. Prices include only what is explicitly listed in the quote. Plot cost, government approval fees, electricity and water connection charges, boundary walls beyond 4 ft, and interiors not listed in the package are excluded and charged separately." },
              { title: "Payment schedule", body: "Payments are linked to stage completion, not calendar dates. Silver package has 7 instalments, Gold and Platinum have 9. Each instalment is released only after you sign off the completed stage in writing (including WhatsApp confirmation). No payment is due before the stage is complete." },
              { title: "Delays and force majeure", body: "Our published average delay is 11 days. Delays caused by our team carry a per-day deduction as specified in the agreement. Delays from government approvals, weather, or your design changes are logged and shared on WhatsApp. Force majeure events (floods, pandemics, strikes) pause timelines without penalty to either party." },
              { title: "Materials and substitutions", body: "All materials are specified by brand, grade, and quantity in the quote. Substitution requires your written approval (including WhatsApp). Unauthorized substitution by any team member is a breach of contract and will be rectified at our cost." },
              { title: "Warranty", body: "The RCC structure carries a 25-year written warranty. Finishes carry a 12-month support warranty. Warranties are transferable on resale. Warranty claims must be reported within 30 days of discovering the issue. We will fix it within 48 hours of the site visit." },
              { title: "Cancellation and refund", body: "Either party may cancel with 30 days written notice. If you cancel after work has begun, you will be billed for all completed stages plus materials already procured. Any advance payment beyond billed stages is refunded within 15 working days." },
              { title: "Dispute resolution", body: "Any dispute arising from these terms or the project agreement shall first be attempted to resolve through mutual discussion. If unresolved within 30 days, the dispute shall be referred to arbitration under the Arbitration and Conciliation Act, 1996, with the seat of arbitration in Lucknow." },
              { title: "Governing law", body: "These terms are governed by the laws of India. Courts in Lucknow shall have exclusive jurisdiction over any matter not resolved by arbitration." },
              { title: "Contact", body: "For questions about these terms, contact us at hello@gharbanwao.com or call 09648249999. Office address: 16/284, near Munshipulia, Indira Nagar, Lucknow 226016." },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <div className="card-gb p-6 md:p-8 bg-paper">
                  <h3 className="font-bold text-[16px]">{s.title}</h3>
                  <p className="mt-3 text-[15px] text-ink/70 leading-relaxed">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </Container>
        </section>
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
