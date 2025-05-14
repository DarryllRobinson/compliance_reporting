import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { tcpService } from "../../../services";

export default function Step6View() {
  const [missingFlags, setMissingFlags] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    tcpService.getIncompleteSmallBusinessFlags().then((hasMissing) => {
      setMissingFlags(hasMissing);
    });
  }, []);

  const handleSubmit = () => {
    tcpService.submitFinalReport().then(() => {
      setSubmitted(true);
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Step 6: Summary & Submission
      </Typography>

      {submitted ? (
        <Alert severity="success">Report successfully submitted!</Alert>
      ) : (
        <>
          {missingFlags && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Some records are missing Small Business (isSb) flags. Please
              complete SBI processing before submitting.
            </Alert>
          )}
          <Typography variant="body1" sx={{ mb: 2 }}>
            Review completed. Click submit when ready to finalise and lodge your
            report.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            disabled={missingFlags}
            onClick={handleSubmit}
          >
            Submit Report
          </Button>
        </>
      )}
    </Box>
  );
}
