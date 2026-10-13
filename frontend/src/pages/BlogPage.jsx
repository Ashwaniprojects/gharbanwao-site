import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { Footer, MobileBar } from "@/components/site/FaqCtaFooter";
import { Container, Reveal, SectionHeader } from "@/components/site/shared";
import { Calendar, ArrowRight } from "lucide-react";

const POSTS = [
  { slug: "how-much-does-a-2bhk-cost-in-lucknow-2026", title: "How much does a 2BHK cost in Lucknow in 2026?", date: "15 Jan 2026", read: "6 min", excerpt: "A detailed breakdown of construction costs for a 2BHK home in Lucknow, including materials, labour, and finishing — based on real 2026 market rates." },
  { slug: "construction-vs-contractor-what-to-expect", title: "Construction vs contractor: what to expect before you sign", date: "2 Jan 2026", read: "5 min", excerpt: "The differences between hiring a contractor and a full-service construction company, and why stage-linked payments matter more than you think." },
  { slug: "how-to-verify-your-contractors-material-quality", title: "How to verify your contractor's material quality", date: "18 Dec 2025", read: "7 min", excerpt: "Five practical checks you can do yourself — from cement bag stamps to steel rod certificates — before materials reach your site." },
  { slug: "lucknow-home-building-mistakes-to-avoid", title: "7 mistakes Lucknow homeowners make during construction", date: "5 Dec 2025", read: "8 min", excerpt: "We have seen the same mistakes repeat across 260+ homes. Here is what to watch for, and how to avoid costly mid-construction surprises." },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-paper text-ink" data-testid="blog-page">
      <AnnouncementStrip />
      <Navbar />
      <main>
        <section className="section-gb" data-testid="blog-hero">
          <Container className="max-w-4xl">
            <Reveal>
              <SectionHeader
                label="BLOG"
                title="Honest guides for Lucknow homeowners."
                supporting="No marketing fluff. Just practical, experience-backed advice from the people building your city's homes."
                align="center"
              />
            </Reveal>
          </Container>
        </section>

        <section className="section-gb bg-wash-yellow" data-testid="blog-list">
          <Container className="max-w-4xl">
            <div className="mt-12 space-y-6">
              {POSTS.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.06}>
                  <a href={`/blog/${p.slug}`} className="card-gb p-6 md:p-8 bg-paper group block" data-testid={`blog-card-${i + 1}`}>
                    <div className="flex items-center gap-3 text-[13px] text-ink/60 mono-label">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {p.date}</span>
                      <span>·</span>
                      <span>{p.read} read</span>
                    </div>
                    <h3 className="mt-3 font-bold text-[17px] md:text-[19px] group-hover:text-green-700 transition-colors">{p.title}</h3>
                    <p className="mt-2 text-[15px] text-ink/70 leading-relaxed">{p.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-green-700 group-hover:gap-2.5 transition-all">
                      Read more <ArrowRight className="h-4 w-4" />
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
