import React, { useState } from "react";
import { userService } from "../../users/user.service";
import { reportService } from "../report.service";
import { Form, redirect } from "react-router";
import { Box, Button, Grid, Paper, useTheme } from "@mui/material";
import XeroCredentials from "../XeroCredentials";
import ReportDetails from "./ReportDetails";

export async function createPtrsAction({ request, params, context }) {
  const { alertContext, reportContext } = context;

  const validateReportingPeriod = (startDate, endDate, approvalDate) => {
    const errors = {};
    const today = new Date();
    const minStartDate = new Date("2024-07-01");

    if (new Date(startDate) < minStartDate) {
      errors.startDate = "Start date cannot be before 1 July 2024.";
    }

    if (new Date(endDate) >= today) {
      errors.endDate =
        "End date cannot be the same as or later than the date of submission.";
    }

    if (new Date(startDate) >= new Date(endDate)) {
      errors.dateRange = "Start date must be earlier than the end date.";
    }

    if (approvalDate && new Date(approvalDate) < new Date(endDate)) {
      errors.approvalDate =
        "Approval date cannot be before the reporting period end date.";
    }

    return errors;
  };

  const formData = await request.formData();
  const startDate = formData.get("ReportingPeriodStartDate");
  const endDate = formData.get("ReportingPeriodEndDate");

  const periodErrors = validateReportingPeriod(startDate, endDate);
  if (Object.keys(periodErrors).length > 0) {
    // setErrors(periodErrors);
    return;
  }

  let reportDetails = Object.fromEntries(formData);
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
  const [xeroSuccess, setXeroSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const theme = useTheme();

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
        <Form method="post" id="create-report-form">
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={12}>
              <ReportDetails />
            </Grid>
            <Grid item xs={12}>
              <XeroCredentials setXeroSuccess={setXeroSuccess} />
            </Grid>
          </Grid>

          {/* Reminder for confirmation */}
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              marginBottom: 2,
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <h3 style={{ margin: 0, color: theme.palette.text.secondary }}>
              Reminder
            </h3>
            <p style={{ margin: 0, color: theme.palette.text.primary }}>
              Before submitting your report in the regulator portal, ensure that
              all entity information is up to date and confirmed.
            </p>
          </Paper>

          <Button
            disabled={!xeroSuccess}
            variant="contained"
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
