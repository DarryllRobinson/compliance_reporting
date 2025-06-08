import { useState } from "react";
import { Box, Paper, TextField, Button, Grid, useTheme } from "@mui/material";
import { Alert } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { reportService, userService } from "../../../services";

export default function CreateReport() {
  const theme = useTheme();
  const { code } = useParams();
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let newReportDetails = Object.fromEntries(formData);

    newReportDetails = {
      ...newReportDetails,
      code: code,
      reportName: "Payment Times Reporting Scheme",
      reportStatus: "Created",
      currentStep: 0,
      createdBy: userService.userValue.id,
      clientId: userService.userValue.clientId,
    };

    try {
      const report = await reportService.create(newReportDetails);
      if (!report) {
        setAlert({ type: "error", message: "Report not created" });
        return;
      }

      const updatedReportDetails = { ...newReportDetails, reportId: report.id };

      setAlert({ type: "success", message: "Report created successfully" });
      navigate(`/reports/${code}/${report.id}/connect`, {
        state: { reportDetails: updatedReportDetails },
      });
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Error creating report",
      });
      console.error("Error creating report:", error);
    }
  };

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
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
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
        </form>
      </Paper>
    </Box>
  );
}
