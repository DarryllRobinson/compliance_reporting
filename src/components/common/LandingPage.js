import { Box, Typography, Grid, Paper, useTheme, Divider } from "@mui/material";
import DomainVerificationIcon from "@mui/icons-material/DomainVerification";
import DescriptionIcon from "@mui/icons-material/Description";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import Contact from "./Contact";

export default function LandingPage() {
  const theme = useTheme();

  return (
    <Box sx={{ mx: "auto", mt: 5, p: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" gutterBottom textAlign="center">
          We can help you meet your Payment Times Reporting deadline.
        </Typography>
        <Grid container spacing={3} mt={2} justifyContent="space-between">
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Box sx={{ mb: 1 }}>
                <DomainVerificationIcon
                  sx={{ fontSize: 36, color: theme.palette.primary.main }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                ABN Matching & Enrichment
              </Typography>
              <Typography variant="body2">
                We clean and complete your supplier list using trusted ABN
                sources — no gaps, no guesswork.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Box sx={{ mb: 1 }}>
                <DescriptionIcon
                  sx={{ fontSize: 36, color: theme.palette.primary.main }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                Expert Report Preparation
              </Typography>
              <Typography variant="body2">
                We prepare your report to meet regulator expectations, ensuring
                completeness and submission readiness.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Box sx={{ mb: 1 }}>
                <RocketLaunchIcon
                  sx={{ fontSize: 36, color: theme.palette.primary.main }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                Complete Solution
              </Typography>
              <Typography variant="body2">
                Our battle-tested processes ensure a speedy and reliable
                outcome.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Box sx={{ mb: 1 }}>
                <VerifiedUserIcon
                  sx={{ fontSize: 36, color: theme.palette.primary.main }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                Trusted by ASX Companies
              </Typography>
              <Typography variant="body2">
                Our team supports some of Australia's largest listed entities
                with their regulatory compliance obligations.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Typography variant="h4" gutterBottom textAlign="center">
        Still haven’t submitted your Payment Times Report?
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        textAlign="center"
        color="error"
        sx={{ fontWeight: "bold" }}
      >
        Deadline: 30 June. Late submissions are subject to significant fines of
        upwards of $99,000 per day.
      </Typography>
      <Typography variant="body1" gutterBottom textAlign="center">
        Quick call to walk you through the requirements → We generate your
        report → You submit it on time.
      </Typography>
      <Typography variant="body2" textAlign="center" sx={{ mb: 4 }}>
        ✅ ABN lookup ✅ TCP logic ✅ Submission-ready report
      </Typography>

      <Typography variant="h6" textAlign="center" sx={{ mb: 3 }}>
        Prices start $795 + GST (depending on requirements)
      </Typography>
      <Divider sx={{ my: 4 }} />

      {/*
      Future-focused landing content
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          One Platform. Every Obligation. Delivered.
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ mb: 4 }}>
          From Payment Times Reports to Modern Slavery, Director Disclosures and beyond — Monochrome Compliance simplifies compliance so you can focus on governance, not guesswork.
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, minHeight: 200 }}>
              <Box sx={{ mb: 1 }}>
                <DescriptionIcon
                  sx={{ fontSize: 36, color: theme.palette.primary.main }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                Modern Slavery Reporting
              </Typography>
              <Typography variant="body2">
                Templated risk assessments, due diligence logs and
                registry-ready reports. Simplified.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, minHeight: 200 }}>
              <Box sx={{ mb: 1 }}>
                <VerifiedUserIcon
                  sx={{ fontSize: 36, color: theme.palette.primary.main }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                Director Disclosures
              </Typography>
              <Typography variant="body2">
                Track declarations, manage conflicts, and automate board
                attestation cycles.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, minHeight: 200 }}>
              <Box sx={{ mb: 1 }}>
                <RocketLaunchIcon
                  sx={{ fontSize: 36, color: theme.palette.primary.main }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                Whistleblower Compliance
              </Typography>
              <Typography variant="body2">
                Provide a simple, secure intake and triage experience — without
                the overpriced platforms.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, minHeight: 200 }}>
              <Box sx={{ mb: 1 }}>
                <DomainVerificationIcon
                  sx={{ fontSize: 36, color: theme.palette.primary.main }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                Risk Register as a Service
              </Typography>
              <Typography variant="body2">
                Keep your risks up-to-date with a guided register, library of
                controls, and review reminders.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Typography variant="body1" textAlign="center" sx={{ mt: 5 }}>
          Book a short call to see how Monochrome Compliance can handle the rest of your
          obligations.
        </Typography>
      </Box>
      */}
      <Contact />
    </Box>
  );
}
