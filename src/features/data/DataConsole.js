import { useReportContext } from "../../context";
import { useState, useEffect } from "react";
import { Box, Typography, Divider, Button, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";
import CreateReport from "../reports/ptrs/CreateReport";
import ConnectExternalSystems from "../reports/ptrs/ConnectExternalSystems";
import DataUploadReview from "../reports/ptrs/DataUploadReview";
import { tcpService } from "../../services/";

export default function DataConsole() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { reports, reportDetails, setReportDetails, refreshReports } =
    useReportContext();
  const [uploadResults, setUploadResults] = useState(null);

  useEffect(() => {
    if (!reportDetails) {
      const storedReport = localStorage.getItem("activeReportDetails");
      if (storedReport) {
        try {
          setReportDetails(JSON.parse(storedReport));
        } catch (e) {
          console.error("Failed to parse stored report details:", e);
        }
      } else {
        refreshReports();
      }
    }
    if (reportDetails) {
      Promise.all([
        tcpService.getAllByReportId(reportDetails.id),
        tcpService.getErrorsByReportId(reportDetails.id),
      ])
        .then(([validRecords, errorRecords]) => {
          setUploadResults({
            validRecordsPreview: validRecords || [],
            errors: errorRecords || [],
          });
        })
        .catch((err) => {
          console.error("Failed to load TCP datasets or errors:", err);
        });
    }
  }, [reportDetails, setReportDetails, refreshReports]);

  return (
    <Box
      sx={{
        padding: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        PTRS Data Console
      </Typography>
      <Typography variant="body1" gutterBottom>
        Start by creating a report container, then prepare your dataset for
        import.
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Paper
        elevation={3}
        sx={{ padding: theme.spacing(3), marginBottom: theme.spacing(4) }}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Create Report Container
        </Typography>
        <CreateReport
          reportDetails={reportDetails}
          onSuccess={(newReport) => {
            refreshReports();
            setReportDetails(newReport);
          }}
          onUpdate={(updatedReport) => {
            refreshReports();
            setReportDetails(updatedReport);
          }}
          onDelete={() => {
            refreshReports();
            setReportDetails(null);
            localStorage.removeItem("activeReportDetails");
          }}
        />
      </Paper>

      {reportDetails && (
        <Paper elevation={3} sx={{ padding: theme.spacing(3) }}>
          <Typography variant="h6" gutterBottom>
            Data Management
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Ingest, validate and enrich datasets linked to your created report.
          </Typography>

          <Box sx={{ mt: 2 }}>
            <ConnectExternalSystems
              reportDetails={reportDetails}
              onUploadComplete={(results) => setUploadResults(results)}
            />
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Imported Datasets
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Below is a placeholder for datasets you’ve uploaded or fetched.
            </Typography>
            <Paper sx={{ mt: 2, padding: 2, textAlign: "center" }}>
              {uploadResults ? (
                <DataUploadReview
                  errors={uploadResults.errors}
                  validRecordsPreview={uploadResults.validRecordsPreview}
                  onErrorsUpdated={(newErrors) =>
                    setUploadResults((prev) => ({ ...prev, errors: newErrors }))
                  }
                />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No datasets available yet.
                </Typography>
              )}
            </Paper>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
