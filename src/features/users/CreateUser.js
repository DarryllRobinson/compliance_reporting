import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
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
  Grid,
} from "@mui/material";
import { userService } from "../../services";
import { Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  position: Yup.string().required("Position is required"),
  role: Yup.string().required("Role is required"),
  clientName: Yup.string().required("Client selection is required"),
  password: Yup.string().when("$isFirstUser", {
    is: true,
    then: (schema) =>
      schema
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/\d/, "Password must contain at least one number"),
    otherwise: (schema) => schema.notRequired(),
  }),
  confirmPassword: Yup.string().when("$isFirstUser", {
    is: true,
    then: (schema) =>
      schema
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function UserCreate() {
  const theme = useTheme();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [storedClientDetails, setStoredClientDetails] = useState({});
  const [selectedRole, setSelectedRole] = useState("Admin"); // Controlled state for role
  const location = useLocation();
  const isFirstUser = location.state?.step !== 2;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    context: { isFirstUser },
    // Remove defaultValues usage of storedClientDetails
  });

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

    setValue("role", "Admin");
    setValue(
      "clientName",
      clientDetails.name || clientDetails.clientName || ""
    );
    setValue("firstName", clientDetails.firstName || "");
    setValue("lastName", clientDetails.lastName || "");
    setValue("email", clientDetails.email || "");
    setValue("phone", clientDetails.phone || "");
    setValue("position", clientDetails.position || "");
    setValue("clientId", clientDetails.id || "");
  }, [location.state, setValue]);

  const onSubmit = async (data) => {
    let userDetails = { ...data, active: true, verified: new Date() };
    try {
      if (isFirstUser) {
        await userService.registerFirstUser(userDetails);
        await userService.login({
          email: userDetails.email,
          password: userDetails.password,
        });

        setAlert({
          type: "success",
          message: "Welcome! Your admin user has been created.",
        });

        sessionStorage.removeItem("clientDetails");
        navigate("/admin");
      } else {
        await userService.register(userDetails);
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
                  label="First Name"
                  name="firstName"
                  type="string"
                  fullWidth
                  required
                  {...register("firstName")}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  type="string"
                  fullWidth
                  required
                  {...register("lastName")}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="string"
                  fullWidth
                  required
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Phone"
                  name="phone"
                  type="string"
                  fullWidth
                  required
                  {...register("phone")}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Position"
                  name="position"
                  type="string"
                  fullWidth
                  required
                  {...register("position")}
                  error={!!errors.position}
                  helperText={errors.position?.message}
                />
              </Grid>
              {isFirstUser && (
                <>
                  <Grid item xs={6}>
                    <TextField
                      label="Password"
                      name="password"
                      type="password"
                      fullWidth
                      required
                      {...register("password")}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      fullWidth
                      required
                      {...register("confirmPassword")}
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
                    label="List of Roles"
                    value={selectedRole}
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      setValue("role", e.target.value, {
                        shouldValidate: true,
                      });
                    }}
                    required
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
              <Grid item xs={6}>
                <TextField
                  label="Company"
                  name="clientName"
                  type="string"
                  {...register("clientName")}
                  fullWidth
                  disabled
                />
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
            >
              Create User
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
}
