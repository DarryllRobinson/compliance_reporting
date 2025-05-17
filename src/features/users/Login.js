import React from "react";
import { Form, redirect } from "react-router";
import { Box, Typography, Button, TextField, useTheme } from "@mui/material";
import { userService } from "../../services";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export async function loginAction({ request, context }) {
  console.log("loginAction");
  const { alertContext } = context;
  const formData = await request.formData();
  const userDetails = Object.fromEntries(formData);

  try {
    await userService.login(userDetails);
    return redirect("/user/dashboard");
  } catch (error) {
    const errorMessage = error?.message || "Login failed";
    alertContext.sendAlert("error", errorMessage);
    return redirect("/user/login");
  }
}

export default function Login() {
  const theme = useTheme();

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
    try {
      await userService.login(data);
      window.location.href = "/user/dashboard";
    } catch (error) {
      setError("password", {
        type: "manual",
        message: error?.message || "Login failed",
      });
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
            fullWidth
            required
            // defaultValue="darryllrobinson@icloud.com"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            // defaultValue="newpassss"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Login
          </Button>
        </Box>
      </form>
    </Box>
  );
}
