import { publicService } from "../services/public.services";

export async function sendSummaryByEmail({
  pdfBlob,
  recordId,
  contactData,
  answers,
  setAlert,
  from = "darryllrobinson@icloud.com",
  subject = "Your Entity Navigator Summary",
  fileName = "entity-report-summary.pdf",
  html,
  message,
}) {
  try {
    const contact = contactData || answers?.contactDetails || {};
    const to = contact.email || "";
    const name = contact.name || "";
    const companyName = contact.companyName || "";
    const position = contact.position || "";

    const formData = new FormData();
    formData.append("to", to);
    formData.append("name", name);
    formData.append("from", from);
    formData.append("subject", subject);

    // Prefer explicit html/message if provided, else fallback to default html
    if (html) {
      formData.append("html", html);
    } else if (message) {
      formData.append("message", message);
    } else {
      formData.append(
        "html",
        `<p>Hi ${name},</p>
        <p>Thank you for using the PTRS Navigator. Attached is your summary.</p>
        <p><strong>Company:</strong> ${companyName}<br/><strong>Position:</strong> ${position}</p>
        <p><strong>Reference:</strong> ${recordId}</p>`
      );
    }

    if (pdfBlob instanceof Blob) {
      const file = new File([pdfBlob], fileName, { type: "application/pdf" });
      formData.append("attachment", file);
    } else {
      console.error("Invalid or missing pdfBlob:", pdfBlob);
      if (setAlert) {
        setAlert({
          type: "error",
          message: "PDF generation failed. Please try again.",
        });
      }
      return;
    }

    await publicService.sendAttachmentEmail(formData, true);
    if (setAlert) {
      setAlert({
        type: "success",
        message: "Your summary should be in your inbox shortly.",
      });
    }
  } catch (error) {
    console.error("Failed to email summary", error);
    if (setAlert) {
      setAlert({
        type: "error",
        message: "Failed to send email. Please try again.",
      });
    }
  }
}
