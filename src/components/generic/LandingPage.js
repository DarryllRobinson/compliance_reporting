import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <Container maxWidth="md" sx={{ textAlign: "center", py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Compliance Reporting Made Easy
      </Typography>
      <Typography variant="body1" paragraph>
        We simplify compliance reporting for businesses of all sizes. Choose the
        reports you need, and we’ll handle the rest—accurately and on time.
      </Typography>
      <Typography variant="body1" paragraph>
        Try our awesome entity checker thing
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/entity-flow")}
        >
          Entity Checker
        </Button>
      </Box>
      <Typography variant="h5" gutterBottom>
        Pricing
      </Typography>
      <Typography variant="body2" paragraph>
        Our subscription plans are flexible and tailored to your needs. Select
        the reports you want us to lodge, and we’ll bundle them into a
        convenient monthly or annual fee. Save 15% with an annual subscription!
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
        <Button variant="contained" color="primary">
          Monthly Subscription
        </Button>
        <Button variant="outlined" color="primary">
          Annual Subscription
        </Button>
      </Box>
    </Container>
  );
}
