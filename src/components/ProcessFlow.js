import React, { useState } from "react";
import { Stepper, Step, StepLabel, Box, StepButton } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router";

const steps = [
  "Select Report",
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
      case "/xero-credentials":
        return 1;
      case "/review-report":
        return 2;
      case "/invoice-metrics":
        return 3;
      case "/final-review":
        return 4;
      default:
        return 0;
    }
  };

  const getStepUrl = (index) => {
    const urls = [
      "/select-report",
      "/xero-credentials",
      "/review-report",
      "/invoice-metrics",
      "/final-review",
    ];
    return urls[index] || "/";
  };

  return (
    <Box>
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
