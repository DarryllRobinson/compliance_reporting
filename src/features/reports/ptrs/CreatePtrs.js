import React from "react";
import { Box, Button, useTheme, TextField, Grid, Paper } from "@mui/material";
import { Form, redirect } from "react-router";
import { userService } from "../../users/user.service";
import { reportService } from "../report.service";

export async function createPtrsAction({ request, params, context }) {
  const { alertContext, reportContext } = context;

  const formDada = await request.formData();
  let reportDetails = Object.fromEntries(formDada);
  reportDetails = {
    ...reportDetails,
    code: params.code,
    reportName: "Payment Times Reporting Scheme",
    reportStatus: "Created",
    createdBy: userService.userValue.id,
    clientId: userService.userValue.clientId,
  };

  // Save the report details to the database
  try {
    const report = await reportService.create(reportDetails);
    if (!report) alertContext.sendAlert("error", "Report not created");

    // Update the ReportContext with the new report details
    if (reportContext && reportContext.setReportDetails) {
      reportContext.setReportDetails(reportDetails);
    }

    // Alert the user about the successful creation
    alertContext.sendAlert("success", "Report created successfully");
    // Redirect to the report page
    return redirect(`/reports/${params.code}/report/${report.id}`);
  } catch (error) {
    alertContext.sendAlert("error", error || "Error creating report");
    console.error("Error creating report:", error);
  }
}

export default function CreatePtrs() {
  const theme = useTheme();

  const today = new Date().toISOString().split("T")[0];
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const defaultDate = sixMonthsAgo.toISOString().split("T")[0];

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
        <Box sx={{ mb: 2 }}>Payment Times Reporting Scheme</Box>
        <Form
          method="post"
          id="create-user-form"
          style={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Reporting Period Start Date"
                name="ReportingPeriodStartDate"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                defaultValue={defaultDate || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Reporting Period End Date"
                name="ReportingPeriodEndDate"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                defaultValue={today || ""}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            Create Report
          </Button>
        </Form>
      </Paper>
    </Box>
  );
}
