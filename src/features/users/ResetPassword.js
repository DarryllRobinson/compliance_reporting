import React, { useEffect, useState } from "react";
import { Form, Link, redirect } from "react-router";
import queryString from "query-string";
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
import { userService } from "./user.service";
import { useNavigate } from "react-router";
import { useAlert } from "../../context";

export default function ResetPassword() {
  const theme = useTheme();
  const navigate = useNavigate(); // Use react-router's navigate hook
  const TokenStatus = {
    Validating: "Validating",
    Valid: "Valid",
    Invalid: "Invalid",
  };

  const [token, setToken] = useState(null);
  const [tokenStatus, setTokenStatus] = useState(TokenStatus.Validating);
  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  useEffect(() => {
    const { token } = queryString.parse(window.location.search);

    // Replace the current URL without reloading the page
    navigate(window.location.pathname, { replace: true });

    userService
      .validateResetToken(token)
      .then(() => {
        setToken(token);
        setTokenStatus(TokenStatus.Valid);
      })
      .catch(() => {
        setTokenStatus(TokenStatus.Valid);
      });
  }, [navigate, TokenStatus.Invalid, TokenStatus.Valid]);

  const handlePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleConfirmPassword = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
  };

  const clearErrorMessages = () => {
    setPasswordError(null);
    setConfirmPasswordError(null);
  };

  const checkFields = () => {
    let cont = true;

    if (password.length < 8) {
      setPasswordError("Please provide a password of at least 8 characters");
      cont = false;
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      cont = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      cont = false;
    }

    return cont;
  };

  function onSubmit(e) {
    e.preventDefault();
    clearErrorMessages();

    if (checkFields()) {
      userService
        .resetPassword({ token, password, confirmPassword })
        .then(() => {
          useAlert.sendAlert(
            "Success",
            "Password reset successfully - redirecting you to the login page"
          );
          redirect("/user/login");
        })
        .catch((error) => {
          useAlert.sendAlert("error", error || "Error resetting your password");
        });
    }
  }

  function getForm() {
    return (
      <Form
        method="post"
        id="reset-password-form"
        style={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="New Password"
              name="password"
              type="password"
              fullWidth
              required
              // defaultValue="newpassss"
              onChange={handlePassword}
              error={passwordError}
              helperText={passwordError}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Confirm Password"
              name="password"
              type="password"
              fullWidth
              required
              // defaultValue="newpassss"
              onChange={handleConfirmPassword}
              error={confirmPasswordError}
              helperText={confirmPasswordError}
            />
          </Grid>
        </Grid>
        <Box
          sx={{ display: "flex", justifyContent: "center", mt: 2 }} // Center horizontally
        >
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            onClick={onSubmit}
          >
            Reset Password
          </Button>
        </Box>
      </Form>
    );
  }

  function getBody() {
    switch (tokenStatus) {
      case TokenStatus.Valid:
        try {
          return getForm();
        } catch (e) {
          console.log("onSubmit e: ", e);
        }
        break;
      case TokenStatus.Invalid:
        return (
          <Box>
            Token validation failed, if the token has expired you can get a new
            one at the <Link to="/user/forgot-password">forgot password</Link>{" "}
            page.
          </Box>
        );
      case TokenStatus.Validating:
        return <Box>Validating token...</Box>;
      default:
        return (
          <Box>
            Token validation failed, if the token has expired you can get a new
            one at the <Link to="/user/forgot-password">forgot password</Link>{" "}
            page.
          </Box>
        );
    }
  }

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
        {getBody()}
      </Paper>
    </Box>
  );
}
