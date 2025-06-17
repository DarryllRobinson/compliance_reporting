import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router"; // react-router, not react-router-dom
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
  const { reportId } = useParams();

  const [progressMessage, setProgressMessage] = useState("");
  const [progressOpen, setProgressOpen] = useState(false);
  const [progressHistory, setProgressHistory] = useState([]);
  const [missingInvoices, setMissingInvoices] = useState([]);

  const progressRef = useRef(null);

  useEffect(() => {
    const ws = xeroService.subscribeToProgressUpdates(
      (data) => {
        setProgressHistory((prev) => {
          const newHistory = [...prev, data.message || ""];
          return newHistory;
        });
        setProgressMessage(data.message || "");
        setProgressOpen(true);
        if (data.missingInvoices) {
          setMissingInvoices(data.missingInvoices);
        }
        if (progressRef.current) {
          progressRef.current.scrollTop = progressRef.current.scrollHeight;
        }
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

  useEffect(() => {
    if (
      progressMessage === "Transformed TCP records saved successfully" &&
      reportId
    ) {
      const timeout = setTimeout(() => {
        navigate(`/reports/ptrs/${reportId}`);
      }, 2000); // optional delay to allow user to see the success message
      return () => clearTimeout(timeout);
    }
  }, [progressMessage, reportId, navigate]);

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
      {/* <Typography variant="h4" gutterBottom>
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
      )} */}
      {missingInvoices.length > 0 && (
        <Box
          mt={4}
          sx={{
            fontFamily: "monospace",
            backgroundColor: "#1e1e1e",
            color: "#d4d4d4",
            padding: 2,
            borderRadius: 1,
            whiteSpace: "pre-wrap",
            overflowY: "auto",
            maxHeight: "300px",
            boxShadow: 2,
            border: "1px solid #333",
            textAlign: "left",
          }}
        >
          {`⚠️  Some invoices could not be retrieved:\n\n${missingInvoices
            .map((inv, i) => `  ${i + 1}. ID: ${inv.invoiceId} — ${inv.reason}`)
            .join("\n")}`}
        </Box>
      )}
      {progressHistory.length > 0 && (
        <Box
          ref={progressRef}
          mt={4}
          sx={{
            backgroundColor: "#1e1e1e",
            color: "#d4d4d4",
            fontFamily: "monospace",
            fontSize: "14px",
            padding: "1rem",
            borderRadius: "4px",
            height: "300px",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            display: "flex",
            flexDirection: "column",
            scrollBehavior: "smooth",
          }}
        >
          {progressHistory.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </Box>
      )}
      {/* <Snackbar
        open={progressOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={progressMessage}
      /> */}
    </Container>
  );
};

export default XeroConnectSuccess;
