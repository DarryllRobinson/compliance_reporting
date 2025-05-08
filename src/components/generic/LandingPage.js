import React from "react";
import { Container, Typography, Box, Button, Paper, Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import globalTheme from "../../theme/globalTheme";
import { useNavigate } from "react-router";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={globalTheme}>
      <Container maxWidth="md" sx={{ textAlign: "center", py: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ borderTop: "6px solid #607d8b", pt: 2 }}>
            <Typography variant="h3" gutterBottom>
              Simplify Your Payment Times Reporting
            </Typography>
            <Typography variant="body1" paragraph>
              Answer a few quick questions to find out which entities in your
              group need to report under the PTRS. We’ll guide you through the
              process and email you a personalised summary.
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 5 }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate("/entity-flow")}
              >
                Start Entity Navigator
              </Button>
            </Box>

            <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" gutterBottom>
                  Tailored Compliance Guidance
                </Typography>
                <Typography variant="body2">
                  Step-by-step logic aligned with your business structure.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" gutterBottom>
                  Personalised Email Summary
                </Typography>
                <Typography variant="body2">
                  Receive a report outlining your likely obligations.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" gutterBottom>
                  Secure & Confidential
                </Typography>
                <Typography variant="body2">
                  Your data is encrypted and never shared without your consent.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
