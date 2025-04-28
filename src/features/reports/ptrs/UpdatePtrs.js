import React from "react";
import { reportService } from "../report.service";
import { useLoaderData } from "react-router";
import { Box, Paper, useTheme } from "@mui/material";

export async function updatePtrsLoader({ params, context }) {
  const { alertContext, reportContext } = context;
  // Retrieve records from database
  try {
    const reportDetails = await reportService.getById(params.reportId);
    console.log("UpdatePtrsLoader reportDetails", reportDetails);

    // Handle missing data gracefully
    if (!reportDetails) {
      alertContext.sendAlert("error", "Report details not found");
      throw new Error("Report details not found");
    }

    return { reportDetails };
  } catch (error) {
    alertContext.sendAlert(
      "error",
      error.message || "Error fetching report details"
    );
    console.error("Error fetching report details:", error);
    throw new Error("Error fetching report details");
  }
}

export default function UpdatePtrs() {
  const { reportDetails } = useLoaderData();
  const theme = useTheme();

  console.log("UpdatePtrs reportDetails", reportDetails);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 800,
          width: "100%",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        Update the Payment Times Reporting Scheme details here.
      </Paper>
    </Box>
  );
}
