import { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Tooltip,
  Alert,
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
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const { Component } = steps[currentStep];

  useEffect(() => {
    // Initial load logic (e.g. fetch report data)
    async function loadRecords() {
      try {
        const records = await tcpService.getAllByReportId(reportId);
        // Append wasChanged, wasSaved, and original object to each record
        const enhancedRecords = records.map((r) => {
          const { original, original_field, ...rest } = r; // Remove any original_ fields if exist
          // Deep copy the record for original
          const originalCopy = JSON.parse(JSON.stringify(rest));
          return {
            ...rest,
            wasChanged: false,
            wasSaved: false,
            original: originalCopy,
          };
        });
        setRecords(enhancedRecords || {});
      } catch (error) {
        console.error("Error loading report records:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadRecords();
  }, [reportId]);

  const goToNext = () => {
    const currentStepIndex = currentStep;

    let hasErrors = false;

    if (currentStepIndex === 0) {
    }

    if (currentStepIndex === 1) {
    }

    if (currentStepIndex === 2) {
    }

    if (currentStepIndex === 3) {
    }

    if (currentStepIndex === 4) {
    }

    if (currentStepIndex === 5) {
    }

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
      setAlert({ type: "success", message: "Changes saved successfully." });
    } catch (error) {
      console.error("Failed to save updated records:", error);
      setAlert({ type: "error", message: "Failed to save updates." });
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
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === id
          ? { ...record, [field]: value, wasChanged: true, wasSaved: false }
          : record
      )
    );
    checkRecordChangeRevert(id, field, value);
  };

  const checkRecordChangeRevert = (id, field, newValue) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) => {
        if (record.id !== id) return record;

        let originalValue = record.original
          ? record.original[field]
          : undefined;
        if (originalValue === undefined) {
          originalValue = record[field];
        }

        // Treat null and "" as equal
        const normalise = (val) => {
          if (val === null || val === "") return "";
          if (val === true) return 1;
          if (val === false) return 0;
          return val;
        };

        const normalisedOriginal = normalise(originalValue);
        const normalisedNew = normalise(newValue);
        const isReverted = normalisedOriginal === normalisedNew;

        return { ...record, wasChanged: !isReverted };
      })
    );
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const hasUnsavedChanges = Object.values(records).some(
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
  }, [records]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Loading />
      </Box>
    );
  }

  return (
    <ReportContext.Provider
      value={{
        reportId,
        currentStep: currentStep + 1,
        records,
        handleRecordChange,
        handleSaveUpdates,
      }}
    >
      <Box sx={{ pt: 2, px: 3 }}>
        {alert && (
          <Alert
            severity={alert.severity}
            onClose={() => setAlert(null)}
            sx={{ mb: 2 }}
          >
            {alert.message}
          </Alert>
        )}
        {/* Main content */}
        <Typography
          variant="subtitle1"
          sx={{ mb: 0.5, color: "text.secondary" }}
        >
          Step {currentStep} of {steps.length}
        </Typography>
        <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 2.5 }}>
          {steps.map((step, index) => (
            <Step key={step.label} completed={index < currentStep}>
              <Tooltip title={step.label} arrow>
                <StepLabel
                  // icon={
                  //   index < currentStep
                  //     ? stepErrors.includes(index)
                  //       ? "⚠️"
                  //       : "✓"
                  //     : undefined
                  // }
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
        {records ? <Component /> : <Loading />}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            disabled={currentStep === 0}
            onClick={goToBack}
            variant="outlined"
          >
            Back
          </Button>
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
