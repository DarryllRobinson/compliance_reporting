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
import { calculateInvoiceMetrics } from "../../utils/invoiceCalculations";

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

// Placeholder email service function
const sendEmailToApprover = async (approverEmail, reportDetails) => {
  try {
    // Replace this with a real email service integration
    console.log(`Sending email to ${approverEmail}...`);
    console.log("Report Details:", reportDetails);
    // Simulate email sending
    return Promise.resolve("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    return Promise.reject("Failed to send email");
  }
};

export default function CreateReport() {
  const [reportType, setReportType] = useState("Standard PTR");
  const [isModifiedReport, setIsModifiedReport] = useState(false); // Track if the report is modified
  const [paymentPractices, setPaymentPractices] = useState({
    supplyChainFinance: "No",
    procurementFees: "No",
    legalObligations: "No",
  });
  const [validationResults, setValidationResults] = useState([]);
  const [errors, setErrors] = useState({});

  const handleReportTypeChange = (event) => {
    const selectedReportType = event.target.value;
    setReportType(selectedReportType);

    // Determine if the report is a modified report
    const modifiedReportTypes = [
      "AASB 8",
      "Nil Reporter",
      "External Administration",
      "Nominated Entity",
    ];
    setIsModifiedReport(modifiedReportTypes.includes(selectedReportType));
  };

  const handlePaymentPracticesChange = (field, value) => {
    setPaymentPractices((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const startDate = formData.get("ReportingPeriodStartDate");
    const endDate = formData.get("ReportingPeriodEndDate");

    // TODO: Add approver info
    // const approvalDate = formData.get("ApprovalDate");
    // const approverGivenName = formData.get("ApproverGivenName");
    // const approverFamilyName = formData.get("ApproverFamilyName");
    // const approverEmail = formData.get("ApproverEmail");

    const periodErrors = validateReportingPeriod(
      startDate,
      endDate
      // approvalDate
    );
    if (Object.keys(periodErrors).length > 0) {
      setErrors(periodErrors);
      return;
    }

    // Pass the isModifiedReport parameter to calculateInvoiceMetrics
    const metrics = calculateInvoiceMetrics(reportType, isModifiedReport);
    setValidationResults(metrics.entityValidationResults);

    // Prepare report details for the email
    const reportDetails = {
      reportType,
      startDate,
      endDate,
      // approvalDate,
      // approverName: `${approverGivenName} ${approverFamilyName}`,
      paymentPractices,
    };

    // Send email to the approver
    // try {
    //   const emailResponse = await sendEmailToApprover(
    //     approverEmail,
    //     reportDetails
    //   );
    //   console.log(emailResponse);
    // } catch (error) {
    //   console.error("Failed to send email to approver:", error);
    // }

    console.log("Report Details:", reportDetails);
  };

  const location = useLocation();
  const { reportName, reportList } = location.state || {};
  const theme = useTheme();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const defaultDate = sixMonthsAgo.toISOString().split("T")[0];

  // const entityDetails = {
  //   entityName: "Example Entity Pty Ltd", // Replace with actual data if available
  //   entityABN: "12345678901",
  //   entityACN: "123456789",
  //   entityARBN: "987654321",
  // };

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
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Grid container spacing={2}>
            {/* <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="report-select-label">Report Name</InputLabel>
                <Select
                  labelId="report-select-label"
                  name="reportName"
                  id="report"
                  label="List of Reports"
                  defaultValue={reportName || ""}
                  // required
                >
                  {reportList?.map((report) => (
                    <MenuItem key={report.id} value={report.name}>
                      {report.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
            <Grid item xs={6}>
              <TextField
                label="Reporting Period Start Date"
                name="ReportingPeriodStartDate"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                defaultValue={defaultDate || ""}
                error={!!errors.startDate}
                helperText={errors.startDate}
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
                error={!!errors.endDate}
                helperText={errors.endDate}
              />
            </Grid>
            {errors.dateRange && (
              <Grid item xs={12}>
                <p style={{ color: "red" }}>{errors.dateRange}</p>
              </Grid>
            )}

            {/* Approver Fields */}
            {/* <Grid item xs={6}>
              <TextField
                label="Approving Responsible Member Given Name"
                name="ApproverGivenName"
                type="text"
                fullWidth
                required
                inputProps={{ maxLength: 1000 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Approving Responsible Member Family Name"
                name="ApproverFamilyName"
                type="text"
                fullWidth
                required
                inputProps={{ maxLength: 1000 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Responsible Member Approval Date"
                name="ApprovalDate"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                error={!!errors.approvalDate}
                helperText={errors.approvalDate}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Approver Email"
                name="ApproverEmail"
                type="email"
                fullWidth
                required
              />
            </Grid> */}

            {/* Payment Practices */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="supply-chain-finance-label">
                  Did the entity offer supply chain finance arrangements during
                  the reporting period?
                </InputLabel>
                <Select
                  labelId="supply-chain-finance-label"
                  value={paymentPractices.supplyChainFinance}
                  onChange={(e) =>
                    handlePaymentPracticesChange(
                      "supplyChainFinance",
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="procurement-fees-label">
                  Did the entity charge fees as part of the procurement process?
                </InputLabel>
                <Select
                  labelId="procurement-fees-label"
                  value={paymentPractices.procurementFees}
                  onChange={(e) =>
                    handlePaymentPracticesChange(
                      "procurementFees",
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="legal-obligations-label">
                  Do any Australian laws, voluntary codes, or agreements impose
                  requirements on the entity's payment times and practices to
                  small businesses?
                </InputLabel>
                <Select
                  labelId="legal-obligations-label"
                  value={paymentPractices.legalObligations}
                  onChange={(e) =>
                    handlePaymentPracticesChange(
                      "legalObligations",
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Entity Details */}
          {/* <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
            <h3>Entity Details</h3>
            <p>
              <strong>Entity Name:</strong> {entityDetails.entityName}
            </p>
            <p>
              <strong>Entity ABN:</strong> {entityDetails.entityABN}
            </p>
            <p>
              <strong>Entity ACN:</strong> {entityDetails.entityACN}
            </p>
            <p>
              <strong>Entity ARBN:</strong> {entityDetails.entityARBN}
            </p>
          </Paper> */}

          {/* Reminder for confirmation */}
          <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
            <h3>Reminder</h3>
            <p>
              Before submitting your report in the regulator portal, ensure that
              all entity information is up-to-date and confirmed.
            </p>
          </Paper>

          {/* Report Type Selection */}
          {/* <FormControl fullWidth>
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
          </FormControl> */}

          {/* Validation Results */}
          {/* {validationResults.length > 0 && (
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
          )} */}

          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Form>
      </Paper>
    </Box>
  );
}
