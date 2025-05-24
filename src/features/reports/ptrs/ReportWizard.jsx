import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Tooltip,
} from "@mui/material";
import Loading from "../../../components/Loading";

// Step components (to be built/refactored)
import Step1 from "./Step1";
import Step2View from "./steps/Step2View";
import Step3View from "./steps/Step3View";
import Step4View from "./steps/Step4View";
import Step5View from "./steps/Step5View";
import Step6View from "./steps/Step6View";

// Example data loader (replace with actual context or API call if needed)
import { tcpService } from "../../../services";
import { glossary, ptrsGuidance } from "../../../constants/";
import { ReportContext } from "../../../context/ReportContext";

const steps = [
  { label: "Step 1: Confirm TCPs", Component: Step1 },
  { label: "Step 2: Finalise TCP Dataset", Component: Step2View },
  { label: "Step 3: Export ABNs for SBI", Component: Step3View },
  { label: "Step 4: Upload SBI Results", Component: Step4View },
  { label: "Step 5: Small Business Review", Component: Step5View },
  { label: "Step 6: Summary & Submission", Component: Step6View },
];

function enhanceWithGlossary(text) {
  if (!text) return "";
  // const terms = glossary.map((entry) => entry.term);
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
  const [currentStep, setCurrentStep] = useState(0);
  const currentStepKey = `step${currentStep + 1}`;
  const adjustedCurrentStep = currentStep + 1;
  const [stepData, setStepData] = useState({});
  // Track validation errors for each step (array of step indices with errors)
  const [stepErrors, setStepErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const originalRecordsRef = useRef({});

  const { Component } = steps[currentStep];

  useEffect(() => {
    // Initial load logic (e.g. fetch report data)
    async function loadData() {
      try {
        const records = await tcpService.getAllByReportId(reportId);
        setStepData((prev) => ({ ...prev, step1: records }));
        originalRecordsRef.current = Object.fromEntries(
          records.map((r) => [r.id, { ...r }])
        );
      } catch (error) {
        console.error("Error loading report data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [reportId]);

  const goToNext = () => {
    const currentStepIndex = currentStep;

    let hasErrors = false;

    if (currentStepIndex === 0) {
      const data = stepData["step1"];
      hasErrors = !data || data.length === 0;
    }

    if (currentStepIndex === 1) {
      const data = stepData["step2"];
      hasErrors = !data || data.some((record) => record.payeeEntityAbn == null);
    }

    if (currentStepIndex === 2) {
      const data = stepData["step3"];
      hasErrors = !data || data.abnListExported !== true;
    }

    if (currentStepIndex === 3) {
      const data = stepData["step4"];
      hasErrors = !data || data.sbiUploaded !== true;
    }

    if (currentStepIndex === 4) {
      const data = stepData["step5"];
      hasErrors =
        !data ||
        data.length === 0 ||
        data.some((rec) => rec.isSb === null || rec.isSb === undefined);
    }

    if (currentStepIndex === 5) {
      const data = stepData["step6"];
      hasErrors = !data || data.readyToSubmit !== true;
    }

    setStepErrors((prev) => {
      const withoutCurrent = prev.filter((idx) => idx !== currentStepIndex);
      return hasErrors ? [...withoutCurrent, currentStepIndex] : withoutCurrent;
    });

    if (hasErrors) return;

    setCurrentStep((prev) => {
      if (prev < steps.length - 1) return prev + 1;
      return prev;
    });
  };

  const goToBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSaveUpdates = async () => {
    try {
      const updatedRecords = (stepData[currentStepKey] || [])
        .filter((rec) => rec.updatedAt > rec.createdAt)
        .map((rec) => {
          const original = originalRecordsRef.current?.[rec.id];
          const changedFields = Object.keys(rec).reduce((acc, key) => {
            if (
              key !== "updatedAt" &&
              key !== "createdAt" &&
              rec[key] !== original?.[key]
            ) {
              acc[key] = rec[key];
            }
            return acc;
          }, {});
          return { id: rec.id, ...changedFields };
        });

      console.log("Saving records:", updatedRecords);
      const savedRecord = await tcpService.patchRecord(
        reportId,
        updatedRecords[0]
      );
      console.log("Records saved successfully.", savedRecord);

      // After save, update records in state without wasChanged field
      setStepData((prev) => {
        const key = currentStepKey;
        const updated = (prev[key] || []).map((rec) => {
          if (updatedRecords.some((ur) => ur.id === rec.id)) {
            return { ...rec };
          }
          return rec;
        });
        return { ...prev, [key]: updated };
      });
    } catch (error) {
      console.error("Failed to save records:", error);
    }
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

  const handleRecordChange = (id, field, value) => {
    console.log(
      `Updating record ${id} field ${field} to ${value} in step ${currentStepKey}`
    );
    setStepData((prev) => {
      const key = currentStepKey;
      const updated = (prev[key] || []).map((rec) =>
        rec.id === id ? { ...rec, [field]: value } : rec
      );
      return { ...prev, [key]: updated };
    });
    checkRecordChangeRevert(id, field, value);
  };

  const checkRecordChangeRevert = (id, field, value) => {
    setStepData((prev) => {
      const key = currentStepKey;
      const updated = (prev[key] || []).map((rec) => {
        if (rec.id !== id) return rec;
        const original = originalRecordsRef.current?.[id];
        if (!original) return rec;

        // Enhanced equality check
        const isEqual = (a, b) => {
          if (a === b) return true;
          if (a == null && (b === "" || b == null)) return true;
          if (b == null && (a === "" || a == null)) return true;
          if ((a === true || a === 1) && (b === true || b === 1)) return true;
          if ((a === false || a === 0) && (b === false || b === 0)) return true;
          return false;
        };

        const isChanged = !isEqual(value, original[field]);
        return { ...rec, wasChanged: isChanged };
      });
      return { ...prev, [key]: updated };
    });
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const hasUnsavedChanges = Object.values(stepData).some(
        (records) =>
          Array.isArray(records) &&
          records.some((rec) => rec.updatedAt > rec.createdAt)
      );
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [stepData]);

  return (
    <ReportContext.Provider
      value={{
        reportId,
        currentStep: currentStep + 1,
        records: stepData[currentStepKey] || [],
        setStepData,
        originalRecordsRef,
        handleRecordChange,
        handleSaveUpdates,
      }}
    >
      <Box sx={{ pt: 2, px: 3 }}>
        {/* Main content */}
        <Typography
          variant="subtitle1"
          sx={{ mb: 0.5, color: "text.secondary" }}
        >
          Step {adjustedCurrentStep} of {steps.length}
        </Typography>
        <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 2.5 }}>
          {steps.map((step, index) => (
            <Step key={step.label} completed={index < currentStep}>
              <Tooltip title={step.label} arrow>
                <StepLabel
                  icon={
                    index < currentStep
                      ? stepErrors.includes(index)
                        ? "⚠️"
                        : "✓"
                      : undefined
                  }
                  onClick={() => {
                    if (index < currentStep) setCurrentStep(index);
                  }}
                  sx={{
                    cursor: index < currentStep ? "pointer" : "default",
                    px: 1,
                  }}
                >
                  {step.label.replace(/^Step \d+: /, "")}
                </StepLabel>
              </Tooltip>
            </Step>
          ))}
        </Stepper>

        {renderGuidance()}
        {stepData[currentStepKey] ? <Component /> : <Loading />}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            disabled={currentStep === 0}
            onClick={goToBack}
            variant="outlined"
          >
            Back
          </Button>
          {Array.isArray(stepData[currentStepKey]) &&
            stepData[currentStepKey].some((rec) => rec.wasChanged) && (
              <Box
                sx={{
                  mt: 2,
                  mb: 2,
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <Button variant="outlined" onClick={handleSaveUpdates}>
                  Save Updates
                </Button>
              </Box>
            )}
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
    </ReportContext.Provider>
  );
}
