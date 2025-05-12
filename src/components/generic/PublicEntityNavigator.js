import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Radio,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  LinearProgress,
  TextField,
  useTheme,
  CircularProgress,
} from "@mui/material";
import jsPDF from "jspdf";
import { entityService, userService } from "../../services";
import { useAlert } from "../../context";

const steps = [
  "Entity Details",
  "Start at Highest-Level Entity",
  "Confirm Reporting Requirement",
  "Constitutionally Covered Entity",
  "Charity Status",
  "Connection to Australia",
  "Revenue Threshold",
  "Controlled by Reporting Entity",
  "Summary",
  "Contact Details", // Added Contact Details as the final step
];

const flowQuestions = [
  {
    key: "entityDetails",
    question: "Please enter the entity details",
    type: "form",
    fields: [
      { name: "entityName", label: "Entity Name", required: true },
      { name: "entityABN", label: "ABN (optional)", required: false },
    ],
    help: "These details will be used to track submissions and ensure audit compliance.",
  },
  {
    key: "startEntity",
    question: "Are you starting with the highest-level entity in the group?",
    options: ["Yes", "No"],
    help: "Begin with the parent/holding entity, then assess others if needed.",
  },
  {
    key: "section7",
    question:
      "Has this entity been assessed under Section 7 of the Payment Times Reporting Act 2020?",
    options: ["Yes", "No"],
    help: "Only entities meeting the criteria in Section 7 are required to report.",
  },
  {
    key: "cce",
    question: "Is the entity a Constitutionally Covered Entity (CCE)?",
    options: ["Yes", "No"],
    help: "CCE includes trading, financial, and foreign corporations.",
  },
  {
    key: "charity",
    question: "Is the entity a registered charity?",
    options: ["Yes", "No"],
    help: "Charities are excluded from PTRS reporting. See Section 6(1)(e) of the Payment Times Reporting Act 2020.",
  },
  {
    key: "connectionToAustralia",
    question: "Does the entity have a connection to Australia?",
    type: "checkbox",
    subOptions: [
      "Incorporated in Australia",
      "Carries on business in Australia",
      "Central management and control in Australia",
      "Majority voting power controlled by Australian shareholders",
      "All of the above",
      "None of the above",
    ],
    help: "Tick any that apply — only one is required. If none apply, select 'None of the above'.",
  },
  {
    key: "revenue",
    question:
      "Did the entity have consolidated revenue of more than A$100 million in the last financial year?",
    options: ["Yes", "No"],
    help: "Entities below this threshold are excluded.",
  },
  {
    key: "controlled",
    question:
      "Is the entity controlled by another entity that is a reporting entity?",
    options: ["Yes", "No"],
    help: "Controlled entities are included in the parent entity's report.",
  },
  {
    key: "contactDetails",
    question: "Please provide your contact details",
    type: "form",
    fields: [
      { name: "name", label: "Your Name", required: true },
      { name: "email", label: "Your Email", required: true },
      { name: "companyName", label: "Company Name", required: true },
      { name: "position", label: "Your Position", required: true },
    ],
    help: "We'll use these details to send you a summary and follow up if needed.",
  },
];

export default function PublicEntityNavigator() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false); // Track if the form has been submitted
  const [loading, setLoading] = useState(false); // Track loading state for Submit button
  const navigate = useNavigate();
  const { sendAlert } = useAlert();

  const current = flowQuestions[activeStep] || {}; // Safeguard to ensure current is always defined

  const handlePDF = async (recordId) => {
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
    ); // Wrap text within margins
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
        // Map full field names for Contact Details
        const contactDetails = answers.contactDetails || {};
        answer = Object.entries(contactDetails)
          .map(([key, value]) => {
            const field = q.fields.find((f) => f.name === key);
            return `${field?.label || key}: ${value || "—"}`;
          })
          .join(", ");
      } // Map field label for entityName and ABN
      else if (q.key === "entityDetails") {
        answer = Object.entries(answers.entityDetails || {})
          .map(([key, value]) => {
            const field = q.fields.find((f) => f.name === key);
            return `${field?.label || key}: ${value || "—"}`;
          })
          .join(", ");
      } else if (Array.isArray(answers[q.key])) {
        answer = answers[q.key].join(", ");
      } else if (
        typeof answers[q.key] === "object" &&
        answers[q.key] !== null
      ) {
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

    const pdfBlob = doc.output("blob"); // Return a Blob instead of a File
    return pdfBlob;
  };

  // Helper to load image
  async function loadImage(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  const confirmSubmission = async () => {
    setLoading(true); // Set loading to true when submission starts
    const contact = answers.contactDetails || {};
    if (
      activeStep === steps.length - 1 && // Ensure this check only happens on the contact details step
      (!contact.name ||
        !contact.email ||
        !contact.companyName ||
        !contact.position)
    ) {
      sendAlert(
        "error",
        "Please complete all contact details before submitting."
      );
      setLoading(false); // Reset loading state on error
      return;
    }

    try {
      // Structure the data for saving to the backend
      const dataToSave = {
        entityName: answers.entityDetails?.entityName || "",
        entityABN: answers.entityDetails?.entityABN || "",
        startEntity: answers.startEntity || "",
        section7: answers.section7 || "",
        cce: answers.cce || "",
        charity: answers.charity || "",
        connectionToAustralia: Array.isArray(answers.connectionToAustralia)
          ? answers.connectionToAustralia.join(", ") // Convert to string if it's an array
          : answers.connectionToAustralia || "", // Use as-is if already a string
        revenue: answers.revenue || "",
        controlled: answers.controlled || "",
        contactDetails: answers.contactDetails || {},
        completed: true,
        timestamp: new Date().toISOString(),
        createdBy: userService.userValue.id,
      };

      // Create the record in the backend
      const response = await entityService.create(dataToSave);
      const recordId = response.id;

      // Generate the PDF with the recordId
      const pdfBlob = await handlePDF(recordId);

      // Send the PDF via email
      await sendSummaryByEmail(pdfBlob, recordId);

      // Navigate to the solution page
      navigate("/ptr-solution");
    } catch (error) {
      console.error("Failed to complete submission", error);
      sendAlert("error", "Failed to complete submission. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  };

  const sendSummaryByEmail = async (pdfBlob, recordId) => {
    try {
      const contact = answers.contactDetails || {};
      const to = contact.email || "";
      const name = contact.name || "";
      const companyName = contact.companyName || "";
      const position = contact.position || "";

      const formData = new FormData();
      formData.append("to", to);
      formData.append("name", name);
      formData.append("from", "darryllrobinson@icloud.com");
      formData.append("subject", "Your Entity Navigator Summary");
      formData.append(
        "html",
        `<p>Hi ${name},</p>
        <p>Thank you for using the PTRS Navigator. Attached is your summary.</p>
        <p><strong>Company:</strong> ${companyName}<br/><strong>Position:</strong> ${position}</p>
        <p><strong>Reference:</strong> ${recordId}</p>`
      );
      formData.append("attachment", pdfBlob, "entity-report-summary.pdf"); // Append the Blob

      await entityService.sendPdfEmail(formData, true);
      sendAlert("success", "Your summary should be in your inbox shortly.");
    } catch (error) {
      console.error("Failed to email summary", error);
      sendAlert("error", "Failed to send email. Please try again.");
    }
  };

  const handleNext = async () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else if (activeStep === steps.length - 1) {
      await confirmSubmission(); // Submit on the final step
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const handleInputChange = (key) => (e) => {
    const { name, value } = e.target;

    // Prevent non-numeric input for the entityABN field
    if (
      key === "entityDetails" &&
      name === "entityABN" &&
      !/^[0-9]*$/.test(value)
    ) {
      return;
    }

    setAnswers({
      ...answers,
      [key]: { ...answers[key], [name]: value },
    });
  };

  const isStepValid = (stepIndex) => {
    const q = flowQuestions[stepIndex];
    if (!q) return true; // Skip validation for steps like "Summary" that have no corresponding question
    const val = answers[q.key];
    if (q.type === "form") {
      return q.fields.every(
        (field) =>
          !field.required ||
          (val && val[field.name] && val[field.name].trim() !== "")
      );
    }
    return val && (Array.isArray(val) ? val.length > 0 : true);
  };

  const isEntityDetailsValid = () => {
    const entityDetails = answers.entityDetails || {};
    const entityABN = entityDetails.entityABN || ""; // Safeguard to ensure entityABN is always a string
    return (
      entityDetails.entityName &&
      entityDetails.entityName.trim() !== "" && // Ensure Entity Name is mandatory
      /^[0-9]*$/.test(entityABN) && // Ensure ABN contains only numbers
      (entityABN === "" || entityABN.length === 11) // ABN must be empty or exactly 11 digits
    );
  };

  const handleStepClick = (step) => {
    if (
      step <= activeStep ||
      flowQuestions.slice(0, step).every((_, i) => isStepValid(i))
    ) {
      setActiveStep(step);
    }
  };

  const handleRadioChange = (key) => (e) =>
    setAnswers({ ...answers, [key]: e.target.value });

  const handleCheckboxChange = (key, value) => (e) => {
    const allOptions = [
      "Incorporated in Australia",
      "Carries on business in Australia",
      "Central management and control in Australia",
      "Majority voting power controlled by Australian shareholders",
      "All of the above",
      "None of the above",
    ];

    const individualOptions = allOptions.filter(
      (opt) => opt !== "All of the above" && opt !== "None of the above"
    );

    // Ensure `answers[key]` is treated as an array
    const prev = Array.isArray(answers[key]) ? answers[key] : [];

    let updated = [];

    if (value === "None of the above") {
      updated = e.target.checked
        ? ["None of the above"]
        : prev.filter((v) => v !== "None of the above");
    } else if (value === "All of the above") {
      updated = e.target.checked
        ? [...individualOptions, "All of the above"]
        : prev.filter(
            (v) => !individualOptions.includes(v) && v !== "All of the above"
          );
    } else {
      if (e.target.checked) {
        updated = [...prev.filter((v) => v !== "None of the above"), value];
        const allSelected = individualOptions.every((opt) =>
          updated.includes(opt)
        );
        if (allSelected) updated.push("All of the above");
      } else {
        updated = prev.filter((v) => v !== value && v !== "All of the above");
      }
    }

    // Update the state with the new checkbox values
    setAnswers({ ...answers, [key]: updated });
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeStep < steps.length - 1) {
        handleNext();
      } else if (activeStep === steps.length - 1) {
        confirmSubmission();
      }
    }
  };

  const completion =
    activeStep === 0 ? 0 : Math.round((activeStep / steps.length) * 100);

  return (
    <Box sx={{ p: 4 }} onKeyUp={handleKeyUp}>
      <Typography variant="h5" gutterBottom>
        PTRS Eligibility Navigator
      </Typography>

      <Box sx={{ mb: 2 }}>
        <LinearProgress variant="determinate" value={completion} />
        <Typography variant="caption">{completion}% complete</Typography>
      </Box>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label, index) => {
          const isEnabled =
            index <= activeStep ||
            flowQuestions.slice(0, index).every((_, i) => isStepValid(i));
          const tooltip = isEnabled
            ? "Click to jump to this step"
            : "Please complete prior steps before accessing this one.";
          const stepLabel = label.replace(/Entity Checker/g, "PTRS Navigator");
          return (
            <Step key={index}>
              <Tooltip title={tooltip} arrow>
                <StepLabel
                  onClick={() => isEnabled && handleStepClick(index)}
                  style={{
                    cursor: isEnabled ? "pointer" : "not-allowed",
                    opacity:
                      isStepValid(index) || index <= activeStep ? 1 : 0.4,
                  }}
                >
                  {stepLabel}
                </StepLabel>
              </Tooltip>
            </Step>
          );
        })}
      </Stepper>

      <Card
        sx={{
          maxWidth: 700,
          margin: "0 auto",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <CardContent>
          {activeStep === steps.length - 2 ? ( // Show Summary of Responses on the second-to-last step
            <>
              <Typography variant="h6" gutterBottom>
                Summary of Responses
              </Typography>
              <Box sx={{ mb: 2 }}>
                {flowQuestions
                  .filter((q) => q.key !== "contactDetails")
                  .map((q) => (
                    <Box key={q.key} sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">{q.question}</Typography>
                      <Box
                        sx={{
                          color: "text.secondary",
                          fontSize: "body2.fontSize",
                        }}
                      >
                        {Array.isArray(answers[q.key]) ? (
                          answers[q.key].join(", ")
                        ) : typeof answers[q.key] === "object" &&
                          answers[q.key] !== null ? (
                          <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                            {Object.entries(answers[q.key]).map(([k, v]) => (
                              <li key={k}>
                                <strong>{k}:</strong> {v || "—"}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          answers[q.key] || "No answer"
                        )}
                      </Box>
                    </Box>
                  ))}
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              </Box>
            </>
          ) : activeStep === steps.length - 1 ? ( // Show Contact Details on the final step
            <>
              <Typography variant="h6" gutterBottom>
                {current.question || "Contact Details"}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {current.help || "Please provide your contact details."}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  mb: 2,
                }}
              >
                {flowQuestions
                  .find((q) => q.key === "contactDetails")
                  ?.fields.map((field) => (
                    <TextField
                      key={field.name}
                      name={field.name}
                      label={field.label}
                      value={answers.contactDetails?.[field.name] || ""}
                      onChange={(e) =>
                        setAnswers({
                          ...answers,
                          contactDetails: {
                            ...answers.contactDetails,
                            [field.name]: e.target.value,
                          },
                        })
                      }
                      required={field.required}
                      error={
                        formSubmitted &&
                        field.required &&
                        (!answers.contactDetails?.[field.name] ||
                          answers.contactDetails[field.name].trim() === "" ||
                          (field.name === "email" &&
                            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                              answers.contactDetails[field.name]
                            )))
                      }
                      helperText={
                        formSubmitted &&
                        field.required &&
                        (!answers.contactDetails?.[field.name] ||
                          answers.contactDetails[field.name].trim() === "")
                          ? "Required"
                          : field.name === "email" &&
                              answers.contactDetails?.[field.name] &&
                              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                answers.contactDetails[field.name]
                              )
                            ? "Invalid email address"
                            : ""
                      }
                    />
                  ))}
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0 || loading} // Disable Back button while loading
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    loading || // Disable Submit button while loading
                    !answers.contactDetails ||
                    flowQuestions
                      .find((q) => q.key === "contactDetails")
                      ?.fields.some((field) => {
                        const value = answers.contactDetails?.[field.name];
                        if (!value || value.trim() === "") return true; // Ensure all fields are filled
                        if (
                          field.name === "email" &&
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                        )
                          return true; // Validate email format
                        return false;
                      })
                  }
                  startIcon={loading ? <CircularProgress size={20} /> : null} // Show spinner when loading
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                {current.question}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {current.help}
              </Typography>
              {current.type === "form" ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  {current.fields.map((field) => (
                    <TextField
                      key={field.name}
                      name={field.name}
                      label={field.label}
                      value={answers[current.key]?.[field.name] || ""}
                      onChange={handleInputChange(current.key)}
                      required={field.required}
                      error={
                        formSubmitted &&
                        field.required &&
                        !!answers[current.key] &&
                        (!answers[current.key][field.name] ||
                          answers[current.key][field.name].trim() === "")
                      }
                      helperText={
                        formSubmitted &&
                        field.required &&
                        !!answers[current.key] &&
                        (!answers[current.key][field.name] ||
                          answers[current.key][field.name].trim() === "")
                          ? "Required"
                          : field.name === "entityABN" &&
                              answers[current.key]?.[field.name]?.length > 0 &&
                              answers[current.key]?.[field.name]?.length !== 11
                            ? "ABN must be exactly 11 digits"
                            : ""
                      }
                    />
                  ))}
                </Box>
              ) : current.type === "checkbox" ? (
                <FormGroup>
                  {current.subOptions.map((option, index) => {
                    if (option === "None of the above") {
                      return (
                        <React.Fragment key={option}>
                          <Box
                            sx={{
                              borderBottom: "1px solid #ccc",
                              my: 1,
                              mx: 0,
                              width: "100%",
                            }}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={(answers[current.key] || []).includes(
                                  option
                                )}
                                onChange={handleCheckboxChange(
                                  current.key,
                                  option
                                )}
                              />
                            }
                            label={option}
                          />
                        </React.Fragment>
                      );
                    }

                    return (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            checked={(answers[current.key] || []).includes(
                              option
                            )}
                            onChange={handleCheckboxChange(current.key, option)}
                          />
                        }
                        label={option}
                      />
                    );
                  })}
                </FormGroup>
              ) : (
                <RadioGroup
                  value={answers[current.key] || ""}
                  onChange={handleRadioChange(current.key)}
                >
                  {current.options.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              )}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    (activeStep === 0 && !isEntityDetailsValid()) || // Ensure both Entity Name and ABN validation
                    (current.type === "checkbox"
                      ? !(answers[current.key]?.length > 0)
                      : !answers[current.key])
                  }
                >
                  Next
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
