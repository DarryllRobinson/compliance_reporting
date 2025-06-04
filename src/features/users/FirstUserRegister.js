import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { userService, publicService } from "../../services";

const schema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(3, "First name must be at least 3 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .trim()
    .min(3, "Last name must be at least 3 characters")
    .required("Last name is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  phone: Yup.string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  position: Yup.string()
    .trim()
    .min(2, "Position must be at least 2 characters")
    .required("Position is required"),
});

export default function FirstUserRegister() {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      position: "",
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const clientDetails = JSON.parse(sessionStorage.getItem("clientDetails"));
    if (!clientDetails) {
      setAlert({
        type: "error",
        message:
          "No client information found. Please register your company first.",
      });
      return;
    }

    setValue("firstName", clientDetails.firstName || "");
    setValue("lastName", clientDetails.lastName || "");
    setValue("email", clientDetails.email || "");
    setValue("phone", clientDetails.phone || "");
    setValue("position", clientDetails.position || "");
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const client = JSON.parse(sessionStorage.getItem("clientDetails")) || {};
      const userDetails = {
        ...data,
        role: "Admin",
        clientId: client.id,
        active: true,
        verified: new Date(),
        createdBy: userService.userValue?.id || "onlineform",
      };

      await userService.registerFirstUser(userDetails);
      await userService.login({
        email: data.email,
        password: data.password,
      });

      // Send welcome email via SES
      const userData = {
        topic: "Admin User Created",
        name: `${userDetails.firstName} ${userDetails.lastName}`,
        email: userDetails.email,
        subject: "Admin User Created",
        company: client.businessName,
        message: "",
        to: userDetails.email,
        from: "contact@monochrome-compliance.com",
      };
      await publicService.sendSesEmail(userData);

      setAlert({
        type: "success",
        message: "Welcome! Your admin user has been created.",
      });

      sessionStorage.clear();
      navigate("/admin");
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Error creating user. Please try again.",
      });
    } finally {
      setLoading(false);
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
          Create First User
        </Typography>
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            id="create-first-user-form"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing(2),
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  {...register("firstName")}
                  label="First Name *"
                  fullWidth
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register("lastName")}
                  label="Last Name *"
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("email")}
                  label="Email *"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register("password")}
                  label="Password *"
                  type="password"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register("confirmPassword")}
                  label="Confirm Password *"
                  type="password"
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register("phone")}
                  label="Phone *"
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register("position")}
                  label="Position *"
                  fullWidth
                  error={!!errors.position}
                  helperText={errors.position?.message}
                />
              </Grid>
            </Grid>
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Admin User"}
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Paper>
    </Box>
  );
}
