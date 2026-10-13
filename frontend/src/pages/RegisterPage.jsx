import { useState } from "react";
import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { Footer, MobileBar } from "@/components/site/FaqCtaFooter";
import { Container, MonoLabel, Reveal, SectionHeader } from "@/components/site/shared";
import { RegisterForm } from "@/components/site/RegisterForms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { REGISTER_TYPES } from "@/data/content";

export default function RegisterPage() {
  const [tab, setTab] = useState(REGISTER_TYPES[0].key);
  const active = REGISTER_TYPES.find((t) => t.key === tab);

  return (
    <div className="min-h-screen bg-paper text-ink" data-testid="register-page">
      <AnnouncementStrip />
      <Navbar />
      <main>
        <section className="section-gb" data-testid="register-section">
          <Container className="max-w-3xl">
            <SectionHeader label="GB · PARTNER WITH US" title="Register with us" supporting="Whether you supply materials, refer homeowners, or want to build with us — tell us a bit about yourself and we'll be in touch." align="center" />

            <Reveal className="mt-10">
              <Tabs value={tab} onValueChange={setTab} data-testid="register-tabs">
                <TabsList className="w-full h-auto p-1.5 rounded-full bg-wash-yellow border border-divider grid grid-cols-1 sm:grid-cols-3 gap-1">
                  {REGISTER_TYPES.map((t) => (
                    <TabsTrigger
                      key={t.key}
                      value={t.key}
                      className="h-11 rounded-full text-[14px] font-bold data-[state=active]:bg-ink data-[state=active]:text-paper data-[state=active]:shadow-none"
                      data-testid={`register-tab-${t.key}`}
                    >
                      {t.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <MonoLabel className="block mt-5 text-center text-ink/60" data-testid="register-tab-tagline">{active.tagline}</MonoLabel>
                {REGISTER_TYPES.map((t) => (
                  <TabsContent key={t.key} value={t.key} className="mt-6">
                    <RegisterForm type={t.key} />
                  </TabsContent>
                ))}
              </Tabs>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
