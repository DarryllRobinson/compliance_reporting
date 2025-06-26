import { Box, Typography, Grid, Button, Paper } from "@mui/material";

const features = [
  {
    title: "Payment Times Reporting (PTRS)",
    description:
      "Federally mandated, recurring, and built into our DNA. Automate and scale your PTRS obligations.",
  },
  {
    title: "Modern Slavery Compliance",
    description:
      "Annual reporting, templated assessments, due diligence logs — no consultants required.",
  },
  {
    title: "Director Obligations & Disclosures",
    description:
      "Recurring declarations, conflicts tracking, and board-ready summaries.",
    comingSoon: true,
  },
  {
    title: "Whistleblower Compliance",
    description:
      "Secure intake, triage and response tracking. ASIC-ready. White-labelled.",
    comingSoon: true,
  },
  {
    title: "Risk Register as a Service (RRAAS)",
    description:
      "From outdated spreadsheets to live risk reviews. Templated controls and frictionless workflows.",
    comingSoon: true,
  },
];

export default function LandingPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" gutterBottom>
          Simplify your compliance obligations.
        </Typography>
        <Typography variant="h6" color="textSecondary">
          A unified platform for managing regulatory compliance with efficiency
          and clarity.
        </Typography>
        <Box mt={4}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Explore the Compliance Suite
          </Button>
          <Button variant="outlined" color="primary">
            Book a Demo
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                {feature.title}
              </Typography>
              {feature.comingSoon && (
                <Typography
                  variant="caption"
                  color="primary"
                  display="block"
                  gutterBottom
                >
                  Coming Soon
                </Typography>
              )}
              <Typography variant="body2" color="textSecondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box mt={8} textAlign="center">
        <Typography variant="h5" gutterBottom>
          Regulations are evolving. Your compliance tools should too.
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Monochrome provides a consistent, scalable approach to managing
          obligations across your organization.
        </Typography>
      </Box>
    </Box>
  );
}
