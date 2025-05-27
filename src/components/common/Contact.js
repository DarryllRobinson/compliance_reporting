import { useState } from "react";
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
  MenuItem,
} from "@mui/material";
import { publicService } from "../../services";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Yup schema moved outside the component and updated to use yup.object({ ... }) directly
const schema = yup.object({
  name: yup.string().trim().required("Name is required"),
  company: yup.string().trim().required("Company is required"),
  email: yup
    .string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
  message: yup.string().trim().required("Message is required"),
});

export default function Contact() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      subject: "Contact Us",
      message: "",
      to: "contact@monochrome-compliance.com",
      from: "contact@monochrome-compliance.com",
    },
    mode: "onChange",
  });

  const sendContactEmail = async (data) => {
    const contactEmail = {
      name: data.name.trim(),
      email: data.email.trim(),
      company: data.company.trim(),
      subject: `${data.topic} - ${data.company.trim()}`,
      message: data.message.trim(),
      to: data.email.trim(),
      from: data.from.trim(),
    };

    try {
      setLoading(true);

      // Send the contact email
      const response = await publicService.sendEmail(contactEmail);

      // Send notification email to the contact team
      await publicService.sendEmail({
        name: data.name.trim(),
        email: data.email.trim(),
        to: "contact@monochrome-compliance.com",
        subject: `New contact: ${data.topic}`,
        message: `New contact from ${data.name} (${data.email})`,
        from: "contact@monochrome-compliance.com",
      });
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
            label="Company"
            type="text"
            {...register("company")}
            error={!!errors.company}
            helperText={errors.company?.message}
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
            select
            label="Topic"
            defaultValue="General contact"
            {...register("topic")}
            fullWidth
            required
            sx={{ mb: theme.spacing(2) }}
          >
            <MenuItem value="Suggestion for improvement">
              Suggestion for improvement
            </MenuItem>
            <MenuItem value="Privacy complaint">Privacy complaint</MenuItem>
            <MenuItem value="General contact">General contact</MenuItem>
            <MenuItem value="Log technical issue">Log technical issue</MenuItem>
            <MenuItem value="Request for assistance">
              Request for assistance
            </MenuItem>
          </TextField>
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
            disabled={!isValid || loading}
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
