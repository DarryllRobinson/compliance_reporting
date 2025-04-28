import React from "react";
import { Form, redirect, useLocation } from "react-router";
import {
  Box,
  Button,
  TextField,
  useTheme,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { userService } from "../users/user.service";
import { reportService } from "./report.service";
import {
  financeService,
  paymentService,
  submissionService,
} from "../../services";

export async function createReportAction({ request, params, context }) {
  // Extract reportContext from the context parameter
  const { alertContext, reportContext } = context;

  const formData = await request.formData();
  let reportDetails = Object.fromEntries(formData);
  reportDetails = {
    ...reportDetails,
    code: params.code,
    reportStatus: "Created",
    createdBy: userService.userValue.id,
    clientId: userService.userValue.clientId,
  };

  try {
    const report = await reportService.create(reportDetails);
    if (!report) alertContext.sendAlert("error", "Report not created");
    // Insert the report ID into the reportDetails object
    reportDetails = {
      ...reportDetails,
      reportId: report.id,
    };

    // Create a record for each section in the database
    // Payment section
    try {
      const payment = await paymentService.create({
        reportId: report.id,
        createdBy: userService.userValue.id,
      });

      reportDetails = {
        ...reportDetails,
        paymentId: payment.id,
      };
    } catch (error) {
      alertContext.sendAlert("error", error || "Error creating payment record");
      console.error("Error creating payment record:", error);
    }

    // Finance section
    try {
      const finance = await financeService.create({
        reportId: report.id,
        createdBy: userService.userValue.id,
      });

      reportDetails = {
        ...reportDetails,
        financeId: finance.id,
      };
    } catch (error) {
      console.error("Error creating finance record:", error);
    }

    // Submission section
    try {
      const submission = await submissionService.create({
        reportId: report.id,
        createdBy: userService.userValue.id,
      });

      reportDetails = {
        ...reportDetails,
        submissionId: submission.id,
      };
    } catch (error) {
      alertContext.sendAlert(
        "error",
        error || "Error creating submission record"
      );
      console.error("Error creating submission record:", error);
    }

    // Update the ReportContext with the new report details
    if (reportContext && reportContext.setReportDetails) {
      reportContext.setReportDetails(reportDetails);
    }

    // Redirect to the next step in the process
    return redirect(`/reports/${params.code}/xero-credentials`);
  } catch (error) {
    alertContext.sendAlert("error", error || "Error creating report");
    console.error("Error creating report:", error);
  }
}

export default function CreateReport() {
  const location = useLocation();
  const { reportName, reportList } = location.state || {};
  const theme = useTheme();

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
        <Form
          method="post"
          id="create-user-form"
          style={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="report-select-label">Report Name</InputLabel>
                <Select
                  labelId="report-select-label"
                  name="reportName"
                  id="report"
                  label="List of Reports"
                  defaultValue={reportName || ""}
                  required
                >
                  {reportList?.map((report) => (
                    <MenuItem key={report.id} value={report.name}>
                      {report.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
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
                defaultValue={defaultDate || ""}
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
