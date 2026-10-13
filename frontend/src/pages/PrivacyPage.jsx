import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { Footer, MobileBar } from "@/components/site/FaqCtaFooter";
import { Container, Reveal, SectionHeader } from "@/components/site/shared";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper text-ink" data-testid="privacy-page">
      <AnnouncementStrip />
      <Navbar />
      <main>
        <section className="section-gb" data-testid="privacy-hero">
          <Container className="max-w-3xl">
            <Reveal>
              <SectionHeader label="PRIVACY POLICY" title="How we handle your data." align="center" />
            </Reveal>
            <Reveal className="mt-4">
              <p className="text-[14px] text-ink/60 text-center">Last updated: January 2026</p>
            </Reveal>
          </Container>
        </section>

        <section className="section-gb bg-wash-yellow" data-testid="privacy-content">
          <Container className="max-w-3xl">
            {[
              { title: "Information we collect", body: "We collect only the information you voluntarily provide: your name, phone number, city, locality, and any details you share in our consultation or registration forms. We do not collect sensitive personal data such as financial records, Aadhaar numbers, or government IDs unless you choose to share them." },
              { title: "How we use your data", body: "Your phone number is used to call you for the consultation you requested. Your email is used to send project updates, quotes, and follow-ups. We do not sell, rent, or share your data with third-party advertisers. Your data is shared only with our internal teams (project managers, engineers, site supervisors) who need it to serve you." },
              { title: "Data storage and security", body: "Your data is stored on secure servers. We use encryption in transit and at rest. Access is restricted to authorized personnel only. We retain your data for the duration of your project plus 24 months, after which it is archived unless you request deletion." },
              { title: "Cookies and tracking", body: "Our website uses essential cookies for navigation and analytics cookies to understand how visitors use our site. We do not use cookies for advertising retargeting. You can disable cookies in your browser settings." },
              { title: "Your rights", body: "You have the right to request access to your data, request correction of inaccurate data, request deletion of your data, and withdraw consent for communication at any time. To exercise any of these rights, contact us at hello@gharbanwao.com or call 09648249999." },
              { title: "Third-party services", body: "We use WhatsApp Business (aisensy), Google Maps, YouTube embeds, and Vercel for hosting. Each service has its own privacy policy. We recommend reviewing those policies independently." },
              { title: "Changes to this policy", body: "We may update this policy from time to time. Changes will be posted on this page with an updated 'Last updated' date. Continued use of our services after changes constitutes acceptance of the updated policy." },
              { title: "Contact us", body: "For privacy-related questions, email us at hello@gharbanwao.com or call 09648249999. Our office is at 16/284, near Munshipulia, Indira Nagar, Lucknow 226016." },
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
