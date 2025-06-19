import {
  Box,
  Typography,
  Button,
  TextField,
  useTheme,
  IconButton,
  Paper,
} from "@mui/material";
import { userService } from "../../services";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useAlert } from "../../context/AlertContext";
import { error as logError } from "../../utils/logger";

export default function Login() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const schema = yup.object().shape({
    email: yup
      .string()
      .transform((value) => value?.trim())
      .email("Invalid email")
      .required("Email is required"),
    password: yup
      .string()
      .transform((value) => value?.trim())
      .min(8, "Minimum 8 characters")
      .required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      await userService.login(data);
      const lastPath = localStorage.getItem("lastVisitedPath");
      if (lastPath) {
        navigate(lastPath);
        localStorage.removeItem("lastVisitedPath");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      const message = error?.message || "Login failed. Please try again.";

      setError("password", {
        type: "manual",
        message,
      });

      logError("Login failed", { name: error?.name, message: error?.message });
      showAlert(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="login-container"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100vh",
        margin: 2,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 420,
          px: 3,
          py: 4,
          mx: "auto",
          my: { xs: 4, sm: 8 },
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form
          id="signin-form"
          onSubmit={handleSubmit(onSubmit)}
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
              label="Email address *"
              type="email"
              autoComplete="email"
              aria-label="Email"
              fullWidth
              defaultValue=""
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputLabelProps={{ style: { color: theme.palette.text.primary } }}
            />
            <TextField
              label="Password *"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-label="Password"
              fullWidth
              defaultValue=""
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputLabelProps={{ style: { color: theme.palette.text.primary } }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
