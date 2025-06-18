import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router"; // react-router, not react-router-dom
import { Typography, Container, Box, LinearProgress } from "@mui/material";
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
  const [progressData, setProgressData] = useState({
    current: 0,
    total: 0,
    eta: null,
  });
  const [retryCountdown, setRetryCountdown] = useState(null);

  useEffect(() => {
    let unsubscribe = null;
    try {
      unsubscribe = xeroService.subscribeToProgressUpdates((data) => {
        // console.log("Progress update received:", data);
        const { message, current, total, eta, retryDelay, status } = data;
        const isError = status === "error";
        const isWarning = status === "warn";

        if (retryDelay) {
          let seconds = retryDelay;
          setRetryCountdown(seconds);
          const countdownInterval = setInterval(() => {
            seconds--;
            setRetryCountdown(seconds);
            if (seconds <= 0) {
              clearInterval(countdownInterval);
              setRetryCountdown(null);
            }
          }, 1000);
        }

        setProgressHistory((prev) => [
          ...prev,
          isError
            ? `[ERROR] ${message}`
            : isWarning
              ? `[WARN] ${message}`
              : `[INFO] ${message}`,
        ]);
        setProgressMessage(message || "");
        setProgressOpen(true);
        setProgressData({
          current: current || 0,
          total: total || 0,
          eta: eta || null,
        });
      });
    } catch (err) {
      console.error("Failed to subscribe to progress updates:", err);
    }

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (
      progressMessage === "Transformed TCP records saved successfully" &&
      reportId
    ) {
      const timeout = setTimeout(() => {
        setProgressOpen(false);
        setProgressMessage("");
        setProgressHistory([]);
        // navigate(`/reports/ptrs/${reportId}`);
      }, 2000); // optional delay to allow user to see the success message
      return () => clearTimeout(timeout);
    }
  }, [progressMessage, reportId, navigate]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: theme.spacing(8),
        textAlign: "center",
        position: "relative",
      }}
    >
      {progressOpen && (
        <>
          <Typography
            variant="h6"
            gutterBottom
            color={
              progressMessage.includes("[ERROR]") ? "error" : "textPrimary"
            }
          >
            {progressMessage}
          </Typography>
          <Box mt={4}>
            <Typography variant="h6">
              Progress: {progressData.current} of {progressData.total}
              {progressData.eta && <> – ETA: {progressData.eta}</>}
            </Typography>
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                padding: 1,
                backgroundColor: "background.paper",
                minHeight: 10,
              }}
            >
              <LinearProgress
                variant="determinate"
                value={(progressData.current / progressData.total) * 100}
                sx={{
                  height: 10,
                  borderRadius: 1,
                  backgroundColor: theme.palette.divider,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "background.paper",
                  },
                }}
              />
            </Box>
            {retryCountdown !== null && !isNaN(retryCountdown) && (
              <Typography variant="body2" color="info.main" mt={1}>
                Retrying in {retryCountdown}s...
              </Typography>
            )}
          </Box>
          <Box
            mt={2}
            sx={{
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              padding: 1,
              borderRadius: 1,
              whiteSpace: "pre-wrap",
              overflowY: "auto",
              maxHeight: 150,
              fontFamily: "monospace",
              fontSize: 12,
              border: "1px solid #444",
              textAlign: "left",
            }}
          >
            {progressHistory.join("\n")}
          </Box>
        </>
      )}
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
    </Container>
  );
};

export default XeroConnectSuccess;
