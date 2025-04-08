import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import InvoiceMetrics from "./InvoiceMetrics";

const ReviewReport = () => {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Review Report
      </Typography>
      <InvoiceMetrics />
      <Button
        variant="contained"
        color="primary"
        onClick={handleConfirm}
        disabled={confirmed}
        sx={{ mt: 3 }}
      >
        {confirmed ? "Confirmed" : "Confirm Report"}
      </Button>
    </Box>
  );
};

export default ReviewReport;
