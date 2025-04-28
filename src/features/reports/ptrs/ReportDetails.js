import React from "react";
import { Box, useTheme, TextField, Grid, Paper } from "@mui/material";
import { Form } from "react-router";

export default function ReportDetails() {
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
      </Paper>
    </Box>
  );
}
