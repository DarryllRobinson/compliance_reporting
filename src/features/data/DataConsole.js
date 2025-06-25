import { useReportContext } from "../../context";
import { useState, useEffect } from "react";
import { Box, Typography, Divider, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CreateReport from "../reports/ptrs/CreateReport";
import ConnectExternalSystems from "../reports/ptrs/ConnectExternalSystems";
import DataUploadReview from "../reports/ptrs/DataUploadReview";
import { tcpService } from "../../services/";

export default function DataConsole() {
  const theme = useTheme();
  const { reportDetails, refreshReports } = useReportContext();

  // --- Add state for records ---
  const [errorRecords, setErrorRecords] = useState([]);
  const [validPreview, setValidPreview] = useState([]);

  const updateCachedRecords = (errors, valid) => {
    setErrorRecords(errors);
    setValidPreview(valid);
    const cacheKey = `tcp_records_${reportDetails?.id}`;
    sessionStorage.setItem(cacheKey, JSON.stringify({ errors, valid }));
  };

  // --- Load records for reportDetails?.id ---
  useEffect(() => {
    if (!reportDetails?.id) return;

    const cacheKey = `tcp_records_${reportDetails?.id}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      const parsed = JSON.parse(cached);
      setErrorRecords(parsed.errors || []);
      setValidPreview(parsed.valid || []);
      return;
    }

    Promise.all([
      tcpService.getTcpByReportId(reportDetails?.id),
      tcpService.getErrorsByReportId(reportDetails?.id),
    ])
      .then(([valid, errors]) => {
        setValidPreview(valid);
        setErrorRecords(errors);
        sessionStorage.setItem(cacheKey, JSON.stringify({ errors, valid }));
      })
      .catch((err) => {
        console.error("Error fetching records:", err);
      });
  }, [reportDetails?.id]);

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
          onSuccess={refreshReports}
          onDelete={refreshReports}
        />
      </Paper>

      <Paper elevation={3} sx={{ padding: theme.spacing(3) }}>
        <Typography variant="h6" gutterBottom>
          Data Management
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Ingest, validate and enrich datasets linked to your created report.
        </Typography>

        <Box sx={{ mt: 2 }}>
          <ConnectExternalSystems />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Imported Datasets
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Below is a placeholder for datasets you’ve uploaded or fetched.
          </Typography>
          <DataUploadReview
            errors={errorRecords}
            validRecordsPreview={validPreview}
            onErrorsUpdated={(updatedErrors) =>
              updateCachedRecords(updatedErrors, validPreview)
            }
            onRecordsUpdated={updateCachedRecords}
          />
        </Box>
      </Paper>
    </Box>
  );
}
