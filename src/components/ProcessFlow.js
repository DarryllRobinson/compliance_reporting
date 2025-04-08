import React, { useState } from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import { useLocation } from "react-router";

const steps = [
  "Select Report",
  "Provide Xero Credentials",
  "Review Entity Details",
  "Review Invoice Metrics",
  "Final Review and Submission",
];

const ProcessFlow = () => {
  const location = useLocation();

  const getActiveStep = () => {
    switch (location.pathname) {
      case "/xero-credentials":
        return 1;
      case "/review-entity":
        return 2;
      case "/invoice-metrics":
        return 3;
      case "/final-review":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <Box>
      <Stepper activeStep={getActiveStep()} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default ProcessFlow;
