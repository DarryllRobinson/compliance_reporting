import React, { useState, useEffect } from "react";
import { xeroService } from "../../../services/xero.service";
import ReviewRecords from "./ReviewRecords";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function ConnectExternalSystems() {
  const [credentials, setCredentials] = useState({
    clientId: "",
    clientSecret: "",
  });
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await xeroService.connect(credentials);
      if (response.success) {
        setIsConnected(true);
      } else {
        console.error("Failed to connect to Xero.");
      }
    } catch (error) {
      console.error("Error connecting to Xero:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      setIsLoading(true);
      xeroService
        .fetchData()
        .then((data) => setRecords(data))
        .catch((error) => console.error("Error fetching records:", error))
        .finally(() => setIsLoading(false));
    }
  }, [isConnected]);

  const handleSave = (tcpRecords) => {
    console.log("TCP Records:", tcpRecords);
    // Save the TCP records or pass them to the next step
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isConnected) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Connect to External Data Source
        </Typography>
        <TextField
          label="Client ID"
          name="clientId"
          fullWidth
          value={credentials.clientId}
          onChange={handleInputChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Client Secret"
          name="clientSecret"
          fullWidth
          type="password"
          value={credentials.clientSecret}
          onChange={handleInputChange}
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleConnect}>
          Connect
        </Button>
      </Box>
    );
  }

  return <ReviewRecords records={records} onSave={handleSave} />;
}
