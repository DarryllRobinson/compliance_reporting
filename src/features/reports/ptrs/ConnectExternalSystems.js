import { useState } from "react";
import { xeroService } from "../../../services";
import {
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
  Tooltip,
  Paper,
} from "@mui/material";
import { useLocation } from "react-router"; // Import useNavigate
import { userService } from "../../../services";

export default function ConnectExternalSystems() {
  const { state } = useLocation();
  const reportDetails = state?.reportDetails || {};
  const [alert] = useState(null);
  const [progressMessage, setProgressMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleXeroConnect = async () => {
    setIsLoading(true);
    setProgressMessage("Connecting to Xero...");
    try {
      const data = await xeroService.connect({
        reportId: reportDetails.reportId,
        createdBy: userService.userValue.id,
        startDate: reportDetails.ReportingPeriodStartDate,
        endDate: reportDetails.ReportingPeriodEndDate,
      });

      const authUrl = data.authUrl;

      if (!authUrl) {
        throw new Error("Authorisation URL not provided by server");
      }

      // Store callbackData before redirect
      const callbackData = {
        clientId: userService.userValue.clientId,
        reportId: reportDetails.reportId,
        createdBy: userService.userValue.id,
        startDate: reportDetails.ReportingPeriodStartDate,
        endDate: reportDetails.ReportingPeriodEndDate,
      };

      localStorage.setItem("callbackData", JSON.stringify(callbackData));

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error connecting to Xero:", error);
      setProgressMessage("Error occurred while connecting to Xero.");
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Connect to External Data Source
      </Typography>
      {alert && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}
      <Paper elevation={3} sx={{ padding: 2, mt: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleXeroConnect}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Xero"}
          </Button>
          <Tooltip title="Coming soon">
            <span>
              <Button variant="contained" color="secondary" disabled>
                MYOB
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Coming soon">
            <span>
              <Button variant="contained" color="secondary" disabled>
                JDE
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Coming soon">
            <span>
              <Button variant="contained" color="secondary" disabled>
                Upload data extract
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Paper>

      <Snackbar
        open={!!progressMessage}
        message={progressMessage}
        autoHideDuration={3000}
        onClose={() => setProgressMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
