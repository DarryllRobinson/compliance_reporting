import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Typography,
  Button,
  TextField,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
} from "@mui/material";
import { clientService, userService } from "../../services";
import { Alert } from "@mui/material";

export default function UserCreate() {
  const theme = useTheme();
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [storedClientDetails, setStoredClientDetails] = useState({});
  const [selectedRole, setSelectedRole] = useState("Admin"); // Controlled state for role
  const [selectedClient, setSelectedClient] = useState(""); // Controlled state for client

  useEffect(() => {
    async function fetchClients() {
      try {
        const result = await clientService.getAll();
        setClients(result || []);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
        setError("Unable to load client list.");
      }
    }
    fetchClients();
  }, []);

  useEffect(() => {
    // Retrieve client details from localStorage
    const clientDetails =
      JSON.parse(localStorage.getItem("clientDetails")) || {};
    setStoredClientDetails(clientDetails);

    // Set initial client selection if available
    const initialClient = clients.find(
      (client) => client.businessName === clientDetails.businessName
    );
    if (initialClient) {
      setSelectedClient(initialClient.id);
    }

    // Clear localStorage after retrieving the details
    localStorage.removeItem("clientDetails");
  }, [clients]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let userDetails = Object.fromEntries(formData);
    userDetails = { ...userDetails, active: true };

    try {
      await userService.register(userDetails);
      setAlert({ type: "success", message: "User created successfully." });
      navigate("/users");
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Error creating user.",
      });
      console.error("Error creating user:", error);
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
        padding: theme.spacing(2),
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: theme.spacing(4),
          maxWidth: 800,
          width: "100%",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Create a New User
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
        <form
          onSubmit={handleSubmit}
          id="create-user-form"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing(2),
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="First Name"
                name="firstName"
                type="string"
                fullWidth
                required
                defaultValue={storedClientDetails.contactFirst || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last Name"
                name="lastName"
                type="string"
                fullWidth
                required
                defaultValue={storedClientDetails.contactLast || ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="string"
                fullWidth
                required
                defaultValue={storedClientDetails.contactEmail || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Phone"
                name="phone"
                type="string"
                fullWidth
                required
                defaultValue={storedClientDetails.contactPhone || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Position"
                name="position"
                type="string"
                fullWidth
                required
                defaultValue={storedClientDetails.contactPosition || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                required
                defaultValue="nnnhhh"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                fullWidth
                required
                defaultValue="nnnhhh"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  name="role"
                  id="role"
                  label="List of Roles"
                  value={selectedRole} // Controlled value
                  onChange={(e) => setSelectedRole(e.target.value)} // Update state
                  required
                >
                  <MenuItem value="Submitter">Submitter</MenuItem>
                  <MenuItem value="Reviewer">Reviewer</MenuItem>
                  <MenuItem value="Approver">Approver</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="client-select-label">
                  Client Selection
                </InputLabel>
                <Select
                  labelId="client-select-label"
                  name="clientId"
                  id="clientId"
                  label="List of Clients"
                  value={selectedClient} // Controlled value
                  onChange={(e) => setSelectedClient(e.target.value)} // Update state
                  required
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.businessName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: theme.spacing(2) }}
          >
            Create User
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
