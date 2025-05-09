import React from "react";
import { Button, Box, Typography } from "@mui/material";
import jsPDF from "jspdf";
import { entityService } from "../../services";
import { useAlert } from "../../context";

export default function TestPdfEmail() {
  const { sendAlert } = useAlert();

  const handleSendTestEmail = async () => {
    try {
      // Mock contact details
      const contact = {
        name: "John Doe",
        email: "darryll@stillproud.com",
        companyName: "Test Company",
        position: "Developer",
      };

      // Generate PDF
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      doc.setFontSize(16);
      doc.text("Entity Reporting Flow Summary", 20, 20);
      doc.setFontSize(12);
      doc.text(`Name: ${contact.name}`, 20, 30);
      doc.text(`Email: ${contact.email}`, 20, 40);
      doc.text(`Company Name: ${contact.companyName}`, 20, 50);
      doc.text(`Position: ${contact.position}`, 20, 60);

      const pdfBlob = doc.output("blob");
      const pdfFile = new File([pdfBlob], "test-entity-report-summary.pdf", {
        type: "application/pdf",
      });

      // Prepare FormData
      const formData = new FormData();
      formData.append("to", contact.email);
      formData.append("name", contact.name);
      formData.append("from", "darryllrobinson@icloud.com");
      formData.append("subject", "Test: Entity Reporting Flow Summary");
      formData.append(
        "html",
        `<p>Hi ${contact.name},</p>
        <p>This is a test email for sending a PDF summary.</p>
        <p><strong>Company:</strong> ${contact.companyName}<br/><strong>Position:</strong> ${contact.position}</p>`
      );
      formData.append("attachment", pdfFile); // Ensure key matches multer configuration

      // Send email
      await entityService.sendPdfEmail(formData); // Do not manually set Content-Type
      sendAlert("success", "Test email sent successfully with PDF attached");
    } catch (error) {
      console.error("Failed to send test email with PDF", error);
      sendAlert("error", "Failed to send test email. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Test PDF Email Functionality
      </Typography>
      <Typography variant="body1" paragraph>
        Click the button below to send a test email with a PDF attachment.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleSendTestEmail}>
        Send Test Email
      </Button>
      <Box
        sx={{
          backgroundImage: `url(/images/backgrounds/Large_zebra_crossing.jpg)`, // Updated to encode spaces as %20
          // backgroundImage: `url(/images/backgrounds/Abstract%20dots.jpg)`, // Updated to encode spaces as %20
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      ></Box>
      <Box
        sx={{
          backgroundImage: `url(/images/backgrounds/Abstract%20dots.jpg)`, // Updated to encode spaces as %20
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      ></Box>
      <Box
        sx={{
          backgroundImage: `url(/images/backgrounds/Grayscale%20background.jpg)`, // Updated to encode spaces as %20
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      ></Box>
      <Box
        sx={{
          backgroundImage: `url(/images/backgrounds/monochromatic%20squares.jpg)`, // Updated to encode spaces as %20
          // backgroundImage: `url(/images/backgrounds/Abstract%20dots.jpg)`, // Updated to encode spaces as %20
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      ></Box>
      <Box
        sx={{
          backgroundImage: `url(/images/backgrounds/right_zebra_crossing.jpg)`, // Updated to encode spaces as %20
          // backgroundImage: `url(/images/backgrounds/Abstract%20dots.jpg)`, // Updated to encode spaces as %20
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      ></Box>
    </Box>
  );
}
