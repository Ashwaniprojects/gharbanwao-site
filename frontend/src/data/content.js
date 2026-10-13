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
export const FOOTER_NAV = [
  { label: "Home", id: "home" },
  { label: "About Us", id: "about" },
  { label: "Services", id: "services" },
  { label: "Projects", id: "projects" },
  { label: "Packages", id: "packages" },
  { label: "Calculator", id: "calculator" },
  { label: "Reviews", id: "testimonials" },
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
  "📞 09648249999 · 09648259999  ·  Serving Lucknow / Kanpur / Ayodhya / Gorakhpur / Vindhyachal / Prayagraj / Sitapur / Sultanpur",
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
  { icon: "CalendarRange", title: "Flexible payment schedule", text: "7 or 9 installments, mapped to your cash flow, not ours." },
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
  { n: "05", name: "Design & Final Discussion", highlight: "Floor plan, 3D elevation and structural drawing finalized together." },
  { n: "06", name: "Get Quotation & Agreement", highlight: "A transparent, phase-wise quote signed before a single brick moves." },
  { n: "07", name: "GB Project Code Allotment", highlight: "Your build is registered with Ghar Banwao and assigned a site engineer." },
  { n: "08", name: "Pooja & Work Start", highlight: "Bhoomi pujan first, then foundation work begins right on schedule." },
  { n: "09", name: "Step-by-Step Project Update & Engineer Support", highlight: "Weekly WhatsApp photo updates with direct access to your engineer." },
  { n: "10", name: "Finishing & Delivery", highlight: "150-point checklist, warranty handover, and keys in your hand." },
];

export const BRANDS = ["UltraTech", "ACC", "Shree", "Tata TISCON", "JSW Neosteel", "Jindal Panther", "Asian Paints", "Berger", "Jaquar", "Hindware", "Kajaria", "Somany", "Finolex", "Havells", "Legrand"];

export const TESTIMONIALS = [
  ["Alok Saxena", "Lucknow", "2025", "I am extremely impressed with the house construction quality and overall service provided by Ghar Banwao. From the very beginning, their team demonstrated professionalism, transparency, and strong technical expertise. The construction quality is top-notch, with excellent material standards, precise workmanship, and great attention to detail at every stage. What truly stood out was their commitment to timelines and regular updates. Each phase of construction was well-planned and executed smoothly, giving us complete peace of mind. The engineers and supervisors were knowledgeable, responsive, and always ready to clarify doubts or suggest better solutions. The final result exceeded our expectations—solid structure, clean finishing, and a modern, premium feel throughout the house. Ghar Banwao truly delivers what they promise and ensures quality without compromise. I highly recommend Ghar Banwao to anyone looking for reliable, high-quality, and stress-free house construction.", "GB-209", "5"],
  ["Dr. Jyothi Gupta", "Lucknow", "2025", "Highly Experienced and great team and trustworthy process. A wonderful finish and a great coordination with team. Highly recommend and value for money work.", "GB-246", "5"],
  ["Vaibhav Shukla", "Lucknow", "2025", "I want to sincerely thank the entire Ghar Banwao team — especially Virender Sir, Pathak Sir, and site head Bhola — for the exceptional work delivered on our home. The quality, professionalism, and transparency maintained throughout the project have exceeded our expectations. Your dedication, attention to detail, and commitment to excellence have truly made this journey smooth and satisfying for me and my family. It has been a pleasure working with such a reliable and efficient team.", "GB-223", "5"],
  ["Bhaskar Mishra", "Lucknow", "2025", "Excellent construction company! They built my dream home with outstanding quality and professionalism. The work was completed on time, and the entire team was very supportive and skilled specially Virendra and Gautam Pathak Ji. Highly recommended!", "GB-217", "5"],
  ["Vipin Verma", "Lucknow", "2025", "First of all a very big thanks to all team members of Ghar Banwao for making my dream home. The quality of all material used for construction are same as they promised in agreement. They are very cooperative with all your ideas and work with full dedication and honesty. I want to give my token of appreciation specially to Virender ji and Gautam pathak ji.", "GB-190", "5"],
  ["Pradeep Mishra", "Vindhyachal", "2025", "Very reliable and trusted construction company, with a lot of experience and excellence. They provide customised service with full effort. I am thankful to the CEO Eng Veerendra ji and full team of Ghar Banwao for their immense support to built my dream house. Once again I recommend this team with 100 percent satisfaction. Good wishes to all the staff including civil, electric, plumbing, painting, carpentry, supervisor Mr Dheeraj, Project eng Sri Gautam Pathak ji.", "GB-222", "5"],
  ["Vishal Sharma", "Lucknow", "2025", "Ghar Banwao made my dream home, thankyou so much for making such a nice home.", "GB-Unknown", "5"],
  ["Ghanshyam Verma", "Lucknow", "2025", "I am very satisfied with the work of this construction company. They built my house with very good quality materials and completed the work on time. The team was professional, cooperative, and paid attention to every detail. Overall, it was a great experience, and I highly recommend this company for house construction.", "GB-Unknown", "5"],
  ["Krishna Kumari", "Lucknow", "2025", "Truly amazing company. Excellent coordination and quality work. I will highly recommend Ghar Banwao for house construction and designing.", "GB-Unknown", "5"],
  ["Akhilesh Kumar", "Lucknow", "2025", "We appreciate the excellent work completed in full compliance with all agreed commitments.", "GB-216", "5"],,
  ["Rupesh Chaturvedi", "Lucknow", "2025", "One can look for the services of Ghar Banwao as they are very supportive in home construction.", "GB-214", "5"],,
  ["Surendra Sharma", "Lucknow", "2025", "Company work is too incredible. Excellent team coordination and satisfied work with great quality work and experience. Highly recommended.", "GB-228", "5"],,
  ["Shivansh Srivastava", "Lucknow", "2025", "Construction line is full of hassle and tricky businesses, but they seemed to be fulfilling all our requirements under budget. They do work with less margin compared to others.", "GB-Unknown", "5"],,
  ["Rishabh Singh", "Lucknow", "2025", "Great place to give your dream house a desired look. Our requirement was new construction and renovation which together can give good look from outside and inside. Ghar Banwao did their job exceptionally well. Good quality of material used and delivered us our house timely.", "GB-215", "5"],,
  ["Sachin Tripathi", "Lucknow", "2025", "Excellent work. Build of our dream house are so very beautiful like villa. We are thankful to company owner Mr. Virendra and all company workers. Very understanding and good core team work performance.", "GB-Unknown", "5"],,
  ["Sunil", "Lucknow", "2025", "The best and the greatest company in Lucknow even in UP. The services are top notch. The customer support is top notch. The quality is top notch and also a great and affordable budget service. I am glad to like this company.", "GB-Unknown", "5"],,
  ["Jasleen Bhatia", "Lucknow", "2025", "My experience with Ghar Banwao was amazing. Their team members were very professional. Also they built my dream home in committed time. I would definitely recommend Ghar Banwao to everyone. Keep growing.", "GB-Unknown", "5"],,
].map(([name, locality, date, quote, project_id, rating], i) => ({
  name,
  locality,
  date,
  quote,
  project_id,
  project_size: "-",
  rating: Number(rating),
  source: "Google review",
  portrait: null,
  thumb: null,
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
  { name: "Silver", price: "₹1,299", best: "First-time builders, tight budgets", rows: ["25 years", "7", "Weekly", "Standard", "Essential", "6 months"], cta: "Get Quote", featured: false },
  { name: "Gold", price: "₹1,699", best: "Most homeowners, best value", rows: ["25 years", "9", "2× weekly", "Mid-premium", "Enhanced", "12 months"], cta: "Get Quote", featured: true },
  { name: "Platinum", price: "₹1,999", best: "Larger plots, custom finishes", rows: ["25 years", "9 + custom", "2× weekly + on-demand", "Premium", "Custom-specified", "24 months"], cta: "Book Design Session", featured: false },
];
export const PRICING_ROWS = ["Structure warranty", "Payment stages", "Site visits by engineer", "Material grade", "Finishing level", "Post-handover support"];

export const COMPARISON = [
  ["Payment linked to stages", "7 or 9 stages", "Weekly cash calls"],
  ["Material brand named in quote", "Yes, in writing", "\"As per site\""],
  ["Structural warranty", "25 years written", "None"],
  ["Weekly site photos to homeowner", "Mon + Thu", "\"Come visit anytime\""],
  ["Dedicated project manager", "One name, one WhatsApp", "Owner is also 4 other sites"],
  ["Post-handover fixes", "12 months free", "Charged"],
  ["Written on-time delivery clause", "Yes", "No"],
];

export const TEAM = [
  { img: "IMG-75", name: "Er. Virendra Kumar Nishad", role: "Chairman & Managing Director", years: "14 yrs", specialty: "Has personally handed over 190 of the 260 homes." },
  { img: "IMG-76", name: "Er. Neha Tripathi", role: "Lead Structural Engineer", years: "11 yrs", specialty: "RCC design, soil-bearing analysis, retrofit." },
  { img: "IMG-77", name: "Pallavi Mehrotra", role: "Head of Quality", years: "9 yrs", specialty: "Owns the 150-point checklist. Rejects batches." },
  { img: "IMG-78", name: "Ramesh Kushwaha", role: "Site Supervisor", years: "17 yrs", specialty: "Brickwork and plaster. Plumb line in pocket." },
  { img: "IMG-79", name: "Sana Rizvi", role: "Interior Lead", years: "8 yrs", specialty: "Modular kitchens, wardrobes, lighting plans." },
  { img: "IMG-80", name: "Vivek Rastogi", role: "Customer Success Lead", years: "6 yrs", specialty: "The one WhatsApp number. Replies in under 2 hours." },
];

export const FAQS = [
  ["How much does a 1500 sqft 2 BHK cost in Lucknow in 2026?", "Between ₹19.49 lakh (Silver, ₹1,299/sqft) and ₹29.99 lakh (Platinum, ₹1,999/sqft) for construction. Most homeowners land near ₹25.5 lakh on Gold (₹1,699/sqft). Plot cost, approvals, and interiors beyond the package are separate. Use the calculator above for your exact size."],
  ["How long does construction actually take?", "8 to 11 months for a 1500 to 2500 sqft home. Our average across 260 homes is 9 months 2 weeks. Monsoon, approval queues, and mid-way design changes are the three variables that move this."],
  ["What happens if construction gets delayed?", "The agreement has a written delay clause. Delays caused by us carry a per-day deduction. Delays from approvals, weather, or your changes are logged and shared on WhatsApp the day they happen. Our published average delay is 11 days."],
  ["Can I visit the site anytime?", "Yes. No appointment needed. The site supervisor is there 9am to 6pm, six days a week. Many homeowners' parents visit daily. We also send photos every Monday and Thursday."],
  ["Who approves which cement, steel, bricks are used?", "You do. Brands and grades are named in the quote before you sign. Any change needs your written OK. Samples are tested before site delivery and rejected batches are returned."],
  ["What is the payment schedule?", "7 installments on Silver, 9 on Gold and Platinum. Each one is released only after you sign off the completed stage. No payment is tied to a calendar date."],
  ["What is NOT included in your quote?", "Plot cost, government approval fees, electricity and water connection charges, boundary wall beyond 4 ft, and interiors not listed in the package. Every exclusion is listed on page 2 of the quote."],
  ["What is the structural warranty? What does it cover?", "25 years, in writing, on the RCC structure: foundation, columns, beams, slabs. Covers structural cracks and settlement. It is transferable if you sell the home. Finishes carry a separate 12-month support."],
  ["Do you handle approvals and permits?", "Yes. LDA or Nagar Nigam plan sanction, and the completion certificate. Government fees are at actuals and shown separately. It depends on the authority — typically 4 to 7 weeks."],
  ["Can I use my own architect?", "Yes. We build from your architect's approved drawings. Our structural engineer reviews them first and we will tell you if anything needs to change for safety."],
  ["What if I want to change something mid-construction?", "Common. We issue a written change order with the cost and timeline impact before doing the work. You approve it on WhatsApp. Nothing changes without that."],
  ["How do I know you won't disappear?", "260 homes on the map above, each with a real address. 9 years, same office in Lucknow. Payments are stage-linked so your money is never ahead of the work."],
];

export const SEARCH_POPULAR = ["2 BHK cost Lucknow", "30×50 house plan", "turnkey package", "brick quality", "GB-229"];
