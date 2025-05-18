import { jsPDF } from "jspdf";

// Utility to load an image as base64
export async function loadImage(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// Main PDF generator
export async function handlePdf(recordId, answers, flowQuestions) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const marginLeft = 20;
  const marginTop = 20;
  const lineHeight = 7;
  let y = marginTop;

  const date = new Date().toLocaleString();
  const companyName = "Monochrome Compliance";
  const subtitle =
    "Entity Navigator Summary — Payment Times Reporting Scheme (PTRS)";
  const logoPath = "/images/logos/logo-light.png";

  const determineReportingRequirement = (answers) => {
    if (answers.charity === "Yes") {
      return {
        required: false,
        reason:
          "The entity is a registered charity and is excluded under Section 6(1)(e) of the Payment Times Reporting Act 2020.",
      };
    }
    if (answers.section7 !== "Yes") {
      return {
        required: false,
        reason:
          "The entity has not been assessed under Section 7 of the Payment Times Reporting Act 2020.",
      };
    }
    if (
      !answers.connectionToAustralia ||
      answers.connectionToAustralia.includes("None of the above")
    ) {
      return {
        required: false,
        reason:
          "The entity does not appear to have a sufficient connection to Australia.",
      };
    }
    if (answers.controlled === "Yes") {
      return {
        required: false,
        reason:
          "The entity is controlled by another reporting entity and should be included in their report.",
      };
    }
    if (answers.cce === "Yes" && answers.revenue === "Yes") {
      return {
        required: true,
        reason:
          "The entity is a CCE with revenue over A$100M. PTRS reporting is required.",
      };
    }
    return {
      required: false,
      reason: "Based on your responses, PTRS reporting is not required.",
    };
  };

  const result = determineReportingRequirement(answers);

  // Background
  doc.setFillColor("#eceff1");
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Header: logo + title
  try {
    const logo = await loadImage(logoPath);
    doc.addImage(logo, "PNG", marginLeft, y, 25, 25);
  } catch (e) {
    doc.setFontSize(14);
    doc.setTextColor("#4d4d4d");
    doc.text("[Logo]", marginLeft, y + 10);
  }

  doc.setFontSize(18);
  doc.setTextColor("#141414");
  doc.text(companyName, marginLeft + 30, y + 8);
  doc.setFontSize(12);
  doc.text(subtitle, marginLeft + 30, y + 16);
  y += 30;

  // Intro context
  doc.setFontSize(10);
  doc.setTextColor("#4d4d4d");
  const introText =
    "This document provides a summary of the answers submitted through the Entity Navigator tool on our website. It is intended to assist you in determining your organisation’s obligations under the Payment Times Reporting Scheme (PTRS).";
  const wrappedIntro = doc.splitTextToSize(
    introText,
    pageWidth - marginLeft * 2
  );
  doc.text(wrappedIntro, marginLeft, y);
  y += wrappedIntro.length * lineHeight + 5;

  // Report reference and navigator outcome with reason
  doc.text(`Reference: ${recordId}`, marginLeft, y);
  y += 6;
  doc.text(
    `PTR Submission Required: ${result.required ? "Yes" : "No"}`,
    marginLeft,
    y
  );
  y += 6;
  doc.setTextColor("#4d4d4d");
  const wrappedReason = doc.splitTextToSize(
    result.reason,
    pageWidth - marginLeft * 2
  );
  doc.text(wrappedReason, marginLeft, y);
  doc.setTextColor(0, 0, 0);
  y += wrappedReason.length * lineHeight + 5;

  // Section: Summary Table
  doc.setFontSize(11);
  doc.setTextColor("#141414");
  doc.text("Summary of Responses", marginLeft, y);
  y += 6;

  doc.setDrawColor("#141414");
  doc.line(marginLeft, y, pageWidth - marginLeft, y);
  y += 4;

  doc.setFontSize(10);
  for (const q of flowQuestions) {
    const question =
      q.key === "entityDetails" ? "Entity details provided" : q.question;
    let answer = "No answer";

    if (q.key === "contactDetails") {
      const contactDetails = answers.contactDetails || {};
      answer = Object.entries(contactDetails)
        .map(([key, value]) => {
          const field = q.fields?.find((f) => f.name === key);
          return `${field?.label || key}: ${value || "—"}`;
        })
        .join(", ");
    } else if (q.key === "entityDetails") {
      answer = Object.entries(answers.entityDetails || {})
        .map(([key, value]) => {
          const field = q.fields?.find((f) => f.name === key);
          return `${field?.label || key}: ${value || "—"}`;
        })
        .join(", ");
    } else if (Array.isArray(answers[q.key])) {
      answer = answers[q.key].join(", ");
    } else if (typeof answers[q.key] === "object" && answers[q.key] !== null) {
      answer = Object.entries(answers[q.key])
        .map(([k, v]) => `${k}: ${v || "—"}`)
        .join(", ");
    } else {
      answer = answers[q.key] || "No answer";
    }

    if (y + lineHeight > pageHeight - marginTop) {
      doc.addPage();
      doc.setFillColor("#eceff1");
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      y = marginTop;
    }

    doc.setTextColor("#4d4d4d");
    doc.text(`• ${question}`, marginLeft, y);
    y += lineHeight;
    doc.setTextColor("#141414");
    const wrappedAnswer = doc.splitTextToSize(
      answer,
      pageWidth - marginLeft * 2
    );
    doc.text(wrappedAnswer, marginLeft + 4, y);
    y += wrappedAnswer.length * lineHeight + 2;

    doc.setDrawColor(200);
    doc.line(marginLeft, y, pageWidth - marginLeft, y);
    y += 5;
  }

  // CTA
  const ctaText =
    "For a full assessment and to receive tailored reporting guidance, please contact our team at ptrs@monochrome-compliance.com.";
  const wrappedCTA = doc.splitTextToSize(ctaText, pageWidth - marginLeft * 2);
  doc.setFontSize(10);
  doc.setTextColor("#4d4d4d");
  doc.text(wrappedCTA, marginLeft, y);
  y += wrappedCTA.length * lineHeight + 3;

  // Disclaimer
  const disclaimer =
    "This report is informational only and does not constitute legal advice. Final determination of reporting obligations should be made in consultation with your legal or compliance team.";
  const wrappedDisclaimer = doc.splitTextToSize(
    disclaimer,
    pageWidth - marginLeft * 2
  );
  doc.setFontSize(8);
  doc.setTextColor("#4d4d4d");
  doc.text(wrappedDisclaimer, marginLeft, y);

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor("#4d4d4d");
    doc.text(date, marginLeft, pageHeight - 10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - marginLeft - 30,
      pageHeight - 10
    );
  }

  const pdfBlob = doc.output("blob");
  return pdfBlob;
}
