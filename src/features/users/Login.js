import React from "react";
import { Form, redirect } from "react-router";
import { Box, Typography, Button, TextField, useTheme } from "@mui/material";
import { userService } from "../../services";

export async function loginAction({ request, context }) {
  const { alertContext } = context;
  const formData = await request.formData();
  const userDetails = Object.fromEntries(formData);

  try {
    await userService.login(userDetails);
    return redirect("/user/dashboard");
  } catch (error) {
    alertContext.sendAlert("error", error || "Login failed");
    return redirect("/user/login");
  }
}

export default function Login() {
  const theme = useTheme(); // Access the theme

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <Form
        method="post"
        id="signin-form"
        style={{ width: "100%", maxWidth: 400 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing(2),
          }}
        >
          <TextField
            label="Email address"
            name="email"
            type="email"
            defaultValue="darryll@stillproud.com"
            fullWidth
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            defaultValue="nnnhhh"
            fullWidth
            required
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Login
          </Button>
        </Box>
      </Form>
    </Box>
  );
}
