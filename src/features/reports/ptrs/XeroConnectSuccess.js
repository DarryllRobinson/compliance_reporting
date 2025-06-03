import { useEffect, useState } from "react";
import { useNavigate } from "react-router"; // react-router, not react-router-dom
import {
  Button,
  Typography,
  Container,
  Box,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { xeroService } from "../../../services/xero/xero";

export const XeroConnectSuccess = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [progressMessage, setProgressMessage] = useState("");
  const [progressOpen, setProgressOpen] = useState(false);
  const [progressHistory, setProgressHistory] = useState([]);

  useEffect(() => {
    const ws = xeroService.subscribeToProgressUpdates(
      (data) => {
        setProgressHistory((prev) => [...prev, data.message || ""]);
        setProgressMessage(data.message || "");
        setProgressOpen(true);
      },
      () => {
        setProgressOpen(false);
      },
      () => {
        setProgressOpen(false);
      }
    );

    return () => {
      ws.close();
    };
  }, []);

  const handleDashboardRedirect = () => {
    // Redirect user to their dashboard
    navigate("/user/dashboard");
  };

  const handleSnackbarClose = () => {
    setProgressOpen(false);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: theme.spacing(8),
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        {progressMessage || "Connecting to Xero..."}
      </Typography>
      <Typography variant="body1" paragraph>
        {progressMessage
          ? progressMessage
          : "Waiting for Xero to finish processing. This may take a few minutes depending on how much data you have!"}
      </Typography>
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDashboardRedirect}
        >
          Go to Dashboard
        </Button>
      </Box>
      {progressOpen && (
        <Box mt={4}>
          <CircularProgress />
        </Box>
      )}
      {progressHistory.length > 0 && (
        <Box mt={4} sx={{ textAlign: "left" }}>
          {[...progressHistory].reverse().map((msg, idx) => (
            <Typography key={idx} variant="body2">
              {msg}
            </Typography>
          ))}
        </Box>
      )}
      <Snackbar
        open={progressOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={progressMessage}
      />
    </Container>
  );
};

export default XeroConnectSuccess;
