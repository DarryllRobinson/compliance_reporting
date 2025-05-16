import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  Paper,
  useTheme,
} from "@mui/material";
import { useAlert } from "../../context";
import { publicService } from "../../services/public.services";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const theme = useTheme();
  const { sendAlert } = useAlert();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "Homer Simpson",
    email: "homer@simpson.com",
    subject: "Contact Us",
    message: "Hello there! I have a question.",
    to: "darryllrobinson@icloud.com",
    from: "darryllrobinson@icloud.com",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendContactEmail = async (data) => {
    try {
      const response = await publicService.sendEmail(data);
      console.log("Email sent successfully:", response);
      if (response.success) {
        sendAlert("success", "Thank you for contacting us!");
        navigate("/thankyou-contact");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      sendAlert("error", "Failed to send email.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form submitted:", formData);
    sendContactEmail(formData);
    setFormData({ name: "", email: "", message: "" });
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
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: theme.spacing(2) }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: theme.spacing(2) }}
          />
          <TextField
            label="Message"
            name="message"
            type="text"
            value={formData.message}
            onChange={handleChange}
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
            sx={{
              padding: theme.spacing(1.5),
              fontWeight: "bold",
              borderRadius: theme.shape.borderRadius,
            }}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
