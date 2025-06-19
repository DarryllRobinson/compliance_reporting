import { useState } from "react";
import { Box, Typography, Divider, Button, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";
import CreateReport from "../reports/ptrs/CreateReport";

export default function DataConsole() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [reportDetails, setReportDetails] = useState(null);
  console.log("DataConsole rendered with reportDetails:", reportDetails);

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
          onSuccess={(details) => setReportDetails(details)}
          onUpdate={(details) => setReportDetails(details)}
          onDelete={() => setReportDetails(null)}
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

          <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                navigate("/data/import", {
                  state: { reportId: reportDetails.reportId },
                })
              }
            >
              Upload CSV
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() =>
                navigate("/xero/connect", {
                  state: { reportId: reportDetails.reportId },
                })
              }
            >
              Fetch from Xero
            </Button>
            <Button variant="outlined" color="secondary" disabled>
              Run ABN Lookup (Coming Soon)
            </Button>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Imported Datasets
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Below is a placeholder for datasets you’ve uploaded or fetched.
            </Typography>
            <Paper sx={{ mt: 2, padding: 2, textAlign: "center" }}>
              <Typography variant="body2" color="textSecondary">
                No datasets available yet.
              </Typography>
            </Paper>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
