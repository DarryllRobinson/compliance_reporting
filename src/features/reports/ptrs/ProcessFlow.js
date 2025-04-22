import React from "react";
import { Stepper, Step, Box, StepButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router";

const steps = [
  "Select Report from Dashboard",
  "Provide Xero Credentials",
  "Review Report Details",
  "Review Invoice Metrics",
  "Final Review and Submission",
];

const ProcessFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveStep = () => {
    switch (location.pathname) {
      case "/reports/ptrs/xero-credentials":
        return 1;
      case "/reports/ptrs/update":
        return 2;
      case "/reports/ptrs/invoice":
        return 3;
      case "/reports/ptrs/review":
        return 4;
      default:
        return 0;
    }
  };

  const getStepUrl = (index) => {
    const urls = [
      "/user/dashboard",
      "/reports/ptrs/xero-credentials",
      "/reports/ptrs/update",
      "/reports/ptrs/invoice",
      "/reports/ptrs/review",
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
