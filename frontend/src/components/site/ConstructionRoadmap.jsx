import { useRef } from "react";
import "./ConstructionRoadmap.css";

/* --- inline art ----------------------------------------------------- */

const MEETING_ART = (
  <svg className="cr-art" viewBox="0 0 200 100" role="img" aria-label="Architect discussing a house plan with a client">
    <rect x="70" y="10" width="64" height="39" rx="3" fill="white" stroke="#d4e1bf" />
    <path d="M80 39V27l12-9 12 9v12zM113 23h13m-13 7h13m-13 7h8" fill="none" stroke="#8caa64" strokeWidth="2" />
    <rect x="26" y="58" width="148" height="8" rx="4" fill="#b9cc99" />
    <path d="M38 66v24m124-24v24" stroke="#768a5d" strokeWidth="5" />
    <circle cx="44" cy="32" r="10" fill="#d8a880" />
    <path d="M34 28q0-17 18-7l3 8-11-4z" fill="#344a2c" />
    <path d="M29 55q2-15 15-15t16 15v6H29z" fill="#95c726" />
    <path d="M52 48l20 12 19-3" fill="none" stroke="#d8a880" strokeWidth="6" strokeLinecap="round" />
    <circle cx="156" cy="32" r="10" fill="#c9916c" />
    <path d="M146 29q-2-16 16-9l5 10-11-5z" fill="#36482e" />
    <path d="M139 61V53q3-14 17-13t17 21" fill="#49613a" />
    <path d="M146 47l-15 12-17-3" fill="none" stroke="#c9916c" strokeWidth="6" strokeLinecap="round" />
    <path d="M75 56h46l8 7H68z" fill="white" stroke="#8da676" />
    <path d="M85 58h21m-15 3h23" stroke="#95c726" />
    <path d="M39 68v21h17m101-21v21h-17" fill="none" stroke="#4c603d" strokeWidth="7" strokeLinecap="round" />
  </svg>
);

const HOUSE_ART = (
  <svg className="cr-art" viewBox="0 0 200 100" role="img" aria-label="Completed modern two-storey home with landscaped garden">
    <circle cx="161" cy="20" r="11" fill="#e5efcc" />
    <path d="M13 88h174" stroke="#b9cd96" strokeWidth="3" />
    <rect x="43" y="39" width="116" height="48" fill="#e0e7d5" />
    <rect x="57" y="15" width="79" height="43" fill="white" stroke="#cbd7bd" />
    <path d="M52 15h89" stroke="#536247" strokeWidth="5" />
    <rect x="68" y="24" width="23" height="22" fill="#647a60" />
    <rect x="98" y="24" width="25" height="22" fill="#647a60" />
    <path d="M80 24v22m30-22v22" stroke="#a9c0a0" strokeWidth="2" />
    <rect x="38" y="49" width="126" height="8" fill="white" />
    <path d="M49 49V38h106v11m-95-11v11m17-11v11m17-11v11m17-11v11m17-11v11m17-11v11" fill="none" stroke="#849975" strokeWidth="1.5" />
    <rect x="57" y="63" width="31" height="24" fill="#647a60" />
    <path d="M72 63v24" stroke="#b8c9ad" strokeWidth="2" />
    <rect x="105" y="61" width="20" height="26" fill="#8d795c" />
    <circle cx="120" cy="75" r="1.5" fill="#eed6a2" />
    <path d="M103 89h26l6 7H97z" fill="#d7ddce" />
    <path d="M29 84V58m142 26V63" stroke="#839266" strokeWidth="3" />
    <circle cx="29" cy="59" r="13" fill="#95c726" />
    <circle cx="171" cy="67" r="10" fill="#95c726" />
    <path d="M43 87h48m48 0h21" stroke="#95c726" strokeWidth="5" />
  </svg>
);

/* Milestone brand marks. NB = Nakshaa Banwao (design/registration phase),
   GB = Ghar Banwao (construction phase) — the two partner-brand logos, shown
   on a white panel inside the (yellow) milestone card. */
const NB_ART = (
  <img className="cr-art cr-art--logo" src="/images/brands/nakshaa-banwao.webp" alt="Nakshaa Banwao" width={160} height={68} />
);

const GB_ART = (
  <img className="cr-art cr-art--logo" src="/images/brands/ghar-banwao.webp" alt="Ghar Banwao" width={160} height={68} />
);

/* --- step data ------------------------------------------------------ */

const STEPS = [
  { title: "Search the Right Company", text: "Compare profiles, reviews and past projects before you commit.", icon: "⌕" },
  { title: "Appointment & Meeting", text: "Book a free consultation call or an in-person site visit with our team.", icon: "▣", art: MEETING_ART },
  { title: "NB Project Code Allotment", text: "Your design project is registered with Nakshaa Banwao.", icon: "NB", art: NB_ART, milestone: true },
  { title: "Meet Architect & Engineer Team", text: "Discuss layout, Vastu, elevation and structural requirements.", icon: "⌂" },
  { title: "Design & Final Discussion", text: "Floor plan, 3D elevation and structural drawings are finalized.", icon: "✎" },
  { title: "Get Quotation & Agreement", text: "Receive a transparent phase-wise quotation and finalize the agreement.", icon: "₹" },
  { title: "GB Project Code Allotment", text: "Your construction project is registered with Ghar Banwao.", icon: "GB", art: GB_ART, milestone: true },
  { title: "Pooja & Work Start", text: "Bhoomi Pujan followed by foundation work and construction start.", icon: "ॐ" },
  { title: "Project Updates & Engineer Support", text: "Regular WhatsApp updates with direct access to your project team.", icon: "↗" },
  { title: "Finishing & Delivery", text: "Final quality checks, finishing, warranty handover and keys.", icon: "✓", art: HOUSE_ART },
];

/* Geometry for the 1035px-tall, 1340px-wide track. First five steps fan out
   on the top curve, the last five on the bottom curve, with the card centred
   on the pin x. Top/bottom y alternate along the S so cards never overlap. */
function geom(i) {
  const top = i < 5;
  const col = top ? i : 9 - i;
  const x = 140 + 240 * col;
  const y = top ? (col % 2 ? 415 : 360) : (col % 2 ? 705 : 660);
  const number = String(i + 1).padStart(2, "0");
  const stemTop = top ? 270 : y + 27;
  const stemHeight = top ? y - 297 : 755 - stemTop;
  return { top, x, y, number, stemTop, stemHeight };
}

export default function ConstructionRoadmap() {
  const scroller = useRef(null);

  const scroll = (dir) => scroller.current?.scrollBy({ left: dir * 480 });

  return (
    <div className="cr" data-testid="construction-roadmap">
      <div className="cr-header">
        <small className="cr-kicker">HOW WE WORK</small>
        <h2 className="cr-title">
          Your Dream Home,
          <br />
          <span>From First Step to Final Handover</span>
        </h2>
        <p className="cr-sub">
          Every step planned. Every milestone tracked.
          <br />
          A clear journey from your first idea to your finished home.
        </p>
      </div>

      <div className="cr-controls">
        <span>Follow the curves · Explore all 10 steps →</span>
        <div className="cr-nav">
          <button className="cr-btn" onClick={() => scroll(-1)} aria-label="Scroll left">←</button>
          <button className="cr-btn" onClick={() => scroll(1)} aria-label="Scroll right">→</button>
        </div>
      </div>

      {/* The curved track is a fixed 1340px canvas — it scrolls sideways on
          phones, which is exactly what this section shouldn't do. Below 700px
          a vertical timeline takes its place: one step per row, in order, no
          horizontal movement. */}
      <div className="cr-desktop">
      <div className="cr-scroll" ref={scroller} tabIndex={0} role="region" aria-label="Curved ten-step construction roadmap" data-testid="roadmap-scroll">
        <div className="cr-track">
          <svg className="cr-road" viewBox="0 0 1340 1035" aria-hidden="true">
            <defs>
              <path
                id="cr-route"
                d="M65 360 H140 C260 360 260 415 380 415 S500 360 620 360 S740 415 860 415 S980 360 1100 360 C1280 360 1290 660 1100 660 C980 660 980 705 860 705 S740 660 620 660 S500 705 380 705 S260 660 140 660 H65"
              />
              <filter id="cr-shadow" x="-15%" y="-30%" width="130%" height="160%">
                <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#293b12" floodOpacity="0.13" />
              </filter>
            </defs>
            <use href="#cr-route" fill="none" stroke="#e5ecd9" strokeWidth="91" strokeLinecap="round" filter="url(#cr-shadow)" />
            <use href="#cr-route" fill="none" stroke="#000000" strokeWidth="78" strokeLinecap="round" />
            <use href="#cr-route" fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="16 16" />
            <g fill="#95c726">
              <path d="M263 370 l15 13 -19 4 5 -8z" />
              <path d="M743 370 l15 13 -19 4 5 -8z" />
              <path d="M1240 510 l-10 17 -9 -17 9 5z" />
              <path d="M992 683 l-17 -9 17 -9 -5 9z" />
              <path d="M512 683 l-17 -9 17 -9 -5 9z" />
            </g>
          </svg>

          <div className="cr-center">
            <small>DESIGN • BUILD • DELIVER</small>
            <h3>Every turn brings you closer to home.</h3>
            <p>Nakshaa Banwao&nbsp;&nbsp;→&nbsp;&nbsp;Ghar Banwao</p>
          </div>

          {STEPS.map((step, i) => {
            const g = geom(i);
            return (
              <article key={i} aria-label={`Step ${g.number}: ${step.title}`} data-testid={`roadmap-step-${i + 1}`}>
                <div
                  className={`cr-card ${g.top ? "cr-card--top" : "cr-card--bottom"}${step.milestone ? " cr-card--milestone" : ""}`}
                  style={{ left: g.x - 107 }}
                >
                  <span className="cr-shimmer" aria-hidden="true" />
                  <div className="cr-card-head">
                    <span className="cr-icon" aria-hidden="true">{step.icon}</span>
                    {step.milestone ? <span className="cr-badge">MILESTONE</span> : null}
                  </div>
                  {step.art || null}
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
                <div className="cr-stem" style={{ left: g.x, top: g.stemTop, height: g.stemHeight }} aria-hidden="true" />
                <div className="cr-pin" style={{ left: g.x - 27.5, top: g.y - 27.5 }} aria-hidden="true">{g.number}</div>
              </article>
            );
          })}
        </div>
      </div>
      </div>

      {/* Mobile: vertical, single-column timeline — reads top-to-bottom with
          no horizontal scrolling. Shown only under 700px. */}
      <ol className="cr-mobile" aria-label="Construction journey, step by step" data-testid="roadmap-mobile">
        {STEPS.map((step, i) => {
          const number = String(i + 1).padStart(2, "0");
          return (
            <li key={i} className={`cr-m-step${step.milestone ? " cr-m-step--milestone" : ""}`} data-testid={`roadmap-mobile-step-${i + 1}`}>
              <div className="cr-m-rail" aria-hidden="true">
                <span className="cr-m-pin">{number}</span>
                {i < STEPS.length - 1 ? <span className="cr-m-line" /> : null}
              </div>
              <div className="cr-m-card">
                <div className="cr-m-head">
                  <span className="cr-icon" aria-hidden="true">{step.icon}</span>
                  {step.milestone ? <span className="cr-badge">MILESTONE</span> : null}
                </div>
                {step.art || null}
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <footer className="cr-footer">YOUR VISION. OUR COMMITMENT.</footer>
    </div>
  );
}
