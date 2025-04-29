import React, { useState } from "react";
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
  const [reportType, setReportType] = useState("Standard PTR");
  const [validationResults, setValidationResults] = useState([]);

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const handleSubmit = () => {
    const metrics = calculateInvoiceMetrics(reportType);
    setValidationResults(metrics.entityValidationResults);
    console.log("Metrics:", metrics);
  };

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

          {/* Reminder for confirmation */}
          <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
            <h3>Reminder</h3>
            <p>
              Before submitting your report in the regulator portal, ensure that
              all entity information is up-to-date and confirmed.
            </p>
          </Paper>

          {/* Report Type Selection */}
          <FormControl fullWidth>
            <InputLabel id="report-type-select-label">Report Type</InputLabel>
            <Select
              labelId="report-type-select-label"
              value={reportType}
              onChange={handleReportTypeChange}
            >
              <MenuItem value="Standard PTR">Standard PTR</MenuItem>
              <MenuItem value="AASB 8">Modified PTR - AASB 8</MenuItem>
              <MenuItem value="Nil Reporter">
                Modified PTR - Nil Reporter
              </MenuItem>
              <MenuItem value="External Administration">
                Modified PTR - External Administration
              </MenuItem>
              <MenuItem value="Nominated Entity">
                Modified PTR - Nominated Entity
              </MenuItem>
            </Select>
          </FormControl>

          {/* Validation Results */}
          {validationResults.length > 0 && (
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
              <h3>Validation Results</h3>
              <ul>
                {validationResults.map((result, index) => (
                  <li key={index}>
                    ABN Valid: {result.isValidABN ? "Yes" : "No"}, ACN Valid:{" "}
                    {result.isValidACN ? "Yes" : "No"}, ARBN Valid:{" "}
                    {result.isValidARBN ? "Yes" : "No"}
                  </li>
                ))}
              </ul>
            </Paper>
          )}

          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </Form>
      </Paper>
    </Box>
  );
}
