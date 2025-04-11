import React from "react";
import { useNavigate } from "react-router"; // Import useNavigate
import { userService } from "./user.service";
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

export async function usersLoader() {
  const user = await userService.refreshToken();
  if (!user) {
    throw new Response("usersLoader refreshToken problem", { status: 500 });
  }
  const users = await userService.getAll();
  if (!users) {
    throw new Response("usersLoader getAll problem", { status: 500 });
  }
  return { users };
}

export default function Users() {
  const { users } = useLoaderData();
  const theme = useTheme();
  const navigate = useNavigate(); // Initialise navigate

  if (!users || users.length === 0) {
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
            No Users Found
          </Typography>
          <Button
            variant="contained"
            color="primary" // Reverted to US English
            onClick={() => navigate("/users/register")} // Navigate to register page
            sx={{ mt: 2 }}
          >
            Create a New User
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
          Users
        </Typography>
        <Typography variant="body1" gutterBottom>
          This is the Users page. Below is the list of registered users.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/users/create")} // Navigate to create page
          sx={{ mb: 2 }}
        >
          Create a New User
        </Button>
        <List>
          {users.map((user) => (
            <ListItem
              key={user.id}
              sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
            >
              <ListItemText
                primary={user.firstName + " " + user.lastName}
                secondary={`Role: ${user.role} | Position: ${user.position} | Email: ${user.email} | Phone: ${user.phone}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
