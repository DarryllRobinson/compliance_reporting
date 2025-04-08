import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";

const XeroCredentials = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      setMessage("Xero credentials verified successfully.");
      setTimeout(() => navigate("/review-entity"), 1000); // Navigate to the next step
    } else {
      setMessage("Please provide valid credentials");
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Provide Xero Credentials
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
      {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default XeroCredentials;
