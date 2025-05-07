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
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";
import jsPDF from "jspdf";

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

export default function EntityFlowChart() {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [stopped, setStopped] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const current = flowQuestions[activeStep];

  const shouldStopFlow = (key, value) => {
    if (key === "section7" && value === "No") {
      return "The entity does not meet the Section 7 criteria of the Payment Times Reporting Act 2020 and is therefore not required to report.";
    }
    if (key === "cce" && value === "No") {
      return "The entity is not a Constitutionally Covered Entity and is not required to report under the Act.";
    }
    if (key === "charity" && value === "Yes") {
      return "The entity is a registered charity and is excluded from reporting. See Section 6(1)(e) of the Payment Times Reporting Act 2020.";
    }
    if (
      key === "connectionToAustralia" &&
      (value?.includes("None of the above") || !value || value.length === 0)
    ) {
      return "The entity does not have a connection to Australia and is not required to report. Payments by this entity must be excluded from any reporting.";
    }
    if (key === "revenue" && value === "No") {
      return "The entity does not meet the A$100 million consolidated revenue threshold and is not required to report.";
    }
    if (key === "controlled" && value === "Yes") {
      return "This entity is controlled by another reporting entity and does not need to report separately.";
    }
    return null;
  };

  const saveToBackend = async (data, completed = false) => {
    try {
      await fetch("/api/reporting-flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          completed,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to save answers", error);
    }
  };

  const sendSummaryByEmail = async () => {
    try {
      await fetch("/api/email-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
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
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Entity Reporting Flow Summary", 10, 10);
    let y = 20;
    for (const q of flowQuestions) {
      const label =
        q.key === "entityDetails" ? "Entity details provided" : q.question;
      doc.text(label, 10, y);
      y += 6;
      const val = Array.isArray(answers[q.key])
        ? answers[q.key].join(", ")
        : typeof answers[q.key] === "object" && answers[q.key] !== null
          ? Object.entries(answers[q.key])
              .map(([k, v]) => `• ${k}: ${v || "—"}`)
              .join("\\n")
          : answers[q.key] || "No answer";
      if (typeof val === "string" && val.includes("\\n")) {
        const lines = val.split("\\n");
        for (const line of lines) {
          doc.text(line, 10, y);
          y += 6;
        }
        y += 4; // Add extra line break after multi-line answer
      } else {
        doc.text(`Answer: ${val}`, 10, y);
        y += 10;
      }
    }
    doc.save("entity-report-summary.pdf");
  };

  const handleNext = async () => {
    if (activeStep < steps.length - 2) {
      const reason = shouldStopFlow(current.key, answers[current.key]);
      if (reason) {
        setStopped(reason);
        await saveToBackend({ ...answers, stopped: reason });
        return;
      }
      setActiveStep((prev) => prev + 1);
    } else if (activeStep === steps.length - 2) {
      setActiveStep((prev) => prev + 1);
    } else {
      setConfirmOpen(true);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const confirmSubmission = async () => {
    await saveToBackend({ ...answers }, true);
    await sendSummaryByEmail();
    navigate("/report/create");
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
    let updated = [];
    const prev = answers[key] || [];

    if (value === "None of the above") {
      updated = e.target.checked ? ["None of the above"] : [];
    } else {
      updated = e.target.checked
        ? [...prev.filter((v) => v !== "None of the above"), value]
        : prev.filter((v) => v !== value);
    }

    setAnswers({ ...answers, [key]: updated });
  };

  const completion = Math.round(((activeStep + 1) / steps.length) * 100);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Entity Reporting Eligibility Flow
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
                  {label}
                </StepLabel>
              </Tooltip>
            </Step>
          );
        })}
      </Stepper>

      <Card sx={{ maxWidth: 700, margin: "auto" }}>
        <CardContent>
          {stopped ? (
            <Alert severity="info">
              <Typography variant="subtitle1">Flow Complete</Typography>
              <Typography variant="body2">{stopped}</Typography>
            </Alert>
          ) : activeStep === steps.length - 1 ? (
            <>
              <Typography variant="h6" gutterBottom>
                Summary of Responses
              </Typography>
              <Box sx={{ mb: 2 }}>
                {flowQuestions.map((q) => (
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
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Button variant="outlined" onClick={handleDownload}>
                  Download JSON
                </Button>
                <Button variant="outlined" onClick={handlePDF}>
                  Download PDF
                </Button>
              </Box>
              <Button variant="contained" color="primary" onClick={handleNext}>
                Submit and Create Report
              </Button>
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
                  {current.subOptions.map((option) => (
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
                  ))}
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
                  {activeStep === steps.length - 2 ? "Review Summary" : "Next"}
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Submission?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmSubmission}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
