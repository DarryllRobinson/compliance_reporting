import React from "react";
import { Box, Paper, TextField, Button, Grid, useTheme } from "@mui/material";
import { useActionData, Form, redirect } from "react-router";
import { userService } from "../../users/user.service";
import { reportService } from "../report.service";

export async function createReportAction({ request, context, params }) {
  const { alertContext, reportContext } = context;
  const formData = await request.formData();
  let reportDetails = Object.fromEntries(formData);

  const today = new Date();
  const minStartDate = new Date("2024-07-01");
  const errors = {};

  // Validation logic
  if (!reportDetails.ReportingPeriodStartDate) {
    errors.ReportingPeriodStartDate = "Start date is required.";
  } else if (new Date(reportDetails.ReportingPeriodStartDate) < minStartDate) {
    errors.ReportingPeriodStartDate =
      "Start date cannot be before 1 July 2024.";
  }

  if (!reportDetails.ReportingPeriodEndDate) {
    errors.ReportingPeriodEndDate = "End date is required.";
  } else if (new Date(reportDetails.ReportingPeriodEndDate) >= today) {
    errors.ReportingPeriodEndDate =
      "End date cannot be the same as or later than the date of submission.";
  } else if (
    new Date(reportDetails.ReportingPeriodStartDate) >=
    new Date(reportDetails.ReportingPeriodEndDate)
  ) {
    errors.ReportingPeriodEndDate = "End date must be after the start date.";
  }

  if (
    new Date(reportDetails.ReportingPeriodEndDate) -
      new Date(reportDetails.ReportingPeriodStartDate) >
    365 * 24 * 60 * 60 * 1000
  ) {
    errors.ReportingPeriodEndDate = "Reporting period cannot exceed 12 months.";
  }

  // If there are validation errors, return them
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  reportDetails = {
    ...reportDetails,
    code: params.code,
    reportName: "Payment Times Reporting Scheme",
    reportStatus: "Created",
    createdBy: userService.userValue.id,
    clientId: userService.userValue.clientId,
  };

  console.log("reportDetails:", reportDetails);

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
    // Redirect to the external data source connection page
    return redirect(`/reports/${params.code}/report/${report.id}/connect`);
  } catch (error) {
    alertContext.sendAlert("error", error || "Error creating report");
    console.error("Error creating report:", error);
  }
}

export default function CreateReport() {
  const theme = useTheme();
  const actionData = useActionData(); // Access validation errors returned by the action

  // For development purposes, set default dates
  const today = new Date();
  let yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  yesterday = yesterday.toISOString().split("T")[0];
  const defaultDate = new Date("2024-07-01").toISOString().split("T")[0];

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
        <Form method="post">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Reporting Period Start Date"
                name="ReportingPeriodStartDate"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!actionData?.errors?.ReportingPeriodStartDate}
                helperText={actionData?.errors?.ReportingPeriodStartDate || ""}
                defaultValue={defaultDate || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Reporting Period End Date"
                name="ReportingPeriodEndDate"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!actionData?.errors?.ReportingPeriodEndDate}
                helperText={actionData?.errors?.ReportingPeriodEndDate || ""}
                defaultValue={yesterday || ""}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Create Report
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Paper>
    </Box>
  );
}
