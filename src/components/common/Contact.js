import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  Paper,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import { publicService } from "../../services/public.services";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export default function Contact() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    message: yup.string().required("Message is required"),
  });

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "Homer Simpson",
      email: "homer@simpson.com",
      subject: "Contact Us",
      message: "Hello there! I have a question.",
      to: "darryllrobinson@icloud.com",
      from: "darryllrobinson@icloud.com",
    },
  });

  const sendContactEmail = async (data) => {
    // Trim whitespace from input fields
    data.name = data.name.trim();
    data.email = data.email.trim();
    data.message = data.message.trim();
    try {
      setLoading(true);
      const response = await publicService.sendEmail(data);
      if (response.status === 200) {
        reset();
        setAlert({ type: "success", message: "Message sent successfully!" });
        setTimeout(() => {
          navigate("/thankyou-contact");
        }, 1500);
        return;
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setAlert({ type: "error", message: "Failed to send email." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: theme.spacing(3),
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: theme.palette.text.primary }}
        >
          Contact Us
        </Typography>
        <Typography
          variant="body1"
          paragraph
          sx={{ color: theme.palette.text.secondary }}
        >
          We'd love to hear from you! Please fill out the form below and we'll
          get back to you as soon as possible.
        </Typography>
        <Box component="form" onSubmit={handleSubmit(sendContactEmail)}>
          <TextField
            label="Name"
            type="text"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            autoComplete="off"
            fullWidth
            required
            sx={{ mb: theme.spacing(2) }}
          />
          <TextField
            label="Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete="off"
            fullWidth
            required
            sx={{ mb: theme.spacing(2) }}
          />
          <TextField
            label="Message"
            type="text"
            {...register("message")}
            error={!!errors.message}
            helperText={errors.message?.message}
            autoComplete="off"
            fullWidth
            multiline
            rows={4}
            required
            sx={{ mb: theme.spacing(2) }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              padding: theme.spacing(1.5),
              fontWeight: "bold",
              borderRadius: theme.shape.borderRadius,
            }}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
