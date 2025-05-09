import React from "react";
import { Form, redirect, useLoaderData } from "react-router";
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

export async function createUserLoader() {
  const clients = await clientService.getAll();
  if (!clients) {
    throw new Response("userCreateLoader clients problem", { status: 500 });
  }
  return { clients };
}

export async function createUserAction({ request, context }) {
  const { alertContext } = context;
  const formData = await request.formData();
  let userDetails = Object.fromEntries(formData);
  userDetails = { ...userDetails, active: true };
  try {
    await userService.register(userDetails);
    alertContext.sendAlert("success", "User created successfully.");
    return redirect("/users");
  } catch (error) {
    alertContext.sendAlert("error", error || "Error creating user.");
    console.error("Error creating user:", error);
  }
}

export default function UserCreate() {
  const theme = useTheme();
  const { clients } = useLoaderData();

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
        <Form
          method="post"
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
                defaultValue="Homer"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last Name"
                name="lastName"
                type="string"
                fullWidth
                required
                defaultValue="Simpson"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="string"
                fullWidth
                required
                defaultValue="darryllrobinson@icloud.com"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Phone"
                name="phone"
                type="string"
                fullWidth
                required
                defaultValue="0412345678"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Position"
                name="position"
                type="string"
                fullWidth
                required
                defaultValue="Manager"
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
                  defaultValue="Admin"
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
                  defaultValue="3"
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
        </Form>
      </Paper>
    </Box>
  );
}
