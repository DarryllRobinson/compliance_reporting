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
  Alert,
  Tooltip,
  LinearProgress,
  TextField,
  useTheme,
} from "@mui/material";
import jsPDF from "jspdf";
import { entityService } from "../../services";
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
];

// Add Contact Details step after Summary
flowQuestions.push({
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
});

export default function PublicEntityFlowChart() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [stopped, setStopped] = useState(null);
  const navigate = useNavigate();
  const { sendAlert } = useAlert();

  const current = flowQuestions[activeStep];

  const shouldStopFlow = (key, value) => {
    // Instead of stopping, just log the reason and allow flow to continue
    let reason = null;
    if (key === "section7" && value === "No") {
      reason =
        "The entity does not meet the Section 7 criteria of the Payment Times Reporting Act 2020 and is therefore not required to report.";
    }
    if (key === "cce" && value === "No") {
      reason =
        "The entity is not a Constitutionally Covered Entity and is not required to report under the Act.";
    }
    if (key === "charity" && value === "Yes") {
      reason =
        "The entity is a registered charity and is excluded from reporting. See Section 6(1)(e) of the Payment Times Reporting Act 2020.";
    }
    if (
      key === "connectionToAustralia" &&
      (value?.includes("None of the above") || !value || value.length === 0)
    ) {
      reason =
        "The entity does not have a connection to Australia and is not required to report. Payments by this entity must be excluded from any reporting.";
    }
    if (key === "revenue" && value === "No") {
      reason =
        "The entity does not meet the A$100 million consolidated revenue threshold and is not required to report.";
    }
    if (key === "controlled" && value === "Yes") {
      reason =
        "This entity is controlled by another reporting entity and does not need to report separately.";
    }
    if (reason) {
      // Log reason for audit, but do NOT stop flow
      console.log(`Flow note: ${reason}`);
    }
    return reason;
  };

  const saveToBackend = async (data, completed = false) => {
    try {
      await entityService.create({
        ...data,
        completed,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to save answers", error);
    }
  };

  const sendSummaryByEmail = async (pdfFile) => {
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
        <p><strong>Company:</strong> ${companyName}<br/><strong>Position:</strong> ${position}</p>`
      );
      formData.append("attachment", pdfFile, "entity-report-summary.pdf");

      await entityService.sendPdfEmail(formData, true); // Pass 'true' to indicate FormData
      sendAlert("success", "Your summary should be in your inbox shortly.");
    } catch (error) {
      console.error("Failed to email summary", error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(answers, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "entity-report-summary.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const marginLeft = 20;
    const marginTop = 20;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    let y = marginTop;

    const logoPlaceholder = "(LOGO)";
    const companyName = "Your Company Name Here";
    const date = new Date().toLocaleString();

    doc.setFontSize(16);
    doc.text(companyName, marginLeft, y);
    doc.setFontSize(10);
    doc.text(date, marginLeft, y + 6);

    doc.setFontSize(12);
    doc.text(logoPlaceholder, 160, y); // Placeholder for logo

    y += 20;

    doc.setFontSize(14);
    doc.text("Entity Reporting Flow Summary", marginLeft, y);
    y += 10;

    doc.setFontSize(11);

    for (const q of flowQuestions) {
      const label =
        q.key === "entityDetails" ? "Entity details provided" : q.question;

      const val = Array.isArray(answers[q.key])
        ? answers[q.key].join(", ")
        : typeof answers[q.key] === "object" && answers[q.key] !== null
          ? Object.entries(answers[q.key])
              .map(([k, v]) => `• ${k}: ${v || "—"}`)
              .join("\n")
          : answers[q.key] || "No answer";

      const sectionLines = [`${label}`];

      if (typeof val === "string" && val.includes("\n")) {
        sectionLines.push(...val.split("\n").map((line) => `  ${line}`));
      } else {
        sectionLines.push(`  Answer: ${val}`);
      }

      for (const line of sectionLines) {
        if (y + lineHeight > pageHeight - marginTop) {
          doc.addPage();
          y = marginTop;
        }
        doc.text(line, marginLeft, y);
        y += lineHeight;
      }

      // Add visual separator
      y += 2;
      doc.setDrawColor(200);
      doc.line(marginLeft, y, 190, y);
      y += 5;
    }

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(`Page ${i} of ${pageCount}`, marginLeft, pageHeight - 10);
    }

    // doc.save("entity-report-summary.pdf");
    const pdfBlob = doc.output("blob");
    const pdfFile = new File([pdfBlob], "entity-report-summary.pdf", {
      type: "application/pdf",
    });
    return pdfFile;
  };

  const handleNext = async () => {
    // Always log the reason but allow flow to continue
    const reason = shouldStopFlow(current.key, answers[current.key]);
    // Save answer and reason (if any) for audit, but do not stop
    await saveToBackend({
      ...answers,
      ...(reason ? { flowNote: reason } : {}),
    });
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      await confirmSubmission(); // Automatically send email on the last step
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const confirmSubmission = async () => {
    // Validate contact details before submission
    const contact = answers.contactDetails || {};
    if (
      !contact.name ||
      !contact.email ||
      !contact.companyName ||
      !contact.position
    ) {
      sendAlert(
        "error",
        "Please complete all contact details before submitting."
      );
      return;
    }

    try {
      // console.log("Preparing to save answers and send email...");
      // console.log("Contact details:", contact);

      // Save answers to the backend
      console.log("Saving answers to backend:", answers);
      await saveToBackend({ ...answers }, true);

      // Generate PDF
      const pdfFile = handlePDF();

      // console.log("PDF generated successfully.");

      // Send email with PDF
      sendSummaryByEmail(pdfFile);

      // Navigate to /ptr-solution after successful email
      navigate("/ptr-solution");
    } catch (error) {
      console.error("Failed to send email with PDF", error);
      sendAlert("error", "Failed to send email. Please try again.");
    }
  };

  const handleInputChange = (key) => (e) => {
    setAnswers({
      ...answers,
      [key]: { ...answers[key], [e.target.name]: e.target.value },
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

  const handleStepClick = (step) => {
    if (
      step <= activeStep ||
      flowQuestions.slice(0, step).every((_, i) => isStepValid(i))
    ) {
      setActiveStep(step);
      setStopped(null);
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

    let updated = [];
    const prev = answers[key] || [];

    if (value === "None of the above") {
      updated = e.target.checked ? ["None of the above"] : [];
    } else if (value === "All of the above") {
      updated = e.target.checked
        ? [...individualOptions, "All of the above"]
        : [];
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

    setAnswers({ ...answers, [key]: updated });
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission behavior
      if (activeStep < steps.length - 1) {
        handleNext();
      } else if (activeStep === steps.length - 1) {
        confirmSubmission(); // Trigger submission on the last step
      }
    }
  };

  const completion =
    activeStep === 0 ? 0 : Math.round((activeStep / steps.length) * 100);

  return (
    <Box sx={{ p: 4 }} onKeyUp={handleKeyUp}>
      <Typography variant="h5" gutterBottom>
        PTRS Navigator Eligibility Flow
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
          // Replace "Entity Checker" with "PTRS Navigator" in step labels if any
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
          margin: "0 auto", // Center the card horizontally
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <CardContent>
          {stopped ? (
            <Alert severity="info">
              <Typography variant="subtitle1">Flow Complete</Typography>
              <Typography variant="body2">{stopped}</Typography>
            </Alert>
          ) : activeStep === steps.length - 2 ? (
            // Summary step
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
          ) : activeStep === steps.length - 1 ? (
            // Contact Details step
            <>
              <Typography variant="h6" gutterBottom>
                {current.question}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {current.help}
              </Typography>
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
                      field.required &&
                      !!answers[current.key] &&
                      (!answers[current.key][field.name] ||
                        answers[current.key][field.name].trim() === "")
                    }
                    helperText={
                      field.required &&
                      !!answers[current.key] &&
                      (!answers[current.key][field.name] ||
                        answers[current.key][field.name].trim() === "")
                        ? "Required"
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
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={
                    activeStep === steps.length - 1
                      ? confirmSubmission
                      : handleNext
                  }
                  disabled={
                    activeStep === steps.length - 1 &&
                    (!answers.contactDetails ||
                      !answers.contactDetails.name ||
                      !answers.contactDetails.email ||
                      !answers.contactDetails.companyName ||
                      !answers.contactDetails.position ||
                      Object.values(answers.contactDetails).some(
                        (v) => !v || v.trim() === ""
                      ))
                  }
                >
                  {activeStep === steps.length - 1 ? "Submit" : "Next"}
                </Button>
              </Box>
            </>
          ) : (
            // All other steps
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
                    current.type === "checkbox"
                      ? !(answers[current.key]?.length > 0)
                      : !answers[current.key]
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
