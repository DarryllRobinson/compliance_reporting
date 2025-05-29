import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Alert,
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
import { publicService, userService } from "../../services";
import { useForm } from "react-hook-form";

export default function UserCreate() {
  const user = userService.userValue;
  const theme = useTheme();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [storedClientDetails, setStoredClientDetails] = useState({});
  const location = useLocation();
  const isFirstUser = location.state?.step === 1;
  const [selectedRole, setSelectedRole] = useState(
    isFirstUser ? "Admin" : "User"
  ); // Default role
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const password = watch("password", "");

  useEffect(() => {
    let clientDetails = (location.state && location.state.client) || {};

    if (!Object.keys(clientDetails).length) {
      const stored = sessionStorage.getItem("clientDetails");
      if (stored) {
        clientDetails = JSON.parse(stored);
      }
    } else {
      sessionStorage.setItem("clientDetails", JSON.stringify(clientDetails));
    }

    setStoredClientDetails(clientDetails);

    setValue("role", isFirstUser ? "Admin" : "User");
    setValue("firstName", clientDetails.firstName || "");
    setValue("lastName", clientDetails.lastName || "");
    setValue("email", clientDetails.email || "");
    setValue("phone", clientDetails.phone || "");
    setValue("position", clientDetails.position || "");
    setValue("clientId", user.clientId);
  }, [location.state, setValue, isFirstUser, user.clientId]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    let userDetails = { ...data, active: true, verified: new Date() };
    try {
      if (isFirstUser) {
        await userService.registerFirstUser(userDetails);
        await userService.login({
          email: userDetails.email,
          password: userDetails.password,
        });

        // Send welcome email
        const userData = {
          topic: "Admin User Created",
          name: `${userDetails.firstName} ${userDetails.lastName}`,
          email: userDetails.email,
          subject: "Admin User Created",
          company: userDetails.clientName,
          message: "",
          to: userDetails.email,
          from: "contact@monochrome-compliance.com",
        };
        await publicService.sendSesEmail(userData);

        setAlert({
          type: "success",
          message: "Welcome! Your admin user has been created.",
        });

        sessionStorage.removeItem("clientDetails");
        navigate("/admin");
      } else {
        await userService.register(userDetails);
        // Welcome email for User-level users sent after verification
        setAlert({
          type: "success",
          message: "User created successfully.",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Error creating user.",
      });
      console.error("Error creating user:", error);
    }
    setIsLoading(false);
  };

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
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
        {/* Removed Add Another User and Finish Setup UI */}
        {!(alert && alert.type === "success" && isFirstUser) && (
          <form
            onSubmit={handleSubmit(onSubmit)}
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
                  label="First Name *"
                  name="firstName"
                  type="string"
                  fullWidth
                  {...register("firstName", {
                    required: "First Name is required",
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name *"
                  name="lastName"
                  type="string"
                  fullWidth
                  {...register("lastName", {
                    required: "Last Name is required",
                  })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email *"
                  name="email"
                  type="string"
                  fullWidth
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Invalid email",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Phone *"
                  name="phone"
                  type="string"
                  fullWidth
                  {...register("phone", { required: "Phone is required" })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Position *"
                  name="position"
                  type="string"
                  fullWidth
                  {...register("position", {
                    required: "Position is required",
                  })}
                  error={!!errors.position}
                  helperText={errors.position?.message}
                />
              </Grid>
              {isFirstUser && (
                <>
                  <Grid item xs={6}>
                    <TextField
                      label="Password *"
                      name="password"
                      type="password"
                      fullWidth
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                          message:
                            "Password must contain at least one lowercase letter, one uppercase letter, and one number",
                        },
                      })}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Confirm Password *"
                      name="confirmPassword"
                      type="password"
                      fullWidth
                      {...register("confirmPassword", {
                        required: "Confirm Password is required",
                        validate: (value) =>
                          value === password || "Passwords must match",
                      })}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={6}>
                <FormControl fullWidth error={!!errors.role}>
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    name="role"
                    id="role"
                    label="List of Roles *"
                    value={selectedRole}
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      setValue("role", e.target.value, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <MenuItem value="User">User</MenuItem>
                    <MenuItem value="Approver">Approver</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                  </Select>
                  {errors.role && (
                    <Typography variant="caption" color="error">
                      {errors.role.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            {!isFirstUser ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                You’ll receive an email with a secure link to set your password
                after verifying your email.
              </Typography>
            ) : null}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: theme.spacing(2) }}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
}
