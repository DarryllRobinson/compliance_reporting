import {
  Box,
  Typography,
  Button,
  TextField,
  useTheme,
  Alert,
} from "@mui/material";
import { userService } from "../../services";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";

export default function Login() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    data.email = data.email.trim();
    data.password = data.password.trim();
    setLoading(true);
    try {
      await userService.login(data);
      window.location.href = "/user/dashboard";
    } catch (error) {
      setError("password", {
        type: "manual",
        message: error?.message || "Login failed",
      });
      setAlert({ type: "error", message: error?.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

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
      {alert && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}
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
            label="Email address"
            type="email"
            autoComplete="off"
            fullWidth
            required
            defaultValue="darryllrobinson@icloud.com"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="new-password"
            fullWidth
            required
            defaultValue="newpassss"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
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
    </Box>
  );
}
