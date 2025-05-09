import React from "react";
import { Typography, Box, Button, Paper, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";

export default function LandingPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        textAlign: "center",
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(4),
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: theme.spacing(4),
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box
          sx={{
            borderTop: `6px solid ${theme.palette.primary.main}`,
            paddingTop: theme.spacing(2),
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{ color: theme.palette.text.primary }}
          >
            Simplify Your Payment Times Reporting
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ color: theme.palette.text.secondary }}
          >
            Answer a few quick questions to find out which entities in your
            group need to report under the PTRS. We’ll guide you through the
            process and email you a personalised summary.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: theme.spacing(3),
              marginBottom: theme.spacing(5),
            }}
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

          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ mt: theme.spacing(2) }}
          >
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: theme.palette.text.primary }}
              >
                Tailored Compliance Guidance
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Step-by-step logic aligned with your business structure.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: theme.palette.text.primary }}
              >
                Personalised Email Summary
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Receive a report outlining your likely obligations.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: theme.palette.text.primary }}
              >
                Secure & Confidential
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Your data is encrypted and never shared without your consent.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
