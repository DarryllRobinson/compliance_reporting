import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router";

export default function PTRSolution() {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      title: "Eligibility Navigator",
      description:
        "A guided flowchart that helps users determine if their entity is required to report under the Payment Times Reporting Act 2020.",
    },
    {
      title: "Automated Calculations",
      description:
        "Our system calculates key metrics such as average payment time, 80th/95th percentiles, and compliance thresholds based on your unique dataset.",
    },
    {
      title: "Audit-Ready Tracking",
      description:
        "All user interactions are logged to ensure full auditability and traceability of actions.",
    },
    {
      title: "Secure Multi-Tenant Architecture",
      description:
        "Data is isolated and secured at the database level, ensuring your organisation's records are never exposed to other users.",
    },
    {
      title: "PDF Reporting",
      description:
        "Generate and download professional summary reports, or have them sent directly to your inbox for recordkeeping and compliance.",
    },
    {
      title: "Integrated Guidance",
      description:
        "Step-by-step helper texts and tooltips based on government documentation, ensuring you're never left guessing what a field means.",
    },
  ];

  return (
    <Box
      sx={{
        px: { xs: theme.spacing(3), md: theme.spacing(8) },
        py: theme.spacing(6),
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography variant="h4" gutterBottom color={theme.palette.text.primary}>
        Payment Times Reporting Compliance Platform
      </Typography>

      <Typography
        variant="body1"
        color={theme.palette.text.secondary}
        sx={{ mb: theme.spacing(4) }}
      >
        A complete compliance solution for Australian businesses with over A$100
        million in annual turnover. Built to simplify your reporting
        obligations, reduce risk, and give you confidence in your compliance
        with the Payment Times Reporting Act 2020.
      </Typography>

      <Grid container spacing={4}>
        {features.map((feature, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  color={theme.palette.text.secondary}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: theme.spacing(6), textAlign: "center" }}>
        <Typography
          variant="h6"
          gutterBottom
          color={theme.palette.text.primary}
        >
          Ready to check your entity's reporting eligibility?
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/entity-checker")}
          sx={{
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Start Eligibility Check
        </Button>
      </Box>
    </Box>
  );
}
