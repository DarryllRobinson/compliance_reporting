import React from "react";
import { Box, Paper, TextField, Button, Grid, useTheme } from "@mui/material";
import { Form, redirect } from "react-router";
import { reportService, userService } from "../../../services";

export async function createReportAction({ request, context, params }) {
  const { alertContext, reportContext } = context;
  const formData = await request.formData();
  let reportDetails = Object.fromEntries(formData);

  // Removed date validation logic

  reportDetails = {
    ...reportDetails,
    code: params.code,
    reportName: "Payment Times Reporting Scheme",
    reportStatus: "Created",
    createdBy: userService.userValue.id,
    clientId: userService.userValue.clientId,
  };

  // console.log("createReport reportDetails:", reportDetails);

  // Save the report details to the database
  try {
    const report = await reportService.create(reportDetails);
    if (!report) alertContext.sendAlert("error", "Report not created");

    // Update the ReportContext with the new report details
    reportDetails = {
      ...reportDetails,
      reportId: report.id,
    };
    if (reportContext && reportContext.setReportDetails) {
      reportContext.setReportDetails(reportDetails);
    }
    // console.log("Final createReport reportDetails:", reportDetails);

    // Alert the user about the successful creation
    alertContext.sendAlert("success", "Report created successfully");
    // Redirect to the external data source connection page
    return redirect(`/reports/${params.code}/${report.id}/connect`, {
      state: { reportDetails },
    });
  } catch (error) {
    alertContext.sendAlert("error", error || "Error creating report");
    console.error("Error creating report:", error);
  }
}

export default function CreateReport() {
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
        <Form method="post">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                label="Reporting Period"
                fullWidth
                defaultValue="1 July 2024 - 31 December 2024"
                SelectProps={{ native: true }}
              >
                <option value="1 July 2024 - 31 December 2024">
                  1 July 2024 - 31 December 2024
                </option>
              </TextField>
              {/* Hidden fields to still pass start and end dates */}
              <input
                type="hidden"
                name="ReportingPeriodStartDate"
                value="2024-07-01"
              />
              <input
                type="hidden"
                name="ReportingPeriodEndDate"
                value="2024-12-31"
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
