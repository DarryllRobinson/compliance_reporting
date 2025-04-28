import React from "react";
import { Stepper, Step, Box, StepButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router";

const steps = [
  "Select Report from Dashboard",
  "Retrieve or Create Report",
  "Review & Update Payment Details",
  "Upload Extract to PTRS Portal",
  "Upload Extract from PTRS Portal",
  "Capture Details in PTRS Portal",
  "Final Review & Submission in PTRS Portal",
];

const ProcessFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveStep = () => {
    switch (location.pathname) {
      case "/reports/ptrs/create":
        return 1;
      case "/reports/ptrs/update":
        return 2;
      case "/reports/ptrs/extract":
        return 3;
      case "/reports/ptrs/upload":
        return 4;
      case "/reports/ptrs/capture":
        return 5;
      case "/reports/ptrs/complete":
        return 6;
      default:
        return 0;
    }
  };

  const getStepUrl = (index) => {
    const urls = [
      "/user/dashboard",
      "/reports/ptrs/create",
      "/reports/ptrs/update",
      "/reports/ptrs/extract",
      "/reports/ptrs/upload",
      "/reports/ptrs/capture",
      "/reports/ptrs/complete",
    ];
    return urls[index] || "/";
  };

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Stepper activeStep={getActiveStep()} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={() => navigate(getStepUrl(index))}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default ProcessFlow;
