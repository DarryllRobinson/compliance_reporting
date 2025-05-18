import React from "react";
import { Form, redirect, useNavigate } from "react-router";
import {
  Box,
  Typography,
  Button,
  TextField,
  useTheme,
  Paper,
  Grid,
  ButtonGroup,
} from "@mui/material";
import { userService } from "../../services";

export async function forgotPasswordAction({ request, context }) {
  const { alertContext } = context;
  const formData = await request.formData();
  const email = formData.get("email").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alertContext.sendAlert("error", "Invalid email address");
    return;
  }

  try {
    const response = await userService.forgotPassword(email);
    alertContext.sendAlert(
      "success",
      response.message ||
        "Password reset successfully - please check your email"
    );
  } catch (error) {
    alertContext.sendAlert("error", error || "Error resetting password");
    console.error("Error creating user:", error);
  }
}

export default function ForgotPassword() {
  const theme = useTheme();
  const navigate = useNavigate();

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
          Reset Password
        </Typography>
        <Form
          method="post"
          id="forgot-password-form"
          style={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                autoComplete="off"
                fullWidth
                required
                defaultValue="darryllrobinson@icloud.com"
              />
            </Grid>
          </Grid>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
            sx={{ display: "flex", justifyContent: "center", mt: 2 }} // Center horizontally
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
            >
              Reset Password
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/user/login")}
              size="large"
            >
              Login
            </Button>
          </ButtonGroup>
        </Form>
      </Paper>
    </Box>
  );
}
