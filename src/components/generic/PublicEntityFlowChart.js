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
import { entityService, userService } from "../../services";
import { useAlert } from "../../context";
import { create } from "@mui/material/styles/createTransitions";

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
  const navigate = useNavigate();
  const { sendAlert } = useAlert();

  const current = flowQuestions[activeStep];

  const handlePDF = (recordId) => {
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
    doc.text(`Record ID: ${recordId}`, marginLeft, y + 12); // Include recordId in the PDF

    y += 30;

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

    const pdfBlob = doc.output("blob");
    const pdfFile = new File([pdfBlob], "entity-report-summary.pdf", {
      type: "application/pdf",
    });
    return pdfFile;
  };

  const confirmSubmission = async () => {
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
      const pdfFile = handlePDF(recordId);

      // Send the PDF via email
      await sendSummaryByEmail(pdfFile, recordId);

      // Navigate to the solution page
      navigate("/ptr-solution");
    } catch (error) {
      console.error("Failed to complete submission", error);
      sendAlert("error", "Failed to complete submission. Please try again.");
    }
  };

  const sendSummaryByEmail = async (pdfFile, recordId) => {
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
        <p><strong>Record ID:</strong> ${recordId}</p>`
      );
      formData.append("attachment", pdfFile, "entity-report-summary.pdf");

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
    } else {
      await confirmSubmission();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
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

    // Convert the array to a comma-separated string
    const connectionToAustraliaString = updated.join(", ");
    setAnswers({ ...answers, [key]: updated }); // Keep `updated` as an array for internal state
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
          {activeStep === steps.length - 2 ? (
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
