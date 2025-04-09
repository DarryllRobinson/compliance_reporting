import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import EntityForm from "./EntityForm";

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
      <EntityForm />
      <Button
        variant="contained"
        color="primary"
        onClick={handleConfirm}
        disabled={confirmed}
        sx={{ mt: 3 }}
      >
        {confirmed ? "Confirmed" : "Confirm and Proceed to Final Review"}
      </Button>
    </Box>
  );
};

export default ReviewReport;
