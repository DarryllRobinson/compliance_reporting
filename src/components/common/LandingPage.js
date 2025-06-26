import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Container,
  useTheme,
  Divider,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { isValidABN } from "../../lib/utils/abnChecksum";
import { useNavigate } from "react-router";
import Contact from "./Contact";

const schema = yup.object({
  contactName: yup.string().trim().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  contactPhone: yup.string().trim(),
  businessName: yup.string().required("Business name is required"),
  abn: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .test(
      "is-valid-abn",
      "ABN must be exactly 11 digits and pass the official checksum",
      function (value) {
        if (!value) return true; // Optional field
        return /^\d{11}$/.test(value) && isValidABN(value);
      }
    ),
});

export default function LandingPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const theme = useTheme();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    localStorage.setItem("userDetails", JSON.stringify(data));
    navigate("/upload", { state: data });
  };

  return (
    <Box sx={{ mx: "auto", mt: 5, p: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" gutterBottom textAlign="center">
          We can help you meet your Payment Times Reporting deadline.
        </Typography>
        <Grid container spacing={3} mt={2} justifyContent="space-between">
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, minHeight: 200 }}>
              <Typography variant="h6" gutterBottom>
                ABN Matching & Enrichment
              </Typography>
              <Typography variant="body2">
                We clean and complete your supplier list using trusted ABN
                sources — no gaps, no guesswork.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, minHeight: 200 }}>
              <Typography variant="h6" gutterBottom>
                Expert Report Preparation
              </Typography>
              <Typography variant="body2">
                We prepare your report to meet regulator expectations, ensuring
                completeness and submission readiness.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, minHeight: 200 }}>
              <Typography variant="h6" gutterBottom>
                Complete Solution
              </Typography>
              <Typography variant="body2">
                Our battle-tested processes ensure a speedy and reliable
                outcome.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, minHeight: 200 }}>
              <Typography variant="h6" gutterBottom>
                Trusted by ASX Companies
              </Typography>
              <Typography variant="body2">
                Our team supports some of Australia's largest listed entities
                with their regulatory compliance obligations.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Typography variant="h4" gutterBottom textAlign="center">
        Still haven’t submitted your Payment Times Report?
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        textAlign="center"
        color="error"
        sx={{ fontWeight: "bold" }}
      >
        Deadline: 30 June. Late submissions are subject to significant fines of
        upwards of $99,000 per day.
      </Typography>
      <Typography variant="body1" gutterBottom textAlign="center">
        Quick call to walk you through the requirements → We generate your
        report → You submit it on time.
      </Typography>
      <Typography variant="body2" textAlign="center" sx={{ mb: 4 }}>
        ✅ ABN lookup ✅ TCP logic ✅ Submission-ready report
      </Typography>

      <Typography variant="h6" textAlign="center" sx={{ mb: 3 }}>
        Prices start $795 + GST (depending on requirements)
      </Typography>
      <Divider sx={{ my: 4 }} />
      <Contact />
    </Box>
  );
}
