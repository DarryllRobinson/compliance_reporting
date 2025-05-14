import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Tooltip,
} from "@mui/material";

// Step components (to be built/refactored)
import Step1View from "./steps/Step1View";
import Step2View from "./steps/Step2View";
import Step3View from "./steps/Step3View";
import Step4View from "./steps/Step4View";
import Step5View from "./steps/Step5View";
import Step6View from "./steps/Step6View";

// Example data loader (replace with actual context or API call if needed)
import { tcpService } from "../../../services";
import { ptrsGuidance } from "../../../data/ptrsGuidance";
import { glossary } from "../../../data/glossary";

const steps = [
  { label: "Step 1: Review & Clean Records", Component: Step1View },
  { label: "Step 2: Finalise TCP Dataset", Component: Step2View },
  { label: "Step 3: Export ABNs for SBI", Component: Step3View },
  { label: "Step 4: Upload SBI Results", Component: Step4View },
  { label: "Step 5: Small Business Review", Component: Step5View },
  { label: "Step 6: Summary & Submission", Component: Step6View },
];

function enhanceWithGlossary(text) {
  if (!text) return "";
  const terms = glossary.map((entry) => entry.term);
  const parts = text.split(/(\s+)/).map((word, index) => {
    const cleaned = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
    const match = glossary.find(
      (entry) => entry.term.toLowerCase() === cleaned
    );
    return match ? (
      <Tooltip key={index} title={match.definition}>
        <span style={{ textDecoration: "underline dotted", cursor: "help" }}>
          {word}
        </span>
      </Tooltip>
    ) : (
      word
    );
  });
  return <>{parts}</>;
}

export default function ReportWizard() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState({});
  const [reportStatus, setReportStatus] = useState("");

  const { Component } = steps[currentStep];

  useEffect(() => {
    // Initial load logic (e.g. fetch report data)
    async function loadData() {
      try {
        const records = await tcpService.getAllByReportId(reportId);
        setStepData((prev) => ({ ...prev, step1: records }));
        if (records.length > 0 && records[0].reportStatus) {
          setReportStatus(records[0].reportStatus);
        }
      } catch (error) {
        console.error("Error loading report data:", error);
      }
    }
    loadData();
  }, [reportId]);

  const goToNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goToBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  function renderGuidance() {
    const guidance = ptrsGuidance[currentStep];
    if (!guidance) return null;

    return (
      <Box
        sx={{
          mb: 4,
          p: 2,
          backgroundColor: "background.default",
          borderLeft: "4px solid #90caf9",
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          <strong>{guidance.name}</strong>
        </Typography>
        <Typography variant="body2" gutterBottom>
          {enhanceWithGlossary(guidance.description)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <strong>Requirement:</strong>{" "}
          {enhanceWithGlossary(guidance.requirement)}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: "250px",
          borderRight: "1px solid #ddd",
          padding: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h6" gutterBottom>
          PTRS Steps
        </Typography>
        <Stepper activeStep={currentStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel
                onClick={() => {
                  if (index <= currentStep) setCurrentStep(index);
                }}
                sx={{ cursor: index <= currentStep ? "pointer" : "default" }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, padding: 4 }}>
        {reportStatus && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Report Status:{" "}
              <strong style={{ textTransform: "uppercase" }}>
                {reportStatus}
              </strong>
            </Typography>
          </Box>
        )}
        <Typography variant="h4" gutterBottom>
          PTRS Report Wizard
        </Typography>

        {renderGuidance()}
        <Component
          data={stepData[`step${currentStep + 1}`]}
          onNext={goToNext}
          onBack={goToBack}
          reportStatus={reportStatus}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            disabled={currentStep === 0}
            onClick={goToBack}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            onClick={goToNext}
            variant="contained"
            color="primary"
            disabled={currentStep === steps.length - 1}
          >
            {currentStep === steps.length - 2 ? "Finish" : "Next"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
