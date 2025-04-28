import React, { useState } from "react";
import { userService } from "../../users/user.service";
import { reportService } from "../report.service";
import { Form, redirect } from "react-router";
import { Box, Button, Grid, Paper, useTheme } from "@mui/material";
import XeroCredentials from "../XeroCredentials";
import ReportDetails from "./ReportDetails";

export async function createPtrsAction({ request, params, context }) {
  const { alertContext, reportContext } = context;

  const formData = await request.formData();
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
