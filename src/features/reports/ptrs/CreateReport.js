import React from "react";
import { Box, Paper, TextField, Button, Grid, useTheme } from "@mui/material";
import { useActionData, Form } from "react-router";

export default function CreateReport() {
  const theme = useTheme();
  const actionData = useActionData(); // Access validation errors returned by the action

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
