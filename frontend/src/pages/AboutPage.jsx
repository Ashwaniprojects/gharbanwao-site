import { AnnouncementStrip } from "@/components/site/AnnouncementStrip";
import { Navbar } from "@/components/site/Navbar";
import { Footer, MobileBar } from "@/components/site/FaqCtaFooter";
import { Container, Reveal, SectionHeader } from "@/components/site/shared";
import { Helmet } from "react-helmet-async";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Helmet>
        <title>About Us — Ghar Banwao | Best Construction Company in Lucknow</title>
        <meta name="description" content="Ghar Banwao is a construction company in Lucknow, Uttar Pradesh. Since 2017, we have delivered 260+ homes across 8 UP cities — Lucknow, Kanpur, Ayodhya, Gorakhpur, and more. India's first revolutionary construction platform connecting homeowners with verified architects, civil engineers, and contractors." />
        <meta name="keywords" content="construction company Lucknow, best construction company Lucknow, home construction Lucknow, builders in Lucknow, civil engineers Lucknow, architects Lucknow, residential construction Lucknow, commercial construction Lucknow, construction company Uttar Pradesh, home builders UP, Ghar Banwao, Lucknow construction company, house construction company India, construction platform India" />
        <link rel="canonical" href="https://gharbanwao.com/about" />
        <meta property="og:title" content="About Ghar Banwao — Best Construction Company in Lucknow" />
        <meta property="og:description" content="Lucknow's most trusted construction company since 2017. 260+ homes delivered across Uttar Pradesh with transparent pricing, verified professionals, and a 25-year structural warranty." />
        <meta property="og:url" content="https://gharbanwao.com/about" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="About Ghar Banwao — Best Construction Company in Lucknow" />
        <meta name="twitter:description" content="Lucknow's most trusted construction company since 2017. 260+ homes delivered across Uttar Pradesh." />
      </Helmet>
      <AnnouncementStrip />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="section-gb" data-testid="about-hero">
          <Container className="max-w-4xl">
            <Reveal>
              <SectionHeader
                label="ABOUT US"
                title="Construction company in Lucknow built on trust, transparency, and quality."
                supporting="Ghar Banwao is a construction company in Lucknow, Uttar Pradesh. Since 2017, we have handed over 260+ homes across Lucknow, Kanpur, Ayodhya, Gorakhpur, and other UP cities — and we are just getting started."
                align="center"
              />
            </Reveal>
          </Container>
        </section>

        {/* About */}
        <section className="section-gb bg-wash-yellow" data-testid="about-story">
          <Container className="max-w-4xl">
            <Reveal>
              <SectionHeader
                label="OUR STORY"
                title="A revolutionary initiative to change the way Lucknow builds."
                supporting="Ghar Banwao was launched with a single vision — to cater to every need of construction on one single platform. Whether you are building your first home, expanding your commercial space, or renovating an existing property, Ghar Banwao connects you with the right architects, civil engineers, contractors, and material suppliers — all in one place."
              />
            </Reveal>
            <Reveal className="mt-8">
              <div className="card-gb p-8 bg-paper space-y-5">
                <p className="text-[16px] leading-relaxed text-ink/80">
                  Ghar Banwao is the first revolutionary initiative to change the overall outlook of construction in Lucknow. We provide a hassle-free and effortless platform to discover the right professionals for every stage of your construction project — from foundation to finishing. Our aim is to be every citizen's first choice when they are thinking about construction in any segment, anywhere in India.
                </p>
                <p className="text-[16px] leading-relaxed text-ink/80">
                  We have a team of the best architects and civil engineers for construction in Lucknow. Every professional on our platform is verified, experienced, and committed to delivering on time. When you choose Ghar Banwao, you are not just hiring a builder — you are partnering with a team that treats your dream as their own.
                </p>
                <p className="text-[16px] leading-relaxed text-ink/80 italic">
                  Everyone has a dream of their own home. At Ghar Banwao, we make your dream our dream project.
                </p>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Vision */}
        <section className="section-gb" data-testid="about-vision">
          <Container className="max-w-4xl">
            <Reveal>
              <SectionHeader
                label="OUR VISION"
                title="To be every citizen's first choice for construction in India."
                supporting="We want to build a place where anyone planning to construct anything can do it comfortably — with full access to every detail of every person involved in their project."
              />
            </Reveal>
            <Reveal className="mt-8">
              <div className="card-gb p-8 bg-paper">
                <p className="text-[16px] leading-relaxed text-ink/80">
                  Our vision is to organize all construction personnel-related information and make it universally accessible and useful. We want to build a platform where every individual has easy access to the person they need for their construction — whether it is a structural engineer, a site supervisor, an architect, or a material supplier. No more calling five different people to get one answer. No more wondering if the person you hired is actually qualified.
                </p>
                <p className="text-[16px] leading-relaxed text-ink/80 mt-4">
                  We are building for the entire country. Our vision is not limited to Lucknow or Uttar Pradesh. We are building a platform that serves every Indian who is planning to construct anything — a home, a shop, a factory, a school — with the confidence that comes from having the right people behind you.
                </p>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Mission */}
        <section className="section-gb bg-wash-yellow" data-testid="about-mission">
          <Container className="max-w-4xl">
            <Reveal>
              <SectionHeader
                label="OUR MISSION"
                title="The first choice for every dream space — within budget, beyond expectations."
                supporting="Our mission is to deliver quality construction with honest pricing, transparent processes, and accountability at every step."
              />
            </Reveal>
            <Reveal className="mt-8">
              <div className="card-gb p-8 bg-paper">
                <p className="text-[16px] leading-relaxed text-ink/80">
                  Ghar Banwao's mission is to be the first choice of every person who is willing to design and build their dream spaces — within budget and with the best quality of materials. We believe that satisfactory results are not an accident. They come from a process built on transparency, accountability, and relentless attention to detail.
                </p>
                <p className="text-[16px] leading-relaxed text-ink/80 mt-4">
                  Every project we take on is governed by three commitments: honest pricing from day one, quality materials you can verify, and a single point of contact who answers your call. These are not values we write on a wall — they are rules we enforce on every site, every day.
                </p>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* CMD Message */}
        <section className="section-gb bg-wash-yellow" data-testid="about-cmd">
          <Container className="max-w-4xl">
            <Reveal>
              <SectionHeader
                label="CMD'S MESSAGE"
                title="Building for the long term."
                supporting="Er. Virendra Kumar Nishad, Chairman and Managing Director, Ghar Banwao"
              />
            </Reveal>
            <Reveal className="mt-8">
              <div className="card-gb p-8 bg-paper space-y-5">
                <p className="text-[16px] leading-relaxed text-ink/80">
                  At Ghar Banwao, our journey is driven by a bold ambition: to transform the way India experiences home construction. We recognize that the construction industry has enormous potential, yet customers often face challenges in finding reliable professionals, ensuring transparency, managing costs, and coordinating multiple services. Our vision is to bridge these gaps by building a trusted, technology-driven platform that brings the entire home construction journey together under one roof.
                </p>
                <p className="text-[16px] leading-relaxed text-ink/80">
                  As CMD, I believe that sustainable growth comes from understanding customer needs, embracing innovation, and consistently delivering on our promises. We are focused on building more than a service company. We are building an ecosystem that makes construction more accessible, organized, transparent, and dependable.
                </p>
                <p className="text-[16px] leading-relaxed text-ink/80">
                  Our long-term ambition is to establish Ghar Banwao as one of India's leading construction services portals, empowering individuals to move from the first idea of a dream home to its successful completion with greater confidence and convenience.
                </p>
                <p className="text-[16px] leading-relaxed text-ink/80">
                  For us, success is not measured merely by the number of projects we complete, but by the trust we earn, the standards we establish, and the difference we make in the way people build.
                </p>
                <p className="text-[16px] leading-relaxed text-ink/80">
                  We are building Ghar Banwao with a vision that goes beyond individual homes to shape the future of India's construction industry.
                </p>
                <p className="mt-6 font-bold text-[15px]">Er. Virendra Kumar Nishad</p>
                <p className="text-[13px] text-ink/60">Chairman and Managing Director</p>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* CEO Message */}
        <section className="section-gb" data-testid="about-ceo">
          <Container className="max-w-4xl">
            <Reveal>
              <SectionHeader
                label="MESSAGE FROM THE CEO"
                title="Customers at the centre of every decision."
                supporting="Sujata, Chief Executive Officer (CEO), Interior Designer, Ghar Banwao"
              />
            </Reveal>
            <Reveal className="mt-8">
              <div className="card-gb p-8 bg-paper space-y-5">
                <p className="text-[16px] leading-relaxed text-ink/80">
                  At Ghar Banwao, my vision is to redefine the home-building experience by placing our customers at the centre of every decision we make. I believe that building a home should be an exciting and fulfilling journey, not a complicated or stressful process.
                </p>
                <p className="text-[16px] leading-relaxed text-ink/80">
                  As CEO, my priority is to build an organization that earns customer trust through transparency, delivers value through quality, and creates lasting relationships through accountability. We strive to understand every customer's unique vision, requirements, and budget, translating them into thoughtfully planned homes with a seamless experience from concept to completion.
                </p>
                <p className="text-[16px] leading-relaxed text-ink/80">
                  I believe the future of home construction lies in making reliable services more accessible, organized, and customer-friendly. Our goal is to bring architecture, construction, and interior design together through a single, dependable platform that empowers customers to make informed decisions with confidence.
                </p>
                <p className="text-[16px] leading-relaxed text-ink/80">
                  At Ghar Banwao, success is not measured merely by the homes we build, but by the trust we earn and the satisfaction we deliver. As we grow, our commitment remains unwavering: to continuously improve, innovate, and make the dream of owning a well-built home simpler for every customer.
                </p>
                <p className="text-[16px] leading-relaxed text-ink/80">
                  Our ambition is to make Ghar Banwao India's most trusted, customer-centric home construction services platform — where every dream matters and every customer comes first.
                </p>
                <p className="mt-6 font-bold text-[15px]">Sujata</p>
                <p className="text-[13px] text-ink/60">Chief Executive Officer (CEO), Interior Designer</p>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
