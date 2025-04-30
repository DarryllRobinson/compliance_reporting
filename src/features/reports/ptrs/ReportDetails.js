import React, { useState } from "react";
import { Box, useTheme, TextField, Grid, Paper } from "@mui/material";

export default function ReportDetails() {
  const [errors, setErrors] = useState({});
  const theme = useTheme();

  const today = new Date().toISOString().split("T")[0];
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const defaultDate = sixMonthsAgo.toISOString().split("T")[0];

  function handleBlur(event) {
    const { name, value } = event.target;
    const startDate = document.querySelector(
      "[name='ReportingPeriodStartDate']"
    ).value;
    const endDate = document.querySelector(
      "[name='ReportingPeriodEndDate']"
    ).value;

    const today = new Date();
    const minStartDate = new Date("2024-07-01");

    // Validation logic
    if (name === "ReportingPeriodStartDate" && !value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Start date is required.",
      }));
    } else if (name === "ReportingPeriodEndDate" && !value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "End date is required.",
      }));
    } else if (
      name === "ReportingPeriodStartDate" &&
      new Date(value) < minStartDate
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Start date cannot be before 1 July 2024.",
      }));
    } else if (name === "ReportingPeriodEndDate" && new Date(value) >= today) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]:
          "End date cannot be the same as or later than the date of submission.",
      }));
    } else if (
      name === "ReportingPeriodEndDate" &&
      new Date(startDate) >= new Date(endDate)
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Start date must be earlier than the end date.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null, // Clear the error if validation passes
      }));
    }
  }

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
              onBlur={handleBlur}
              error={!!errors.ReportingPeriodStartDate}
              helperText={errors.ReportingPeriodStartDate || ""}
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
              onBlur={handleBlur}
              error={!!errors.ReportingPeriodEndDate}
              helperText={errors.ReportingPeriodEndDate || ""}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
