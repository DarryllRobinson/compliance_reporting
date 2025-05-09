import React from "react";
import { Box, Typography, Paper, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ position: "relative" }}>
      {/* Full-width header image */}
      <Box
        component="img"
        src="/assets/images/backgrounds/monochromatic squares.jpg"
        alt="Background pattern"
        sx={{
          width: "100%",
          height: isMobile ? "200px" : "400px",
          objectFit: "cover",
        }}
      />

      {/* Text over the image */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "15%",
          transform: "translateY(-50%)",
          color: theme.palette.common.white,
          textAlign: "left",
          maxWidth: "45%",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Simplify Your Payment Times Reporting
        </Typography>
      </Box>

      {/* Main content */}
      <Paper
        elevation={3}
        sx={{ p: 4, backgroundColor: theme.palette.background.paper, mt: 4 }}
      >
        <Typography variant="body1">
          The Payment Times Reporting Scheme (PTRS) requires qualifying
          businesses in Australia to report on their payment practices to small
          businesses. Our platform simplifies this process for you.
        </Typography>
        <Typography variant="body1" paragraph>
          The Payment Times Reporting Scheme (PTRS) requires qualifying
          businesses in Australia to report on their payment practices to small
          businesses. Navigating the eligibility rules and understanding which
          entities must report can be difficult, especially within complex
          corporate structures.
        </Typography>

        <Typography variant="body1" paragraph>
          Our compliance platform helps your business meet these obligations
          more easily. At its core is the Entity Navigator — an intuitive tool
          that walks you through a series of eligibility questions, tailored to
          your business structure. The process is streamlined and removes the
          ambiguity often associated with regulatory compliance.
        </Typography>

        <Typography variant="body1" paragraph>
          Upon completion, users receive a summary report via email, outlining
          their likely obligations under the PTRS. The report is generated in
          real time and provides an audit-friendly record for internal and
          external use. All user inputs are handled confidentially, and no
          unnecessary data is requested or stored.
        </Typography>

        <Typography variant="body1" paragraph>
          Designed with security, clarity, and scalability in mind, our platform
          is built for enterprise-grade compliance without the usual overheads.
          Whether you're reporting for a single entity or a complex group, the
          process remains consistent, accurate, and easy to follow.
        </Typography>
      </Paper>
    </Box>
  );
}
