import React, { useState } from "react";
import { Form, redirect, useLoaderData, useLocation } from "react-router";
import {
  Box,
  Button,
  TextField,
  useTheme,
  Paper,
  Alert,
  Grid,
} from "@mui/material";
import { userService } from "../users/user.service";
import { reportService } from "./report.service";

export async function reportCreateLoader() {
  const user = await userService.refreshToken();
  if (!user) {
    throw new Response("userCreateLoader refreshToken problem", {
      status: 500,
    });
  }
}

export async function reportCreateAction({ request }) {
  await userService.refreshToken();
  const formData = await request.formData();
  let reportDetails = Object.fromEntries(formData);
  reportDetails = {
    ...reportDetails,
    reportStatus: "Created",
    createdBy: userService.userValue.id,
    clientId: userService.userValue.clientId,
  };

  try {
    const report = await reportService.create(reportDetails);
    return redirect("/xero-credentials", { state: { report } });
  } catch (error) {
    console.error("Error creating report:", error);
  }
}

export default function ReportCreate() {
  const location = useLocation();
  const { reportName } = location.state || {};
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
              <TextField
                name="reportName"
                type="string"
                fullWidth
                disabled
                value={reportName || ""}
              />
              <input type="hidden" name="reportName" value={reportName || ""} />
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
