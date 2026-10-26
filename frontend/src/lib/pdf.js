import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const INK = [0, 0, 0];
const GREEN = [147, 197, 38];
const WASH_YELLOW = [255, 252, 230];
const FOOT_GREY = [245, 245, 240];
const GRAY = [108, 108, 102];
const DIVIDER = [225, 225, 219];

const fmtRs = (n) => "Rs. " + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n || 0));

const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });

// Downscale the source logo onto a small canvas so the embedded PDF asset stays a few KB
// instead of shipping the full-resolution source image.
const rasterizeLogo = (img, targetHeightMM) => {
  const pxPerMm = 6; // ~150dpi, plenty crisp for a print PDF
  const hPx = Math.round(targetHeightMM * pxPerMm);
  const wPx = Math.round(hPx * (img.naturalWidth / img.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = wPx;
  canvas.height = hPx;
  canvas.getContext("2d").drawImage(img, 0, 0, wPx, hPx);
  return { dataUrl: canvas.toDataURL("image/png"), wPx, hPx };
};

// Rendering is split off from downloadEstimatePDF so the share flow can hand
// the same document back as a base64 attachment without a second copy of the
// layout code.
async function renderEstimatePDF(doc, { estimate, inputs }) {
  const pageW = doc.internal.pageSize.getWidth();
  const marginX = 15;
  let y = 14;

  // Header: logo (falls back to wordmark if the image can't be read)
  try {
    const logo = await loadImage("/logo.png");
    const logoH = 13;
    const logoW = logoH * (logo.naturalWidth / logo.naturalHeight);
    const { dataUrl } = rasterizeLogo(logo, logoH);
    doc.addImage(dataUrl, "PNG", marginX, y - 2, logoW, logoH);
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...INK);
    doc.text("GharBanwao.com", marginX, y + 7);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text("09648249999  /  09648259999", pageW - marginX, y + 2, { align: "right" });
  doc.text("gharbanwao.com", pageW - marginX, y + 7, { align: "right" });

  y += 17;
  doc.setFillColor(...GREEN);
  doc.rect(marginX, y, pageW - marginX * 2, 1.3, "F");
  y += 9;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...INK);
  doc.text("Construction Cost Estimate", marginX, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GRAY);
  const genDate = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  doc.text(
    `${inputs.city}, ${inputs.state || "Uttar Pradesh"}  ·  ${Math.round(estimate.sqft).toLocaleString("en-IN")} sqft plot  ·  Generated ${genDate}`,
    marginX,
    y
  );
  y += 10;

  // Summary strip
  const boxes = [
    { label: "TOTAL ESTIMATED COST", value: fmtRs(estimate.total) },
    { label: "COST PER SQFT", value: fmtRs(estimate.perSqft) },
    { label: "ESTIMATED DURATION", value: `${estimate.days} days` },
  ];
  const boxW = (pageW - marginX * 2 - 8) / 3;
  boxes.forEach((b, i) => {
    const bx = marginX + i * (boxW + 4);
    doc.setFillColor(...WASH_YELLOW);
    doc.rect(bx, y, boxW, 20, "F");
    doc.setFillColor(...GREEN);
    doc.rect(bx, y, 1.2, 20, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY);
    doc.text(b.label, bx + 4, y + 6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...INK);
    doc.text(b.value, bx + 4, y + 15);
  });
  y += 28;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.text("Phase-wise Breakdown", marginX, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    head: [["Phase", "Duration (days)", "% of cost", "Amount"]],
    body: estimate.phases.map((p) => [p.label, `${p.days}`, `${p.percent}%`, fmtRs(p.amount)]),
    foot: [["Total", `${estimate.days} days`, "100%", fmtRs(estimate.total)]],
    theme: "plain",
    styles: { fontSize: 9, textColor: INK, lineColor: DIVIDER, lineWidth: 0.1, cellPadding: 2.4 },
    headStyles: { fillColor: GREEN, textColor: INK, fontStyle: "bold" },
    footStyles: { fillColor: FOOT_GREY, textColor: INK, fontStyle: "bold" },
    alternateRowStyles: { fillColor: WASH_YELLOW },
    columnStyles: { 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" } },
  });

  y = doc.lastAutoTable.finalY + 10;
  if (y > 230) {
    doc.addPage();
    y = 16;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.text("Resource Allocation", marginX, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    head: [["Resource", "Quantity", "Quality tier", "Rate", "Amount"]],
    body: estimate.rows.map((r) => [
      r.label,
      `${r.qty >= 100 ? Math.round(r.qty).toLocaleString("en-IN") : r.qty.toFixed(1)} ${r.unit}`,
      r.quality.charAt(0).toUpperCase() + r.quality.slice(1),
      `Rs. ${r.rate}/${r.unit.replace(/s$/, "")}`,
      fmtRs(r.amount),
    ]),
    foot: [["Total estimated cost", "", "", `${fmtRs(estimate.perSqft)}/sqft`, fmtRs(estimate.total)]],
    theme: "plain",
    styles: { fontSize: 9, textColor: INK, lineColor: DIVIDER, lineWidth: 0.1, cellPadding: 2.4 },
    headStyles: { fillColor: GREEN, textColor: INK, fontStyle: "bold" },
    footStyles: { fillColor: FOOT_GREY, textColor: INK, fontStyle: "bold" },
    alternateRowStyles: { fillColor: WASH_YELLOW },
    columnStyles: { 3: { halign: "right" }, 4: { halign: "right" } },
  });

  // Footer disclaimer + page numbers on every page
  const pageCount = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    const pageH = doc.internal.pageSize.getHeight();
    doc.setDrawColor(...DIVIDER);
    doc.line(marginX, pageH - 20, pageW - marginX, pageH - 20);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor(...GRAY);
    doc.text(
      "Costs shown are approximate for each resource and may vary by city and site requirements. This is not a binding quote. Default quality tier is Medium.",
      marginX,
      pageH - 14,
      { maxWidth: pageW - marginX * 2 }
    );
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...INK);
    doc.text("GharBanwao.com  ·  09648249999 / 09648259999  ·  Lucknow, Uttar Pradesh", marginX, pageH - 8);
    doc.setTextColor(...GRAY);
    doc.text(`Page ${p} of ${pageCount}`, pageW - marginX, pageH - 8, { align: "right" });
  }

}

export async function downloadEstimatePDF({ estimate, inputs, config }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  await renderEstimatePDF(doc, { estimate, inputs });
  const safeCity = (inputs.city || "Estimate").replace(/\s+/g, "-");
  doc.save(`GharBanwao-Estimate-${safeCity}-${Math.round(estimate.sqft)}sqft.pdf`);
}

/** Same document, returned as a base64 PDF string so the share flow can attach
 * it to an email via the lead endpoint. */
export async function estimatePDFBase64({ estimate, inputs, config }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  await renderEstimatePDF(doc, { estimate, inputs });
  return doc.output("datauristring").split(",")[1];
}
