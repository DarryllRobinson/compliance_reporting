import React, { useState } from "react";
import { Form, redirect, useLoaderData, useLocation } from "react-router";
import {
  Box,
  Button,
  TextField,
  useTheme,
  Paper,
  Alert,
  Grid,
} from "@mui/material";
import { userService } from "../../features/users/user.service";
import { reportService } from "../../features/reports/report.service";

export async function xeroLoader() {
  const user = await userService.refreshToken();
  if (!user) {
    throw new Response("xeroLoader refreshToken problem", {
      status: 500,
    });
  }
}

export async function xeroAction({ request }) {
  await userService.refreshToken();
  const formData = await request.formData();
  let xeroDetails = Object.fromEntries(formData);
  console.log("Xero Details:", xeroDetails);

  try {
    // Xero login
    // const xeroLogin = await reportService.xeroLogin();
    // console.log("Xero login response:", xeroLogin);
    return redirect("/review-report");
  } catch (error) {
    console.error("Error logging to Xero:", error);
  }
}

export default function XeroCredentials() {
  // const location = useLocation();
  // const { reportName } = location.state || {};
  const theme = useTheme();

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
        <Form
          method="post"
          id="xero-login-form"
          style={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Xero Username"
                name="username"
                type="string"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Xero Password"
                name="password"
                type="password"
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Form>
      </Paper>
    </Box>
  );
}
