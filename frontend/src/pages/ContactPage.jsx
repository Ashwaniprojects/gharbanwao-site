import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { Footer, MobileBar } from "@/components/site/FaqCtaFooter";
import { Container, Reveal, SectionHeader } from "@/components/site/shared";
import { ArrowRight, Phone, MessageCircle, MapPin, Mail, Clock } from "lucide-react";
import { WHATSAPP_URL } from "@/data/content";
import { Helmet } from "react-helmet-async";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-paper text-ink" data-testid="contact-page">
      <Helmet>
        <title>Contact Us — House Construction Company in Lucknow | Ghar Banwao</title>
        <meta name="description" content="Contact Ghar Banwao, a house construction company in Lucknow. Call 09648249999 or WhatsApp 09198059992. Office in Indira Nagar, Lucknow. We respond within 2 hours on business days." />
        <meta name="keywords" content="construction company Lucknow contact, house building contractor Lucknow, builder in Indira Nagar Lucknow, house construction company Uttar Pradesh, Ghar Banwao contact" />
        <link rel="canonical" href="https://gharbanwao.com/contact" />
        <meta property="og:title" content="Contact Ghar Banwao — House Construction in Lucknow" />
        <meta property="og:description" content="One number, one WhatsApp, one person accountable. We respond within 2 hours on business days." />
        <meta property="og:url" content="https://gharbanwao.com/contact" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomeConstructionBusiness",
            name: "Ghar Banwao",
            url: "https://gharbanwao.com",
            telephone: "+91-9648249999",
            email: "hello@gharbanwao.com",
            areaServed: "Lucknow, Uttar Pradesh",
            address: {
              "@type": "PostalAddress",
              streetAddress: "16/284, near Munshipulia, next to Ashirwad Bakery",
              addressLocality: "Indira Nagar, Lucknow",
              addressRegion: "Uttar Pradesh",
              postalCode: "226016",
              addressCountry: "IN",
            },
            openingHoursSpecification: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              opens: "09:00",
              closes: "18:00",
            },
            hasMap: "https://maps.google.com",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+91-9648249999",
              contactType: "customer service",
              availableLanguage: ["en", "hi"],
              areaServed: "Uttar Pradesh",
            },
          })}
        </script>
      </Helmet>
      <AnnouncementStrip />
      <Navbar />
      <main>
        <section className="section-gb" data-testid="contact-hero">
          <Container className="max-w-4xl">
            <Reveal>
              <SectionHeader
                label="CONTACT US"
                title="Talk to someone who answers."
                supporting="One number. One WhatsApp. One person accountable. We respond within 2 hours on business days."
                align="center"
              />
            </Reveal>
          </Container>
        </section>

        <section className="section-gb bg-wash-yellow" data-testid="contact-cards">
          <Container>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: Phone, label: "Call us", value: "09648249999", href: "tel:09648249999" },
                { icon: MessageCircle, label: "WhatsApp", value: "09198059992", href: WHATSAPP_URL },
                { icon: Mail, label: "Email", value: "hello@gharbanwao.com", href: "mailto:hello@gharbanwao.com" },
                { icon: MapPin, label: "Visit us", value: "Indira Nagar, Lucknow", href: "https://maps.google.com" },
              ].map((c, i) => (
                <Reveal key={c.label} delay={i * 0.06}>
                  <a href={c.href} target="_blank" rel="noreferrer" className="card-gb p-6 bg-paper block group" data-testid={`contact-card-${i + 1}`}>
                    <c.icon className="h-6 w-6 text-green-700 mb-3" />
                    <p className="mono-label text-ink/60">{c.label}</p>
                    <p className="mt-1 font-bold text-[15px] group-hover:text-green-700 transition-colors">{c.value}</p>
                  </a>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="section-gb" data-testid="contact-hours">
          <Container className="max-w-4xl">
            <Reveal>
              <div className="card-gb p-8 bg-paper">
                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-green-700 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-[17px]">Working hours</h3>
                    <p className="mt-2 text-[15px] text-ink/70">Monday – Saturday: 9:00 AM – 6:00 PM</p>
                    <p className="text-[15px] text-ink/70">Sunday: Closed</p>
                    <p className="mt-3 text-[14px] text-ink/60">Site visits are also available on request outside these hours. Call us to arrange.</p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal className="mt-6">
              <div className="card-gb p-8 bg-paper">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-green-700 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-[17px]">Office address</h3>
                    <p className="mt-2 text-[15px] text-ink/70">16/284, near Munshipulia, next to Ashirwad Bakery</p>
                    <p className="text-[15px] text-ink/70">Indira Nagar, Lucknow, Uttar Pradesh 226016</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>

        <section className="section-gb bg-wash-yellow" data-testid="contact-cta">
          <Container className="max-w-3xl text-center">
            <Reveal>
              <SectionHeader
                label="PREFER A CALL?"
                title="We call you within 2 hours."
                supporting="Fill in your number below and our team will call you on a business day."
                align="center"
              />
            </Reveal>
            <Reveal className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="pill-yellow px-8" data-testid="contact-whatsapp-btn">
                Chat on WhatsApp
              </a>
              <a href="tel:09648249999" className="pill-green h-12 px-6 text-[15px]" data-testid="contact-call-btn">
                Call 09648249999 <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
              </a>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
