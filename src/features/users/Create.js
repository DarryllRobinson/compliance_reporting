import React, { useState } from "react";
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
  Alert,
  Grid,
} from "@mui/material";
import { userService } from "./user.service";
import { clientService } from "../clients/client.service";

export async function userCreateLoader() {
  const user = await userService.refreshToken();
  if (!user) {
    throw new Response("userCreateLoader refreshToken problem", {
      status: 500,
    });
  }
  const clients = await clientService.getAll();
  if (!clients) {
    throw new Response("userCreateLoader clients problem", { status: 500 });
  }
  return { clients };
}

export async function userCreateAction({ request }) {
  await userService.refreshToken();
  const formData = await request.formData();
  let userDetails = Object.fromEntries(formData);
  userDetails = { ...userDetails, active: true };
  try {
    await userService.register(userDetails);
    return redirect("/users");
  } catch (error) {
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
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
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
          // onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="First Name"
                name="firstName"
                type="string"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last Name"
                name="lastName"
                type="string"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="string"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Phone"
                name="phone"
                type="string"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Position"
                name="position"
                type="string"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                fullWidth
                required
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
                  defaultValue=""
                  required
                >
                  <MenuItem value="Submitter">Submitter</MenuItem>
                  <MenuItem value="Reviewer">Reviewer</MenuItem>
                  <MenuItem value="Approver">Approver</MenuItem>
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
                  name="f_clientId"
                  id="f_clientId"
                  label="List of Clients"
                  defaultValue=""
                  required
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.clientName}
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
            sx={{ mt: 2 }}
          >
            Create User
          </Button>
        </Form>
      </Paper>
    </Box>
  );
}
