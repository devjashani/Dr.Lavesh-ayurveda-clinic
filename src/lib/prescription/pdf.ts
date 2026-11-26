import { PrescribedMedicine } from '@/lib/prescription/types';

export interface PrescriptionDownloadInput {
  bookingRef: string;
  appointmentDate: string;
  slotLabel: string;
  patientName: string;
  patientAge?: number | string;
  patientGender?: string;
  doctorName?: string;
  medicines: PrescribedMedicine[];
  clinicalAdvice?: string;
}

/**
 * Checks if a string contains characters outside standard ASCII/Latin-1 (e.g., Gujarati/Devanagari/Emoji)
 */
function containsExtendedUnicode(text: string): boolean {
  return /[^\x00-\xFF]/.test(text);
}

/**
 * Normalizes common symbols like ₹ for WinAnsi PDF Helvetica rendering
 */
function sanitizePdfText(text: string): string {
  return text
    .replace(/₹/g, 'Rs. ')
    .replace(/[–—]/g, '-')
    .replace(/[•·]/g, '-')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if (!word) continue;
    if (word.length > maxChars) {
      if (current) {
        lines.push(current);
        current = '';
      }
      for (let i = 0; i < word.length; i += maxChars) {
        lines.push(word.slice(i, i + maxChars));
      }
      continue;
    }
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [''];
}

function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(dt);
  } catch {
    return dateStr;
  }
}

/**
 * Builds a clean multi-page A4 PDF (v1.4) directly in the browser using standard Helvetica fonts.
 */
function buildPrescriptionPdfBlob(data: PrescriptionDownloadInput): Blob {
  const pageWidth = 595;
  const pageHeight = 842;
  const marginX = 48;
  const contentWidth = pageWidth - marginX * 2;

  const pagesOps: string[][] = [];
  let ops: string[] = [];
  let y = pageHeight - 48;

  const pushPage = () => {
    pagesOps.push(ops);
    ops = [];
    y = pageHeight - 54;
  };

  const ensureSpace = (neededHeight: number) => {
    if (y - neededHeight < 75) {
      pushPage();
    }
  };

  const drawText = (
    text: string,
    x: number,
    yPos: number,
    size: number,
    bold = false,
    r = 0.08,
    g = 0.16,
    b = 0.11
  ) => {
    const font = bold ? 'F2' : 'F1';
    ops.push(
      `BT /${font} ${size} Tf ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg 1 0 0 1 ${x} ${yPos} Tm (${sanitizePdfText(text)}) Tj ET`
    );
  };

  const drawRect = (
    x: number,
    yPos: number,
    w: number,
    h: number,
    r: number,
    g: number,
    b: number
  ) => {
    ops.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg ${x} ${yPos} ${w} ${h} re f`);
  };

  const drawLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    r = 0.82,
    g = 0.85,
    b = 0.82,
    width = 0.75
  ) => {
    ops.push(
      `${width} w ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG ${x1} ${y1} m ${x2} ${y2} l S`
    );
  };

  // --- Header Banner ---
  drawRect(0, pageHeight - 92, pageWidth, 92, 0.078, 0.161, 0.11); // Deep forest #14291C
  drawRect(0, pageHeight - 95, pageWidth, 3, 0.851, 0.604, 0.169); // Turmeric accent #D99A2B

  drawText('VANKAL AYURVEDA', marginX, pageHeight - 40, 20, true, 0.984, 0.976, 0.957);
  drawText(
    'Classical Ayurvedic Teleconsultation & Lifestyle Care',
    marginX,
    pageHeight - 58,
    9.5,
    false,
    0.851,
    0.604,
    0.169
  );
  drawText(
    `${data.doctorName || 'Dr. Lavesh Bohra'} | BAMS (2026), SMIAS, Gujarat Ayurved University`,
    marginX,
    pageHeight - 75,
    8.5,
    false,
    0.88,
    0.9,
    0.88
  );

  y = pageHeight - 120;

  // --- Title & Document Metadata ---
  drawText('CLINICAL PRESCRIPTION (Rx)', marginX, y, 13, true, 0.122, 0.239, 0.169);
  drawText(
    `Ref: ${data.bookingRef}   |   Date: ${formatFriendlyDate(data.appointmentDate)}`,
    pageWidth - marginX - 205,
    y,
    9,
    false,
    0.35,
    0.4,
    0.36
  );

  y -= 14;

  // --- Patient Information Card ---
  drawRect(marginX, y - 48, contentWidth, 48, 0.965, 0.953, 0.918);
  drawText('PATIENT:', marginX + 12, y - 18, 8.5, true, 0.4, 0.45, 0.4);
  const ageGender = [
    data.patientAge ? `${data.patientAge} Yrs` : '',
    data.patientGender || '',
  ]
    .filter(Boolean)
    .join(' / ');
  drawText(
    `${data.patientName}${ageGender ? ` (${ageGender})` : ''}`,
    marginX + 64,
    y - 18,
    10.5,
    true,
    0.08,
    0.16,
    0.11
  );

  drawText('CONSULTATION SLOT:', marginX + 12, y - 35, 8.5, true, 0.4, 0.45, 0.4);
  drawText(
    `${formatFriendlyDate(data.appointmentDate)} - ${data.slotLabel}`,
    marginX + 118,
    y - 35,
    9.5,
    false,
    0.15,
    0.25,
    0.18
  );

  y -= 74;

  // --- Prescribed Medicines Header ---
  drawText('PRESCRIBED MEDICINES (IN ORDER)', marginX, y, 10.5, true, 0.122, 0.239, 0.169);
  y -= 10;
  drawLine(marginX, y, pageWidth - marginX, y, 0.122, 0.239, 0.169, 1.2);
  y -= 18;

  if (!data.medicines || data.medicines.length === 0) {
    drawText(
      'No specific medicines prescribed during this session. Follow general diet & lifestyle advice below.',
      marginX,
      y,
      10,
      false,
      0.4,
      0.4,
      0.4
    );
    y -= 24;
  } else {
    // Column headers
    drawRect(marginX, y - 6, contentWidth, 20, 0.93, 0.94, 0.92);
    drawText('#', marginX + 8, y, 9, true, 0.122, 0.239, 0.169);
    drawText('Medicine Name', marginX + 34, y, 9, true, 0.122, 0.239, 0.169);
    drawText('Dosage & Timing', marginX + 265, y, 9, true, 0.122, 0.239, 0.169);
    drawText('Duration', pageWidth - marginX - 68, y, 9, true, 0.122, 0.239, 0.169);
    y -= 22;

    data.medicines.forEach((med, idx) => {
      const orderNum = `${idx + 1}.`;
      const nameLines = wrapText(med.name, 36);
      const regimen = [med.dosage, med.timing].filter(Boolean).join(' - ') || 'As directed';
      const regimenLines = wrapText(regimen, 28);
      const durationStr = med.duration || '-';
      const rowLines = Math.max(nameLines.length, regimenLines.length);
      const rowHeight = rowLines * 14 + 10;

      ensureSpace(rowHeight + 8);

      drawText(orderNum, marginX + 8, y, 10, true, 0.122, 0.239, 0.169);
      nameLines.forEach((line, lIdx) => {
        drawText(line, marginX + 34, y - lIdx * 14, 10, true, 0.08, 0.16, 0.11);
      });
      regimenLines.forEach((line, lIdx) => {
        drawText(line, marginX + 265, y - lIdx * 14, 9.5, false, 0.2, 0.25, 0.22);
      });
      drawText(durationStr, pageWidth - marginX - 68, y, 9.5, false, 0.2, 0.25, 0.22);

      y -= rowHeight;
      drawLine(marginX, y + 4, pageWidth - marginX, y + 4, 0.88, 0.89, 0.87, 0.5);
      y -= 8;
    });
  }

  // --- Clinical Advice / Diet & Lifestyle Section ---
  if (data.clinicalAdvice && data.clinicalAdvice.trim().length > 0) {
    ensureSpace(80);
    y -= 10;
    drawText('CLINICAL ADVICE & PATHYA (DIET / LIFESTYLE)', marginX, y, 10.5, true, 0.122, 0.239, 0.169);
    y -= 8;
    drawLine(marginX, y, pageWidth - marginX, y, 0.122, 0.239, 0.169, 1);
    y -= 16;

    const paragraphs = data.clinicalAdvice.split(/\r?\n/);
    for (const para of paragraphs) {
      const wrapped = wrapText(para, 86);
      for (const line of wrapped) {
        ensureSpace(20);
        drawText(line, marginX, y, 9.5, false, 0.15, 0.2, 0.16);
        y -= 14;
      }
    }
  }

  // --- Signature & Footer Block ---
  ensureSpace(90);
  const sigY = Math.min(y - 24, 128);
  drawLine(marginX, sigY + 34, pageWidth - marginX, sigY + 34, 0.82, 0.85, 0.82, 0.8);

  drawText(data.doctorName || 'Dr. Lavesh Bohra', pageWidth - marginX - 160, sigY + 16, 10.5, true, 0.08, 0.16, 0.11);
  drawText(
    'BAMS (2026), SMIAS · Registered Ayurvedic Practitioner',
    pageWidth - marginX - 210,
    sigY + 3,
    8,
    false,
    0.4,
    0.45,
    0.4
  );

  drawText('VANKAL AYURVEDA · Phone: +91 9016432576 · Email: vankalayurveda@gmail.com', marginX, 42, 8, false, 0.45, 0.5, 0.45);
  drawText(
    'This digital prescription is generated from your authenticated Vankal Ayurveda video consultation.',
    marginX,
    30,
    7.5,
    false,
    0.55,
    0.58,
    0.55
  );

  pagesOps.push(ops);

  // --- Assemble PDF Objects ---
  // Object 1: Catalog
  // Object 2: Pages
  // Object 3: Font Helvetica
  // Object 4: Font Helvetica-Bold
  // Subsequent objects: Page + Content pairs
  const objects: string[] = [];
  const pageObjectIds: number[] = [];

  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  objects.push(''); // placeholder for object 2 (Pages)
  objects.push('3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');
  objects.push('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n');

  let nextId = 5;
  for (const pageOps of pagesOps) {
    const pageObjId = nextId++;
    const contentObjId = nextId++;
    pageObjectIds.push(pageObjId);

    const streamStr = pageOps.join('\n');
    objects.push(
      `${pageObjId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjId} 0 R >>\nendobj\n`
    );
    objects.push(
      `${contentObjId} 0 obj\n<< /Length ${streamStr.length} >>\nstream\n${streamStr}\nendstream\nendobj\n`
    );
  }

  objects[1] = `2 0 obj\n<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageObjectIds.length} >>\nendobj\n`;

  let pdfStr = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(pdfStr.length);
    pdfStr += obj;
  }

  const xrefStart = pdfStr.length;
  pdfStr += `xref\n0 ${objects.length + 1}\n`;
  pdfStr += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i++) {
    pdfStr += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdfStr += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdfStr], { type: 'application/pdf' });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Opens an embedded iframe print sheet (supports full Unicode / Gujarati / custom typography)
 * for users who prefer printing or when medicines contain non-Latin scripts.
 */
export function printPrescriptionSheet(data: PrescriptionDownloadInput): void {
  if (typeof document === 'undefined') return;

  const medRows =
    data.medicines.length > 0
      ? data.medicines
          .map(
            (m, i) => `
          <tr>
            <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-weight:700;">${i + 1}.</td>
            <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-weight:600;">${escapeHtml(m.name)}</td>
            <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;">${escapeHtml([m.dosage, m.timing].filter(Boolean).join(' · ') || 'As directed')}</td>
            <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;">${escapeHtml(m.duration || '—')}</td>
          </tr>`
          )
          .join('')
      : `<tr><td colspan="4" style="padding:14px;color:#64748b;">Follow dietary and lifestyle guidance below.</td></tr>`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Prescription - ${escapeHtml(data.bookingRef)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #14291c; margin: 0; padding: 32px; }
    .header { background: #14291c; color: #fbf9f4; padding: 20px 24px; border-bottom: 4px solid #d99a2b; border-radius: 4px; }
    .meta { background: #f7f5ef; padding: 14px 18px; border-radius: 4px; margin: 20px 0; display: flex; justify-content: space-between; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 12px; }
    th { background: #eef1ed; text-align: left; padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
    .advice { margin-top: 24px; padding: 14px 18px; background: #faf8f3; border-left: 3px solid #1f3d2b; font-size: 13px; white-space: pre-wrap; }
    .footer { margin-top: 48px; padding-top: 14px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin:0;font-size:20px;letter-spacing:0.06em;">VANKAL AYURVEDA</h1>
    <p style="margin:4px 0 0;font-size:12px;color:#d99a2b;">${escapeHtml(data.doctorName || 'Dr. Lavesh Bohra')} · BAMS (2026), SMIAS, Gujarat Ayurved University</p>
  </div>
  <div class="meta">
    <div>
      <div><strong>Patient:</strong> ${escapeHtml(data.patientName)} ${data.patientAge ? `(${escapeHtml(String(data.patientAge))} Yrs${data.patientGender ? `, ${escapeHtml(data.patientGender)}` : ''})` : ''}</div>
      <div style="margin-top:4px;"><strong>Consultation:</strong> ${escapeHtml(formatFriendlyDate(data.appointmentDate))} · ${escapeHtml(data.slotLabel)}</div>
    </div>
    <div style="text-align:right;">
      <div><strong>Prescription Ref:</strong> ${escapeHtml(data.bookingRef)}</div>
    </div>
  </div>
  <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:#1f3d2b;margin-bottom:6px;">Prescribed Medicines (Rx)</h2>
  <table>
    <thead>
      <tr>
        <th style="width:40px;">#</th>
        <th>Medicine</th>
        <th>Dosage &amp; Timing</th>
        <th style="width:90px;">Duration</th>
      </tr>
    </thead>
    <tbody>${medRows}</tbody>
  </table>
  ${
    data.clinicalAdvice?.trim()
      ? `<div class="advice"><strong>Clinical Advice &amp; Pathya:</strong><br/>${escapeHtml(data.clinicalAdvice.trim())}</div>`
      : ''
  }
  <div class="footer">
    <div>Vankal Ayurveda · +91 9016432576 · vankalayurveda@gmail.com</div>
    <div style="text-align:right;"><strong style="color:#14291c;">${escapeHtml(data.doctorName || 'Dr. Lavesh Bohra')}</strong><br/>Registered Ayurvedic Practitioner</div>
  </div>
</body>
</html>`;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        iframe.remove();
      }, 1500);
    }, 150);
  }
}

/**
 * Triggers a direct 1-click PDF download in the browser (falls back to Unicode print sheet
 * if medicines/advice contain non-Latin scripts like Gujarati/Devanagari).
 */
export function downloadPrescriptionPdf(data: PrescriptionDownloadInput): void {
  const combinedText = [
    data.patientName,
    data.clinicalAdvice || '',
    ...data.medicines.flatMap((m) => [m.name, m.dosage || '', m.timing || '', m.duration || '']),
  ].join(' ');

  if (containsExtendedUnicode(combinedText.replace(/[₹–—•·]/g, ''))) {
    printPrescriptionSheet(data);
    return;
  }

  const blob = buildPrescriptionPdfBlob(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Vankal-Ayurveda-Prescription-${data.bookingRef}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
