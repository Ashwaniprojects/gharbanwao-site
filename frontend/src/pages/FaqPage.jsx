import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { Footer, MobileBar, FinalCTA } from "@/components/site/FaqCtaFooter";
import { Container, Reveal, SectionHeader } from "@/components/site/shared";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQS, FAQ_GROUPS } from "@/data/content";
import { Helmet } from "react-helmet-async";
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Helmet>
        <title>House Construction FAQs in Lucknow — Cost, Timeline, Warranty | Ghar Banwao</title>
        <meta name="description" content="15 real questions about house construction in Lucknow: cost per sq. ft., 1,000 sq. ft. house price, hidden charges, construction timeline, LDA approval, material quality, warranty and how to get started with Ghar Banwao." />
        <meta name="keywords" content="house construction faq Lucknow, construction cost per sq ft Lucknow, hidden charges house construction, construction timeline Lucknow, LDA map approval, construction warranty Lucknow, turnkey construction Lucknow, Ghar Banwao faq" />
        <link rel="canonical" href="https://gharbanwao.com/faq" />
        <meta property="og:title" content="House Construction FAQs in Lucknow — Ghar Banwao" />
        <meta property="og:description" content="Cost per sq. ft., hidden charges, timeline, warranty and LDA approval — answered plainly, with the numbers." />
        <meta property="og:url" content="https://gharbanwao.com/faq" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          })}
        </script>
      </Helmet>
      <AnnouncementStrip />
      <Navbar />
      <main>
        <section className="section-gb" data-testid="faq-hero">
          <Container className="max-w-4xl">
            <Reveal>
              <SectionHeader
                label="FREQUENTLY ASKED QUESTIONS"
                title="House construction in Lucknow, answered plainly."
                supporting="These are the 15 questions homeowners ask us most, with the actual numbers instead of 'it depends'. If your question is not here, WhatsApp us and we will answer it the same day."
                align="center"
              />
            </Reveal>
            <Reveal delay={0.1} className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="tel:09648249999" className="pill-green h-12 px-6 text-[15px]"><Phone className="h-[18px] w-[18px]" strokeWidth={2.5} /> Call 09648249999</a>
              <Link to="/calculator" className="pill-yellow h-12 px-6 text-[15px] border border-ink/10">Estimate your cost</Link>
            </Reveal>
          </Container>
        </section>

        {/* Quick index */}
        <section className="section-gb bg-wash-yellow pt-0" data-testid="faq-index">
          <Container className="max-w-4xl">
            <Reveal>
              <div className="card-gb p-6 md:p-8 bg-paper">
                <p className="mono-label text-ink/50 mb-4">JUMP TO</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {FAQ_GROUPS.map((g) => (
                    <div key={g.label}>
                      <p className="font-bold text-[15px] mb-2">{g.label}</p>
                      <ol className="space-y-1.5">
                        {g.questions.map((qi) => (
                          <li key={qi} className="text-[13px] text-ink/70">
                            <a href={`#faq-${qi + 1}`} className="hover:text-ink hover:underline decoration-green decoration-2 underline-offset-2">
                              {qi + 1}. {FAQS[qi][0]}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* All 15 answers */}
        <section className="section-gb" data-testid="faq-answers">
          <Container className="max-w-4xl">
            <Accordion type="single" collapsible className="divide-y divide-divider border-y border-divider">
              {FAQS.map(([q, a], i) => (
                <AccordionItem key={q} id={`faq-${i + 1}`} value={`q${i}`} className="border-0 data-[state=open]:bg-wash-yellow px-4 -mx-4 rounded-xl transition-colors scroll-mt-28">
                  <AccordionTrigger className="py-5 text-left text-[16px] md:text-[17px] font-bold hover:no-underline [&>svg]:text-green-700">
                    <span className="flex gap-4"><span className="font-mono text-[12px] text-ink/40 mt-1.5">{String(i + 1).padStart(2, "0")}</span>{q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pl-10 text-[15px] text-ink/75 leading-relaxed">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Container>
        </section>
      </main>
      <FinalCTA />
      <Footer />
      <MobileBar />
    </div>
  );
}
