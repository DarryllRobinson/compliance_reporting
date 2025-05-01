import React, { useState } from "react";
import {
  Box,
  Paper,
  Button,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { xeroService } from "../../../services";

export default function ConnectExternalSystems() {
  const theme = useTheme();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await xeroService.connect();
      if (response.success) {
        setIsConnected(true);
      } else {
        setError("Failed to connect to Xero. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while connecting to Xero.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await xeroService.fetchData();
      console.log("Fetched data:", data);
      // Process and store the fetched data as needed
    } catch (err) {
      setError("An error occurred while fetching data from Xero.");
      console.error(err);
    } finally {
      setIsLoading(false);
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
          maxWidth: 600,
          width: "100%",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Connect External Systems
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {isConnected
                ? "You are connected to Xero."
                : "You are not connected to Xero."}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConnect}
              disabled={isConnected}
              sx={{ mb: 2 }}
            >
              {isConnected ? "Connected" : "Connect to Xero"}
            </Button>
            {isConnected && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleFetchData}
              >
                Fetch Data
              </Button>
            )}
            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}
