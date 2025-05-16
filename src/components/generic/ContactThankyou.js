import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ContactThankyou() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 4,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Thank you for getting in touch!
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        We’ve received your message and will get back to you shortly.
      </Typography>
      <Button
        variant="outlined"
        onClick={() => navigate("/")}
        sx={{ mt: 2 }}
        color="secondary"
      >
        Back to Home
      </Button>
    </Box>
  );
}
