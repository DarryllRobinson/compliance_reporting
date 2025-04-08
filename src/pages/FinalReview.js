import React from "react";
import { Box, Typography, Button } from "@mui/material";

const FinalReview = () => {
  const handleSubmit = () => {
    alert("Submission successful!");
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Final Review and Submission
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please review all the details carefully before submitting.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 3 }}
      >
        Submit to Regulator
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => (window.location.href = "/select-report")}
        sx={{ mt: 3, ml: 2 }}
      >
        Back to Reports
      </Button>
    </Box>
  );
};

export default FinalReview;
