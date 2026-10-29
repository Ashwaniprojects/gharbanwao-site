export const PHONES = ["09648249999", "09648259999"];
export const WHATSAPP_NUMBER = "919198059992";
export const WHATSAPP_DISPLAY = "09198059992";

// A pre-filled first message is what kicks off the AI Sensy auto-reply, so every
// WhatsApp entry point on the site carries it. Keep the wording identical to
// the live gharbanwao.com site so the same campaign replies fire.
export const WHATSAPP_DEFAULT_MESSAGE =
  "Hello, I want to know about house Design & construction services.";

export const WHATSAPP_URL = `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
  WHATSAPP_DEFAULT_MESSAGE
)}&type=phone_number&app_absent=0`;

// Primary header nav (lean — Calculator and Contact live elsewhere: Calculator is inside Services, Contact moved to footer).
// `href` items are full pages (Projects, Blog); `id` items scroll to a homepage section.
export const NAV = [
  { label: "Home", id: "home" },
  { label: "About Us", id: "about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Reviews", id: "reviews" },
];

// Footer "Explore" column — the full sitemap, including items removed from the header
// Footer links. `href` entries are real pages; `id` entries scroll to a
// section on the homepage.
export const FOOTER_NAV = [
  { label: "Home", id: "home" },
  { label: "About Us", id: "about" },
  { label: "Services", id: "services" },
  { label: "Calculator", href: "/calculator" },
  { label: "Reviews", id: "testimonials" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", id: "contact" },
];

// Services dropdown under the header nav. Architecture hands off to our sister company's
// dedicated architecture/design studio.
export const SERVICES_MENU = [
  { label: "All services", href: "/services" },
  { label: "Construction with Materials", href: "/services/construction-with-materials" },
  { label: "Architecture & Floor Plans", href: "https://nakshaabanwao.com/", external: true },
  { label: "Interior Design", href: "/services/interior-design" },
  { label: "Renovation & Makeover", href: "/services/renovation-makeover" },
];

export const REGISTER_TYPES = [
  { key: "vendor", label: "Vendor Registration", tagline: "Supply materials — cement, steel, tiles, fittings — directly to our live sites." },
  { key: "channel_partner", label: "Channel Partner", tagline: "Refer landowners and homeowners, earn commission on every signed project." },
  { key: "hiring", label: "Careers / Hiring", tagline: "Join our site, design, or support teams across Lucknow, Kanpur, Ayodhya, Gorakhpur, Vindhyachal, Prayagraj, Sitapur and Sultanpur." },
];

export const CITIES = [
  "Lucknow", "Kanpur", "Ayodhya", "Gorakhpur", "Vindhyachal", "Prayagraj", "Sitapur", "Sultanpur",
  "Basti", "Lakhimpur", "Fatehpur", "Rai Bareilly",
];

export const ANNOUNCEMENTS = [
  "Serving Lucknow / Kanpur / Ayodhya / Gorakhpur / Vindhyachal / Prayagraj / Sitapur / Sultanpur / Basti / Lakhimpur / Fatehpur / Rai Bareilly",
  "264+ Homes Handed Over Since 2017  ·  52 Sites Live This Week  ·  25-Year Structural Warranty",
];

export const TRUST = [
  { number: "264+", label: "Projects completed", note: "Handed over across UP since 2017" },
  { number: "52", label: "Ongoing projects", note: "Live on the project map below" },
  { number: "4.8 / 5", label: "Google rating", note: "From 180+ verified reviews" },
  { number: "9+ yrs", label: "On the ground", note: "Lucknow headquartered" },
];

export const WHY = [
  { icon: "ClipboardCheck", title: "150+ onsite quality checks", text: "Documented stage-wise. You see the checklist, not just the result.", img: "/images/about/onsite-blueprint-consultation.webp" },
  { icon: "FileText", title: "100% materials transparency", text: "Brand, grade, and quantity on every delivery note.", img: "/images/about/modern-brick-house-under-construction.webp" },
  { icon: "FlaskConical", title: "Materials quality control", text: "Sample testing before site delivery. Rejected batches get returned.", img: "/images/featured/construction.png" },
  { icon: "Camera", title: "Real-time project tracking", text: "Your WhatsApp gets site photos every Monday and Thursday.", img: "/images/about/blueprints-across-india.webp" },
  { icon: "ShieldCheck", title: "100% money safety", text: "Payments linked to stage completion, not calendar dates.", img: "/images/featured/architecture.png" },
  { icon: "Landmark", title: "Structural warranty", text: "25 years on structure. In writing. Transferable on resale.", img: "/images/about/warm-modern-house.webp" },
  { icon: "CalendarRange", title: "Stage-linked payment schedule", text: "The same 9-stage schedule on every package, mapped to work finished, not ours.", img: "/images/about/warm-modern-indian-home.webp" },
  { icon: "Headset", title: "Dedicated customer support", text: "One project manager per build. One WhatsApp number. One accountable name.", img: "/images/featured/renovation.png" },
  { icon: "Timer", title: "On-time delivery", text: "Average delay across 264+ homes: 11 days. We publish it.", img: "/images/about/proud-family-dream-home.webp" },
  { icon: "History", title: "9+ years of experience", text: "Started 2017. Still Lucknow-headquartered.", img: "/images/featured/interior.png" },
  { icon: "HardHat", title: "Dedicated engineers", text: "One structural, one site, one quality — assigned per project.", img: "/images/about/onsite-blueprint-consultation.webp" },
  { icon: "Wrench", title: "Post-handover support", text: "12 months of free fixes on anything we built.", img: "/images/about/warm-modern-house.webp" },
];

export const SERVICES = [
  {
    img: "/images/featured/architecture.png",
    title: "Architecture Services & Planning",
    text: "Vastu-aligned, approval-ready drawings.",
    cta: "See floor plans",
    id: "projects",
    slug: "architecture-planning",
    external: "https://nakshaabanwao.com/",
    tagline: "Vastu-aligned, approval-ready drawings, from the first sketch to a signed building plan.",
    intro:
      "Before a single brick moves, the drawings must be right. Our architecture arm turns a plot and a budget into a layout you will love living in — checked against Vastu and ready for LDA approval, so the plan you build is the plan you are permitted to build.",
    points: [
      "Vastu-aligned layouts for every orientation",
      "LDA-ready 2D floor plans and structural drawings",
      "3D elevations you can walk through before construction",
      "Handover to our construction team with zero re-work",
    ],
    includes: [
      "Site survey and orientation study",
      "2D floor plans + 3D elevation",
      "Structural and finishing drawings",
      "LDA / local authority approval support",
      "Design revisions until you are happy",
    ],
  },
  {
    img: "/images/featured/construction.png",
    title: "Construction with Materials",
    text: "Plot to key handover, turnkey, brand-verified materials.",
    cta: "See projects",
    id: "projects",
    slug: "construction-with-materials",
    tagline: "Plot to key handover, turnkey, with brand-verified materials written into the contract.",
    intro:
      "We build the whole home under one roof: foundation to finishing, with every material's brand and grade fixed in the agreement before work starts. You get a single accountable team, weekly photo updates, and a 25-year structural warranty on everything we pour.",
    points: [
      "Turnkey build — one team, one agreement, one number",
      "Brand and grade of every material written in the quote",
      "Payments released only after each stage is signed off",
      "25-year structural warranty, transferable on resale",
    ],
    includes: [
      "Foundation, structure and brickwork",
      "Plumbing, electrical and sanitary work",
      "Flooring, painting and door & window work",
      "Stage-wise progress photos on WhatsApp",
      "Dedicated site + structural + quality engineer",
    ],
  },
  {
    img: "/images/featured/interior.png",
    title: "Interior Design",
    text: "Modular kitchen, wardrobes, false ceiling, finishes.",
    cta: "See interiors",
    id: "projects",
    slug: "interior-design",
    tagline: "Modular kitchen, wardrobes, false ceiling and the finishing layer that makes a house feel finished.",
    intro:
      "The last 20% of a home is what you live in every day. Our interior team delivers the built-in furniture, lighting and finishes that turn a shell into the home you have been picturing — measured to the millimetre and built by the same people who built the house.",
    points: [
      "Modular kitchens and built-in wardrobes",
      "False ceilings, lighting plans and finishes",
      "Designs matched to the construction you already have",
      "Supplied and installed by our own team",
    ],
    includes: [
      "Modular kitchen design and fabrication",
      "Wardrobes, pooja units and storage",
      "False ceiling + lighting layout",
      "Paint, flooring and decorative finishes",
      "On-site supervision through to handover",
    ],
  },
  {
    img: "/images/featured/renovation.png",
    title: "Renovation & Makeover",
    text: "Floor addition, remodeling, structural retrofit.",
    cta: "See renovations",
    id: "projects",
    slug: "renovation-makeover",
    tagline: "Add a floor, rework a plan, or retrofit the structure — without tearing the house down.",
    intro:
      "Not every project starts with a bare plot. We add floors to existing homes, remodel dated layouts, and retrofit structure and systems that have outlived their design life — engineered first, so a renovation is safe and stays true to your original blueprint.",
    points: [
      "New floor addition on existing structures",
      "Room remodelling and space re-planning",
      "Structural retrofit and strengthening",
      "Full makeovers, inside and out",
    ],
    includes: [
      "Structural audit before work starts",
      "Floor addition and roof work",
      "Demolition and space replanning",
      "Retrofit of electrical, plumbing and finishes",
      "Same stage-linked payment protection as new builds",
    ],
  },
];

export const PROCESS = [
  { n: "01", name: "Search the Right Company", highlight: "Compare profiles, reviews and past projects before you commit to anyone.", img: "/images/about/blueprints-across-india.webp" },
  { n: "02", name: "Appointment & Meeting", highlight: "Book a free consultation call or an in-person site visit with our team.", img: "/images/about/onsite-blueprint-consultation.webp" },
  { n: "03", name: "NB Project Code Allotment", highlight: "Your design file is registered with Nakshaa Banwao, our architecture arm.", img: "/images/featured/architecture.png" },
  { n: "04", name: "Meet Architect & Engineer Team", highlight: "Discuss layout, Vastu, elevation and structural needs face to face.", img: "/images/about/modern-brick-house-under-construction.webp" },
  { n: "05", name: "Design & Final Discussion", highlight: "Floor plan, 3D elevation and structural drawing finalized together.", img: "/images/process/step-05-design.webp" },
  { n: "06", name: "Get Quotation & Agreement", highlight: "A transparent, phase-wise quote signed before a single brick moves.", img: "/images/about/warm-modern-indian-home.webp" },
  { n: "07", name: "GB Project Code Allotment", highlight: "Your build is registered with Ghar Banwao and assigned a site engineer.", img: "/images/featured/construction.png" },
  { n: "08", name: "Pooja & Work Start", highlight: "Bhoomi pujan first, then foundation work begins right on schedule.", img: "/images/process/step-08-pooja.webp" },
  { n: "09", name: "Step-by-Step Project Update & Engineer Support", highlight: "Weekly WhatsApp photo updates with direct access to your engineer.", img: "/images/process/step-09-updates.webp" },
  { n: "10", name: "Finishing & Delivery", highlight: "150-point checklist, warranty handover, and keys in your hand.", img: "/images/process/step-10-handover.webp" },
];

export const BRANDS = ["UltraTech", "ACC", "Shree", "Tata TISCON", "JSW Neosteel", "Jindal Panther", "Asian Paints", "Berger", "Jaquar", "Hindware", "Kajaria", "Somany", "Finolex", "Havells", "Legrand"];

export const TESTIMONIALS = [
  ["Alok Saxena", "Lucknow", "2025", "I am extremely impressed with the house construction quality and overall service provided by Ghar Banwao. From the very beginning, their team demonstrated professionalism, transparency, and strong technical expertise. The construction quality is top-notch, with excellent material standards, precise workmanship, and great attention to detail at every stage. What truly stood out was their commitment to timelines and regular updates. Each phase of construction was well-planned and executed smoothly, giving us complete peace of mind. The engineers and supervisors were knowledgeable, responsive, and always ready to clarify doubts or suggest better solutions. The final result exceeded our expectations—solid structure, clean finishing, and a modern, premium feel throughout the house. Ghar Banwao truly delivers what they promise and ensures quality without compromise. I highly recommend Ghar Banwao to anyone looking for reliable, high-quality, and stress-free house construction.", "GB-209", "5"],
  ["Dr. Jyothi Gupta", "Lucknow", "2025", "Highly Experienced and great team and trustworthy process. A wonderful finish and a great coordination with team. Highly recommend and value for money work.", "GB-246", "5"],
  ["Vaibhav Shukla", "Lucknow", "2025", "I want to sincerely thank the entire Ghar Banwao team — especially Virender Sir, Pathak Sir, and site head Bhola — for the exceptional work delivered on our home. The quality, professionalism, and transparency maintained throughout the project have exceeded our expectations. Your dedication, attention to detail, and commitment to excellence have truly made this journey smooth and satisfying for me and my family. It has been a pleasure working with such a reliable and efficient team.", "GB-223", "5"],
  ["Bhaskar Mishra", "Lucknow", "2025", "Excellent construction company! They built my dream home with outstanding quality and professionalism. The work was completed on time, and the entire team was very supportive and skilled specially Virendra and Gautam Pathak Ji. Highly recommended!", "GB-217", "5"],
  ["Vipin Verma", "Lucknow", "2025", "First of all a very big thanks to all team members of Ghar Banwao for making my dream home. The quality of all material used for construction are same as they promised in agreement. They are very cooperative with all your ideas and work with full dedication and honesty. I want to give my token of appreciation specially to Virender ji and Gautam pathak ji.", "GB-190", "5"],
  ["Pradeep Mishra", "Vindhyachal", "2025", "Very reliable and trusted construction company, with a lot of experience and excellence. They provide customised service with full effort. I am thankful to the CEO Eng Veerendra ji and full team of Ghar Banwao for their immense support to built my dream house. Once again I recommend this team with 100 percent satisfaction. Good wishes to all the staff including civil, electric, plumbing, painting, carpentry, supervisor Mr Dheeraj, Project eng Sri Gautam Pathak ji.", "GB-222", "5"],
  ["Vishal Sharma", "Lucknow", "2025", "Ghar Banwao made my dream home, thankyou so much for making such a nice home.", "", "5"],
  ["Ghanshyam Verma", "Lucknow", "2025", "I am very satisfied with the work of this construction company. They built my house with very good quality materials and completed the work on time. The team was professional, cooperative, and paid attention to every detail. Overall, it was a great experience, and I highly recommend this company for house construction.", "", "5"],
  ["Krishna Kumari", "Lucknow", "2025", "Truly amazing company. Excellent coordination and quality work. I will highly recommend Ghar Banwao for house construction and designing.", "", "5"],
  ["Akhilesh Kumar", "Lucknow", "2025", "We appreciate the excellent work completed in full compliance with all agreed commitments.", "GB-216", "5"],
  ["Rupesh Chaturvedi", "Lucknow", "2025", "One can look for the services of Ghar Banwao as they are very supportive in home construction.", "GB-214", "5"],
  ["Surendra Sharma", "Lucknow", "2025", "Company work is too incredible. Excellent team coordination and satisfied work with great quality work and experience. Highly recommended.", "GB-228", "5"],
  ["Shivansh Srivastava", "Lucknow", "2025", "Construction line is full of hassle and tricky businesses, but they seemed to be fulfilling all our requirements under budget. They do work with less margin compared to others.", "", "5"],
  ["Rishabh Singh", "Lucknow", "2025", "Great place to give your dream house a desired look. Our requirement was new construction and renovation which together can give good look from outside and inside. Ghar Banwao did their job exceptionally well. Good quality of material used and delivered us our house timely.", "GB-215", "5"],
  ["Sachin Tripathi", "Lucknow", "2025", "Excellent work. Build of our dream house are so very beautiful like villa. We are thankful to company owner Mr. Virendra and all company workers. Very understanding and good core team work performance.", "", "5"],
  ["Sunil", "Lucknow", "2025", "The best and the greatest company in Lucknow even in UP. The services are top notch. The customer support is top notch. The quality is top notch and also a great and affordable budget service. I am glad to like this company.", "", "5"],
  ["Jasleen Bhatia", "Lucknow", "2025", "My experience with Ghar Banwao was amazing. Their team members were very professional. Also they built my dream home in committed time. I would definitely recommend Ghar Banwao to everyone. Keep growing.", "", "5"],
  ["Sapna Thakur", "Lucknow", "2025", "Best construction company. I am happy to choose Ghar Banwao for my house design and construction. They provided me multiple house designs with updates, a supportive team, and very professional services.", "", "5"],
  ["Divyanshu Yadav", "Lucknow", "2025", "Great structure and all-round construction work. Quality components, quality work, and transparency. Value for money. Highly recommended.", "", "5"],
  ["Hinaz", "Lucknow", "2025", "Ghar Banwao made building my home in Lucknow super easy and stress-free. The team was professional, used quality materials, and delivered on time. Highly recommended for anyone looking to build their dream home.", "", "5"],
  ["Siddharth Tiwari", "Lucknow", "2025", "I had a great experience working with this company for my home construction. The team is highly professional, completed the project on time, and maintained top-quality materials throughout. The design turned out exactly as we envisioned. Their customer service is also very responsive and helpful. I highly recommend them to anyone looking for a reliable construction company.", "", "5"],
  ["Durga Prasad Vishwakarma", "Lucknow", "2025", "Ghar Banwao is the best budget-friendly and professional work done by a construction company in Lucknow.", "", "5"],
].map(([name, locality, date, quote, project_id, rating], i) => ({
  name,
  locality,
  date,
  quote,
  project_id,
  rating: Number(rating),
  source: "Google review",
}));

export const VIDEOS = [
  { id: "hvii9z4y524", title: "1500 sq.ft 3BHK house built within 32 lakhs | Customer review & house tour" },
  { id: "QZgBU2xQRBY", title: "Construction on-site client review" },
  { id: "3D8mgyRK0-Q", title: "1000 sq.ft 2BHK house built within 19 lakhs | Customer review & house tour (GB-136)" },
  { id: "yZ86G_tQnd4", title: "1000 sq.ft house design | 25 by 40 | Customer review" },
  { id: "oCfGauWPM0k", title: "Lowest budget hostel construction in Lucknow | G+1+Mumty | Client review & full tour" },
  { id: "U9oT53aFOdc", title: "Modern 2BHK house in Lucknow | 1000 sq.ft full house tour + customer review" },
  { id: "DmmwppxdVk4", title: "Modern 3BHK house in Lucknow | 1670 sq.ft full house tour + customer review" },
  { id: "EEZHvwxpZ9c", title: "Modern 2BHK house in Lucknow | 1000 sq.ft full house tour + customer review" },
  { id: "04fyoYS5-JI", title: "Before you build your 2BHK, watch this Lucknow home review" },
  { id: "o1iAdV4OFT8", title: "Before you build your home, watch this review | Bakshi Ka Talab client | 2000 sq.ft" },
  { id: "UBTwPp_8K5c", title: "Customer reveals the truth about their new home | 1500 sq.ft tour" },
];

export const PRICING = [
  { name: "Silver", price: "₹1,299", best: "First-time builders, tight budgets", rows: ["25 years", "9, same for all", "Weekly", "Standard", "Essential", "6 months"], cta: "Get Quote", featured: false },
  { name: "Gold", price: "₹1,699", best: "Most homeowners, best value", rows: ["25 years", "9, same for all", "2× weekly", "Mid-premium", "Enhanced", "12 months"], cta: "Get Quote", featured: true },
  { name: "Platinum", price: "₹1,999", best: "Larger plots, custom finishes", rows: ["25 years", "9, same for all", "2× weekly + on-demand", "Premium", "Custom-specified", "24 months"], cta: "Book Design Session", featured: false },
];
export const PRICING_ROWS = ["Structure warranty", "Payment stages", "Site visits by engineer", "Material grade", "Finishing level", "Post-handover support"];
// One schedule for all three packages. The percentages are the published
// contract terms; the rupee column is an illustrative 1500 sqft Gold build
// so a homeowner can sanity-check the numbers against their own quote.
export const PAYMENT_SCHEDULE = [
  { stage: "Advance at the time of agreement sign", pct: 20, note: "If less is paid at signing, the full 20% must be completed within 15 days from the date work starts." },
  { stage: "Before plinth beam & DPC", pct: 10, note: "" },
  { stage: "Before 5' brick wall work", pct: 10, note: "" },
  { stage: "Before shuttering for slab", pct: 20, note: "" },
  { stage: "Before plumbing & electrical work", pct: 10, note: "" },
  { stage: "Before flooring", pct: 10, note: "" },
  { stage: "Before painting work", pct: 10, note: "" },
  { stage: "Before door and window", pct: 8, note: "" },
  { stage: "Before sanitary & miscellaneous work", pct: "Remaining", note: "The balance after the stages above." },
];
export const PAYMENT_RULES = [
  "Every instalment is released only after you inspect and sign off the completed stage.",
  "All payments must be completed 15 days before possession.",
  "No payment is tied to a calendar date. It is tied to work actually finished on site.",
  "Any mid-construction change is issued as a written change order with its cost before work begins.",
];
export const PAYMENT_EXAMPLE = { area: 1500, rate: 1699, total: 2548500 };

// Homepage and /packages comparison. `gb` is our side, `other` is the
// typical local contractor's. Rendered as a two-column list rather than
// a table because the rows do not pair up one-to-one.
export const WHY_US = [
  { title: "Professional design team", text: "Architects, engineers and interior designers from the first drawing to handover, working with a design team that is always reachable." },
  { title: "25-year structural warranty", text: "Written structural warranty with clearly defined coverage and a claims process. Foundation, columns, beams and slabs remain protected for a quarter of a century." },
  { title: "150+ stage-wise quality checks", text: "Documented, stage-wise quality checks from excavation to finishing, each inspected and signed off by a dedicated engineer before work moves forward." },
  { title: "Transparent pricing, in writing", text: "Detailed quotation with material specifications, scope and exclusions. Any additional work or upgrade is discussed and approved in writing before it is executed." },
  { title: "Payments linked to progress", text: "Stage-wise payments tied to verified completion rather than advance-heavy terms. You release money only after seeing finished work." },
  { title: "Remote-friendly monitoring", text: "Regular site photos and weekly construction reports, so homeowners living outside the city can follow the build without daily site visits." },
];
export const WHY_THEM = [
  { title: "No dedicated design team", text: "Professional design support may not be available, so planning is often left to a single mason or supervisor." },
  { title: "No structural warranty", text: "A formal structural warranty may not be offered, leaving long-term strength without any written protection." },
  { title: "Quality checks may be undocumented", text: "Documented checks may be limited, making it hard to trace what was inspected and approved at each stage." },
  { title: "Cost breakdown may be limited", text: "The cost breakdown may not be itemised in detail, leaving little room to verify value as the work progresses." },
  { title: "Advance-heavy payments", text: "Advance-heavy terms may apply, with the balance following a schedule you did not define stage by stage." },
  { title: "Personal supervision required", text: "Updates may require follow-ups, and progress may depend on frequent site visits and your own day-to-day oversight." },
];

export const TEAM = [
  { img: "/images/team/virendra-nishad.jpg", name: "Er. Virendra Kumar Nishad", role: "Chairman & Managing Director", years: "14 yrs", specialty: "Has personally handed over 190 of the 260 homes." },
  { img: "IMG-76", name: "Er. Neha Tripathi", role: "Lead Structural Engineer", years: "11 yrs", specialty: "RCC design, soil-bearing analysis, retrofit." },
  { img: "IMG-77", name: "Pallavi Mehrotra", role: "Head of Quality", years: "9 yrs", specialty: "Owns the 150-point checklist. Rejects batches." },
  { img: "IMG-78", name: "Ramesh Kushwaha", role: "Site Supervisor", years: "17 yrs", specialty: "Brickwork and plaster. Plumb line in pocket." },
  { img: "IMG-79", name: "Sana Rizvi", role: "Interior Lead", years: "8 yrs", specialty: "Modular kitchens, wardrobes, lighting plans." },
  { img: "IMG-80", name: "Vivek Rastogi", role: "Customer Success Lead", years: "6 yrs", specialty: "The one WhatsApp number. Replies in under 2 hours." },
];

// The full set of 15 questions lives on /faq. The homepage keeps five of
// them, chosen because they are the ones that actually block a decision:
// cost, budget, inclusions, hidden charges and getting started.
const HOME_FAQ_QUESTIONS = [
  "What is the cost of building a house in Lucknow per sq. ft.?",
  "Can you build my house within my budget?",
  "What is included in your construction package?",
  "Are there any hidden charges in house construction?",
  "How can I get started with Ghar Banwao?",
];

export const FAQS = [
  ["What is the cost of building a house in Lucknow per sq. ft.?", "The cost of house construction in Lucknow varies based on design, materials, finishing, and project requirements. At Ghar Banwao, we offer transparent pricing and flexible construction packages to suit your budget. Contact us for a personalised estimate."],
  ["How much will it cost to build a 1,000 sq. ft. house?", "The cost of constructing a 1,000 sq. ft. house depends on the number of floors, design, materials, and finishing preferences. At Ghar Banwao, we offer flexible construction packages with transparent pricing."],
  ["Can you build my house within my budget?", "Yes! At Ghar Banwao, we offer flexible construction packages tailored to your budget and requirements. Our experts help you optimise design, materials, and specifications while maintaining essential quality and safety standards."],
  ["What is included in your construction package?", "At Ghar Banwao, our construction packages cover everything from structural work to complete home finishing, depending on your chosen package. We offer architectural planning, quality materials, professional supervision, and stage-wise payments."],
  ["Are there any hidden charges in house construction?", "At Ghar Banwao, we believe in complete pricing transparency. All agreed costs, material specifications, and package inclusions are clearly defined upfront. Any additional work or upgrades are discussed and approved before execution, ensuring no unexpected charges."],
  ["How do I know you will use good-quality construction materials?", "At Ghar Banwao, we ensure material transparency through clearly defined brands and specifications, regular quality inspections, and dedicated site supervision. You can verify the materials used at every stage of construction for complete peace of mind."],
  ["How long will it take to complete my house?", "The construction timeline depends on your home's size, number of floors, design complexity, and finishing requirements. At Ghar Banwao, we provide a planned construction schedule, regular progress updates, and dedicated supervision to ensure timely completion."],
  ["Do you provide a written agreement before starting construction?", "Yes! At Ghar Banwao, we provide a detailed written agreement outlining the scope of work, material specifications, payment schedule, construction timeline, and terms & conditions, ensuring complete transparency and peace of mind before construction begins."],
  ["Do you help with LDA map approval in Lucknow?", "Yes! At Ghar Banwao, we assist with LDA building plan approval in Lucknow, including architectural drawings, required documentation, and guidance throughout the approval process, helping you start your home construction with confidence."],
  ["Can I see the 2D floor plan and 3D elevation before construction?", "Yes! At Ghar Banwao, we provide detailed 2D floor plans, complete structural drawings, and realistic 3D elevation designs before construction begins, helping you visualise your dream home and plan every detail with confidence."],
  ["Can I make changes to my house design?", "Yes! At Ghar Banwao, we offer flexible design customisation to match your preferences and lifestyle. You can request changes to your floor plan, layout, and 3D elevation before construction begins, subject to structural feasibility and agreed design terms."],
  ["How will I track the progress of my house construction?", "At Ghar Banwao, we keep you informed through regular site updates, progress photos, and weekly construction reports. Our dedicated project team ensures complete transparency, so you can monitor your dream home's progress even when you're away from the site."],
  ["Do you provide a warranty on construction work?", "Yes! Ghar Banwao offers a structural warranty and post-handover maintenance support to ensure long-term durability and peace of mind. Warranty coverage and conditions are clearly outlined in your construction agreement."],
  ["Why should I choose Ghar Banwao over a local contractor?", "At Ghar Banwao, we make home construction truly hassle-free. From professional planning and dedicated engineers to transparent pricing, 150+ quality checks, regular progress updates, and post-handover support, we manage every stage of construction so you can enjoy a stress-free journey from planning to possession."],
  ["How can I get started with Ghar Banwao?", "Getting started is simple! Contact Ghar Banwao at 09648249999, 09648259999 or book a free consultation. Our experts will understand your requirements, discuss your budget, arrange a site visit, and provide a personalised construction proposal to begin your hassle-free home-building journey."],
];

export const HOME_FAQS = FAQS.filter(([q]) => HOME_FAQ_QUESTIONS.includes(q));

export const FAQ_GROUPS = [
  { label: "Cost & Budget", questions: [0, 1, 2, 4] },
  { label: "Quality & Materials", questions: [5] },
  { label: "Timeline & Process", questions: [6, 8, 9, 10, 11] },
  { label: "Trust & Getting Started", questions: [3, 7, 12, 13, 14] },
];

export const SEARCH_POPULAR = ["2 BHK cost Lucknow", "30×50 house plan", "turnkey package", "brick quality", "GB-229"];
