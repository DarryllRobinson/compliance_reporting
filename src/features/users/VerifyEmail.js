import { useEffect, useState } from "react";
import { Form, Link } from "react-router";
import queryString from "query-string";
import {
  Box,
  Typography,
  Button,
  TextField,
  useTheme,
  Paper,
  Grid,
  Alert,
} from "@mui/material";
import { publicService, userService } from "../../services";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const navigate = useNavigate();

  const EmailStatus = {
    Verifying: "Verifying",
    Failed: "Failed",
    Valid: "Valid",
  };

  const [emailStatus, setEmailStatus] = useState(EmailStatus.Verifying);

  const token = searchParams.get("token");

  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (!token) {
      console.error("Token not found in URL");
      setEmailStatus(EmailStatus.Failed);
      return;
    }

    userService
      .verifyEmail(token)
      .then(async (user) => {
        // Send welcome email
        const userData = {
          topic: "User Created",
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          subject: "User Created",
          company: user.clientId,
          message: "",
          to: user.email,
          from: "contact@monochrome-compliance.com",
        };
        await publicService.sendSesEmail(userData);
        setEmailStatus(EmailStatus.Valid);
      })
      .catch((error) => {
        console.error("Token validation failed:", error);
        setEmailStatus(EmailStatus.Failed);
      });
  }, [EmailStatus.Failed, EmailStatus.Valid, token]);

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

    if (!password || password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
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
        .verifyEmail({ token, password, confirmPassword })
        .then(() => {
          setAlert({
            type: "success",
            message:
              "Password set successfully - redirecting you to the login page",
          });
          navigate("/user/login");
        })
        .catch((error) => {
          setAlert({
            type: "error",
            message: error || "Error setting your password",
          });
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
              onChange={handlePassword}
              error={!!passwordError}
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
              onChange={handleConfirmPassword}
              error={!!confirmPasswordError}
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
            Set Your Password
          </Button>
        </Box>
      </Form>
    );
  }

  function getBody() {
    switch (emailStatus) {
      case EmailStatus.Verifying:
        return <div>Verifying...</div>;
      case EmailStatus.Failed:
        return (
          <div>
            Verification failed. You can also verify your account using the{" "}
            <Link to="/user/forgot-password">forgot password</Link> page.
          </div>
        );
      case EmailStatus.Valid:
        return <Box>Validating token...</Box>;

      default:
        return <div>Something went wrong. Please try again later.</div>;
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
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
        {getBody()}
      </Paper>
    </Box>
  );
}
