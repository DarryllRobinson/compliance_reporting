import React from "react";
import {
  Typography,
  Box,
  Button,
  Grid,
  Container,
  useMediaQuery,
  useTheme,
  Paper,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router";

export default function LandingPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default }}>
      {/* Hero Banner */}
      <Box
        sx={{
          backgroundImage: `url(/images/backgrounds/monochromatic%20squares.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: isSmallScreen ? 300 : 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "rgba(0, 0, 0, 0.6)",
            p: isSmallScreen ? 2 : 4,
            borderRadius: 2,
            width: isSmallScreen ? "90%" : "60%",
          }}
        >
          <Typography
            variant={isSmallScreen ? "h4" : "h2"}
            sx={{
              color: "#fff",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Navigate PTR obligations with confidence
          </Typography>
          <Typography
            variant={isSmallScreen ? "body1" : "h5"}
            sx={{ color: "#fff", mb: 3 }}
          >
            Our smart tool helps determine which entities must report and what
            to do next.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/entity-navigator")}
            sx={{ width: isSmallScreen ? "100%" : "auto" }}
          >
            Start Entity Navigator
          </Button>
        </Box>
      </Box>

      {/* Benefits */}
      {/* <Box sx={{ bgcolor: theme.palette.background.paper, py: 6 }}>
        <Container>
          <Grid container spacing={4}>
            {[
              "Australian regulation aligned",
              "Secure & private",
              "No login required to start",
            ].map((text, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: theme.palette.text.primary,
                    textAlign: "center",
                  }}
                >
                  {text}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    textAlign: "center",
                  }}
                >
                  {text === "Australian regulation aligned"
                    ? "Built specifically to comply with the Payment Times Reporting Act 2020."
                    : text === "Secure & private"
                      ? "We don’t store sensitive data — your results remain confidential."
                      : "Jump straight in and explore entity eligibility without creating an account."}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box> */}

      {/* Benefits as Cards */}
      <Box sx={{ bgcolor: theme.palette.background.paper, py: 6 }}>
        <Container>
          <Grid container spacing={4}>
            {[
              "Australian regulation aligned",
              "Secure & private",
              "No login required to start",
            ].map((text, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                {/* <Card>
                  <CardMedia
                    sx={{ height: 140 }}
                    image="/images/backgrounds/right_zebra_crossing.jpg"
                  />
                  <CardContent> */}
                <Box
                  sx={{
                    backgroundImage: `url(/images/backgrounds/right_zebra_crossing.jpg)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    px: 2,
                    mb: 2,
                  }}
                ></Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: theme.palette.text.primary,
                    textAlign: "center",
                  }}
                >
                  {text}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    textAlign: "center",
                  }}
                >
                  {text === "Australian regulation aligned"
                    ? "Built specifically to comply with the Payment Times Reporting Act 2020."
                    : text === "Secure & private"
                      ? "We don’t store sensitive data — your results remain confidential."
                      : "Jump straight in and explore entity eligibility without creating an account."}
                </Typography>
                {/* </CardContent>
                </Card> */}
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features as Cards */}
      <Box sx={{ bgcolor: theme.palette.background.paper, py: 3 }}>
        <Container>
          <Grid container spacing={4}>
            {[
              "Evaluate eligibility",
              "Complete reporting flow",
              "Receive tailored summary",
            ].map((text, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    sx={{ height: 140 }}
                    image="/images/backgrounds/right_zebra_crossing.jpg"
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {text}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {text === "Evaluate eligibility"
                        ? "Determine your entity’s obligations through a guided flow aligned with current legislation."
                        : text === "Complete reporting flow"
                          ? "Answer key questions step-by-step to assess reporting requirements."
                          : "Receive a clear PDF report summarising the results and what actions to take next."}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      {/* <Container sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {[
            "Evaluate eligibility",
            "Complete reporting flow",
            "Receive tailored summary",
          ].map((text, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  height: "100%",
                  textAlign: "center", // Center-align text for consistency
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: theme.palette.text.primary }}
                >
                  {text}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {text === "Evaluate eligibility"
                    ? "Determine your entity’s obligations through a guided flow aligned with current legislation."
                    : text === "Complete reporting flow"
                      ? "Answer key questions step-by-step to assess reporting requirements."
                      : "Receive a clear PDF report summarising the results and what actions to take next."}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container> */}

      {/* CTA */}
      <Box sx={{ py: 6, textAlign: "center", px: 2 }}>
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          sx={{ mb: 2, color: theme.palette.text.primary }}
        >
          Take the guesswork out of PTR compliance
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/entity-navigator")}
          sx={{ width: isSmallScreen ? "100%" : "auto" }}
        >
          Start Entity Navigator
        </Button>
      </Box>
    </Box>
  );
}
