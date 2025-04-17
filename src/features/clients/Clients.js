import React, { useEffect } from "react";
import { useNavigate } from "react-router"; // Import useNavigate
import { userService } from "../users/user.service";
import { clientService } from "./client.service";
import { useLoaderData } from "react-router";
import {
  useTheme,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

export async function clientsLoader() {
  const user = userService.userValue; // Get the current user
  // const user = await userService.refreshToken();
  if (!user) {
    throw new Response("clientsLoader user problem", { status: 500 });
  }
  //   const user = userService.userValue; // Get the current user
  const clients = await clientService.getAll();
  if (!clients) {
    throw new Response("clientsLoader clients problem", { status: 500 });
  }
  return { clients };
}

export default function Clients() {
  // const [user, setUser] = React.useState({});

  // useEffect(() => {
  //   const subscription = userService.user.subscribe((x) => setUser(x));
  //   return () => subscription.unsubscribe();
  // }, []);
  const { clients } = useLoaderData();
  const theme = useTheme();
  const navigate = useNavigate(); // Initialize navigate

  if (!clients || clients.length === 0) {
    return (
      <Box
        sx={{
          padding: 3,
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            maxWidth: 800,
            margin: "0 auto",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h4" gutterBottom>
            No Clients Found
          </Typography>
          <Button
            variant="contained"
            color="primary" // Reverted to US English
            onClick={() => navigate("/clients/register")} // Navigate to register page
            sx={{ mt: 2 }}
          >
            Register a New Client
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          maxWidth: 800,
          margin: "0 auto",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Clients
        </Typography>
        <Typography variant="body1" gutterBottom>
          This is the Clients page. Below is the list of registered clients.
        </Typography>
        <Button
          variant="contained"
          color="primary" // Reverted to US English
          onClick={() => navigate("/clients/register")} // Navigate to register page
          sx={{ mb: 2 }}
        >
          Register a New Client
        </Button>
        <List>
          {clients.map((client) => (
            <ListItem
              key={client.id}
              sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
            >
              <ListItemText
                primary={client.clientName}
                secondary={`Email: ${client.contactEmail} | Phone: ${client.contactPhone}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
