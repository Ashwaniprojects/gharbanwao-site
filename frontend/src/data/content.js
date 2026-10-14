export const PHONES = ["09648249999", "09648259999"];
export const WHATSAPP_URL = "https://wa.aisensy.com/+919198059992";
export const WHATSAPP_DISPLAY = "09198059992";

// Primary header nav (lean — Calculator and Contact live elsewhere: Calculator is inside Services, Contact moved to footer)
export const NAV = [
  { label: "Home", id: "home" },
  { label: "About Us", id: "about" },
  { label: "Services", id: "services" },
  { label: "Projects", id: "projects" },
  { label: "Packages", id: "packages" },
  { label: "Reviews", id: "reviews" },
];

// Footer "Explore" column — the full sitemap, including items removed from the header
// Footer links. `href` entries are real pages; `id` entries scroll to a
// section on the homepage.
export const FOOTER_NAV = [
  { label: "Home", id: "home" },
  { label: "About Us", id: "about" },
  { label: "Services", id: "services" },
  { label: "Packages", href: "/packages" },
  { label: "Payment Schedule", href: "/packages#payment" },
  { label: "Calculator", href: "/calculator" },
  { label: "Reviews", id: "testimonials" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", id: "contact" },
];

// Services dropdown under the header nav. Architecture hands off to our sister company's
// dedicated architecture/design studio.
export const SERVICES_MENU = [
  { label: "Construction with Materials", id: "services" },
  { label: "Architecture & Floor Plans", href: "https://nakshaabanwao.com/", external: true },
  { label: "Interior Design", id: "services" },
  { label: "Renovation & Makeover", id: "services" },
];

export const REGISTER_TYPES = [
  { key: "vendor", label: "Vendor Registration", tagline: "Supply materials — cement, steel, tiles, fittings — directly to our live sites." },
  { key: "channel_partner", label: "Channel Partner", tagline: "Refer landowners and homeowners, earn commission on every signed project." },
  { key: "hiring", label: "Careers / Hiring", tagline: "Join our site, design, or support teams across Lucknow, Kanpur, Ayodhya, Gorakhpur, Vindhyachal, Prayagraj, Sitapur and Sultanpur." },
];

export const CITIES = ["Lucknow", "Kanpur", "Ayodhya", "Gorakhpur", "Vindhyachal", "Prayagraj", "Sitapur", "Sultanpur"];

export const ANNOUNCEMENTS = [
  "Serving Lucknow / Kanpur / Ayodhya / Gorakhpur / Vindhyachal / Prayagraj / Sitapur / Sultanpur",
  "Free site visit + written quote in 48 hours  ·  No consultation fee  ·  Call 09648249999",
  "260+ homes handed over since 2017  ·  37 sites live this week  ·  25-year structural warranty",
];

export const TRUST = [
  { number: "37+", label: "Ongoing construction", note: "Live on the project map below" },
  { number: "260+", label: "Homes handed over", note: "Across UP since 2017" },
  { number: "4.8 / 5", label: "Google rating", note: "From 180+ verified reviews" },
  { number: "9+ yrs", label: "On the ground", note: "Lucknow headquartered" },
];

export const WHY = [
  { icon: "ClipboardCheck", title: "150+ onsite quality checks", text: "Documented stage-wise. You see the checklist, not just the result." },
  { icon: "FileText", title: "100% materials transparency", text: "Brand, grade, and quantity on every delivery note." },
  { icon: "FlaskConical", title: "Materials quality control", text: "Sample testing before site delivery. Rejected batches get returned." },
  { icon: "Camera", title: "Real-time project tracking", text: "Your WhatsApp gets site photos every Monday and Thursday." },
  { icon: "ShieldCheck", title: "100% money safety", text: "Payments linked to stage completion, not calendar dates." },
  { icon: "Landmark", title: "Structural warranty", text: "25 years on structure. In writing. Transferable on resale." },
  { icon: "CalendarRange", title: "Stage-linked payment schedule", text: "The same 9-stage schedule on every package, mapped to work finished, not ours." },
  { icon: "Headset", title: "Dedicated customer support", text: "One project manager per build. One WhatsApp number. One accountable name." },
  { icon: "Timer", title: "On-time delivery", text: "Average delay across 260+ homes: 11 days. We publish it." },
  { icon: "History", title: "9+ years of experience", text: "Started 2017. Still Lucknow-headquartered." },
  { icon: "HardHat", title: "Dedicated engineers", text: "One structural, one site, one quality — assigned per project." },
  { icon: "Wrench", title: "Post-handover support", text: "12 months of free fixes on anything we built." },
];

export const SERVICES = [
  { img: "/images/featured/architecture.png", title: "Architecture Services & Planning", text: "Vastu-aligned, approval-ready drawings.", cta: "See floor plans", id: "projects" },
  { img: "/images/featured/construction.png", title: "Construction with Materials", text: "Plot to key handover, turnkey, brand-verified materials.", cta: "See projects", id: "projects" },
  { img: "/images/featured/interior.png", title: "Interior Design", text: "Modular kitchen, wardrobes, false ceiling, finishes.", cta: "See interiors", id: "projects" },
  { img: "/images/featured/renovation.png", title: "Renovation & Makeover", text: "Floor addition, remodeling, structural retrofit.", cta: "See renovations", id: "projects" },
];

export const PROCESS = [
  { n: "01", name: "Search the Right Company", highlight: "Compare profiles, reviews and past projects before you commit to anyone." },
  { n: "02", name: "Appointment & Meeting", highlight: "Book a free consultation call or an in-person site visit with our team." },
  { n: "03", name: "NB Project Code Allotment", highlight: "Your design file is registered with Nakshaa Banwao, our architecture arm." },
  { n: "04", name: "Meet Architect & Engineer Team", highlight: "Discuss layout, Vastu, elevation and structural needs face to face." },
  { n: "05", name: "Design & Final Discussion", highlight: "Floor plan, 3D elevation and structural drawing finalized together.", img: "/images/process/step-05-design.webp" },
  { n: "06", name: "Get Quotation & Agreement", highlight: "A transparent, phase-wise quote signed before a single brick moves." },
  { n: "07", name: "GB Project Code Allotment", highlight: "Your build is registered with Ghar Banwao and assigned a site engineer." },
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
export const WHY_GB = [
  "Private Limited firm, with a real office address and contact details.",
  "25 years of structure guarantee on construction.",
  "6 months maintenance on all finishing.",
  "Verification and no-dues process.",
  "Dedicated customer support.",
  "Proper billing and receipts.",
  "Guarantee and warranty based on individual products.",
  "No extra cost for architect services.",
  "Weekly project report and planning for the next stage.",
  "Hassle-free construction and vendor management.",
  "Skilled team of labour and masons.",
  "Professional, experienced architects, civil engineers and interior designers.",
  "Time-bound work, with on-time delivery.",
  "Our own quality control.",
  "Loan assistance.",
  "Customised quotation and flexible payment options.",
];
export const WHY_OTHER = [
  "No office that is reachable for customers.",
  "No guarantee of structure.",
  "No maintenance after possession.",
  "No customer support.",
  "No options for billing.",
  "No guarantee or warranty on finishing items.",
  "No options to choose finishing items.",
  "No waterproofing or termite treatment.",
  "Hassle of managing labour and materials yourself.",
  "Extra cost for architect services.",
  "Non-skilled and untechnical approach.",
  "No loan assistance.",
  "No space for discussion and verification.",
  "Misleading and fake promises.",
];

export const TEAM = [
  { img: "IMG-75", name: "Er. Virendra Kumar Nishad", role: "Chairman & Managing Director", years: "14 yrs", specialty: "Has personally handed over 190 of the 260 homes." },
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
  ["What is the cost of building a house in Lucknow per sq. ft.?", "House construction in Lucknow starts at ₹1,299/sqft on Silver, ₹1,699/sqft on Gold and ₹1,999/sqft on Platinum. That rate covers construction only. Your plot cost, LDA or Nagar Nigam approval fees, electricity and water connection charges, and interiors beyond the package are billed separately, and every exclusion is listed on page 2 of the written quote before you sign anything."],
  ["How much will it cost to build a 1,000 sq. ft. house?", "A 1,000 sqft home works out to ₹12.99 lakh on Silver, ₹16.99 lakh on Gold and ₹19.99 lakh on Platinum for construction. Most homeowners in Lucknow land on Gold for a 1,000 sqft 2 BHK. Use the cost calculator on this site with your exact plot size to get your own number in under a minute."],
  ["Can you build my house within my budget?", "Yes, and we tell you honestly if we cannot. Bring your budget to the free consultation and we will work backwards from it. We will tell you what fits at that number, what has to be dropped, and which package matches it. If the number genuinely will not build a safe home, we say so rather than take the contract."],
  ["What is included in your construction package?", "Every package covers the full structure from foundation to handover: RCC structure, brickwork, plaster, waterproofing, plumbing and electrical wiring, flooring, painting, doors and windows, and sanitary fittings. The difference between Silver, Gold and Platinum is the material grade, the finishing level, and how long we support you after handover. Structural warranty is 25 years on all three."],
  ["Are there any hidden charges in house construction?", "No. The quote names every item, every brand and every stage before you sign. Anything outside it is listed as an exclusion in writing. If you change something mid-construction, we issue a written change order showing the exact cost and timeline impact, and nothing is done until you approve it on WhatsApp."],
  ["How do I know you will use good-quality construction materials?", "Because you approve them and you can verify them. Brands and grades are named in the quote before you sign. Cement is bought fresh direct from the rack, TMT bars come from authorised dealers, bricks are first-class, and all mixing follows M20 grade at 1:1.5. Batches are tested before site delivery and rejected batches are returned. You can check any of it on any site visit."],
  ["How long will it take to complete my house?", "8 to 11 months for a 1,500 to 2,500 sqft home. Our average across 260 homes is 9 months 2 weeks. Monsoon, approval queues and mid-way design changes are the three things that move that number, and the agreement carries a written on-time delivery clause."],
  ["Do you provide a written agreement before starting construction?", "Yes, always, before a single brick is laid. It names the payment schedule, the material brands and grades, the stage timeline, the 25-year structural warranty and the delay clause. If any of those are missing, do not start the work."],
  ["Do you help with LDA map approval in Lucknow?", "Yes. We handle LDA and Nagar Nigam plan sanction and the completion certificate. Government fees are charged at actuals and shown separately from our construction rate. It depends on the authority, but typically takes 4 to 7 weeks."],
  ["Can I see the 2D floor plan and 3D elevation before construction?", "Yes. You approve the 2D floor plan and the 3D elevation before construction starts, and we build to those approved drawings. If you already have an architect, we will build from their drawings after our structural engineer reviews them for safety."],
  ["Can I make changes to my house design?", "Yes, it is common. We issue a written change order with the cost and timeline impact before doing the work, and you approve it on WhatsApp. Nothing changes on site without that approval, so you are never surprised by a bill."],
  ["How will I track the progress of my house construction?", "Two ways. Visit the site anytime without an appointment; the supervisor is there 9am to 6pm, six days a week. And we send site photos every Monday and Thursday on WhatsApp, so you can follow the build even from another city. One named project manager is your single point of contact."],
  ["Do you provide a warranty on construction work?", "25 years in writing on the RCC structure: foundation, columns, beams and slabs. It covers structural cracks and settlement, and it is transferable if you sell the home. Finishes carry a separate 12-month support, and post-handover fixes are free during that period."],
  ["Why should I choose Ghar Banwao over a local contractor?", "Four things a local contractor usually will not put in writing: a 25-year structural warranty, payment released only after you sign off each finished stage, brands and grades named in the quote, and one named project manager who answers your WhatsApp. We have delivered 260 homes across 8 UP cities from the same Lucknow office since 2017, and the materials comparison on the packages page shows exactly where the difference sits."],
  ["How can I get started with Ghar Banwao?", "Book a free consultation using the form on this page. We call within 2 hours on business days, visit your site for free, discuss the design for free, and send a written quote with no commitment to continue. You can also WhatsApp us directly on 09648249999."],
];

export const HOME_FAQS = FAQS.filter(([q]) => HOME_FAQ_QUESTIONS.includes(q));

export const FAQ_GROUPS = [
  { label: "Cost & Budget", questions: [0, 1, 2, 4] },
  { label: "Quality & Materials", questions: [5] },
  { label: "Timeline & Process", questions: [6, 8, 9, 10, 11] },
  { label: "Trust & Getting Started", questions: [3, 7, 12, 13, 14] },
];

export const SEARCH_POPULAR = ["2 BHK cost Lucknow", "30×50 house plan", "turnkey package", "brick quality", "GB-229"];
