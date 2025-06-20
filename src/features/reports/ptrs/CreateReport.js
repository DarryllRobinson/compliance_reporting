import {
  Box,
  TextField,
  Button,
  Grid,
  useTheme,
  Typography,
} from "@mui/material";
import { useParams } from "react-router";
import { reportService, userService } from "../../../services";
import { useAlert } from "../../../context/AlertContext";
import { useState } from "react";

export default function CreateReport({
  onSuccess,
  onDelete,
  onUpdate,
  reportDetails,
}) {
  const theme = useTheme();
  const { code } = useParams();
  const { showAlert } = useAlert();

  const [activeReport, setActiveReport] = useState(() => {
    const storedReport = localStorage.getItem("activeReportDetails");
    return storedReport ? JSON.parse(storedReport) : null;
  });

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
        showAlert("Report not created", "error");
        return;
      }

      setActiveReport(report);

      showAlert("Report created successfully", "success");
      if (onSuccess) onSuccess(report);
    } catch (error) {
      showAlert(error.message || "Error creating report", "error");
      console.error("Error creating report:", error);
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await reportService.delete(reportId);
      setActiveReport(null);
      showAlert("Report deleted successfully", "success");
      if (onDelete) onDelete(); // This should trigger setReportDetails(null) in the parent
    } catch (error) {
      showAlert(error.message || "Error deleting report", "error");
      console.error("Error deleting report:", error);
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6} display="flex" alignItems="center">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: 400,
          }}
        >
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!!activeReport}
              >
                Create Report
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid item xs={12} md={6} display="flex" alignItems="center">
        {activeReport && (
          <Box
            sx={{
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              padding: 3,
              boxShadow: 3,
              width: "100%",
            }}
          >
            <Typography variant="h6" gutterBottom>
              ✅ Report Created
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Report ID:</strong> {activeReport.id}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Start Date:</strong>{" "}
              {activeReport.ReportingPeriodStartDate}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>End Date:</strong> {activeReport.ReportingPeriodEndDate}
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDeleteReport(activeReport.id)}
            >
              Delete Report
            </Button>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
