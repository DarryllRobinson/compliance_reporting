import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HelpIcon from "@mui/icons-material/Help";
import SendIcon from "@mui/icons-material/Send";

export default function GettingStartedPage() {
  const theme = useTheme();

  const steps = [
    {
      title: "1. Check Reporting Obligation",
      icon: <CheckCircleIcon sx={{ color: theme.palette.text.primary }} />,
      items: [
        "Use our Compliance Navigator to identify which entitiy in your corporate group need to report, if applicable.",
        "Confirm your group meets the >$100M revenue threshold.",
        "Refer to the regulator’s portal for more details.",
      ],
    },
    {
      title: "2. Prepare Your Data",
      icon: <AssignmentIcon sx={{ color: theme.palette.text.primary }} />,
      items: [
        "Prepare a CSV file of all payments made during the reporting period.",
        "Include supplier ABNs, invoice details, and payment dates.",
        "You’ll upload this to generate an ABN list for the SBI tool.",
      ],
    },
    {
      title: "3. Upload Your Files",
      icon: <UploadFileIcon sx={{ color: theme.palette.text.primary }} />,
      items: [
        "Upload your Transaction CSV file.",
        "Download the generated ABN list and submit it to the SBI tool.",
        "Upload the SBI results CSV so we can flag small business payments.",
      ],
    },
    {
      title: "4. Review and Finalise",
      icon: <CheckCircleIcon sx={{ color: theme.palette.text.primary }} />,
      items: [
        "Review stats, trends and outliers.",
        "Download your validation report and fix any issues.",
        "Finalise your dataset for submission.",
      ],
    },
    {
      title: "5. Submit to Regulator",
      icon: <SendIcon sx={{ color: theme.palette.text.primary }} />,
      items: [
        "Download your PDF summary and final CSV file.",
        "Submit them via the regulator’s online portal.",
      ],
    },
    {
      title: "6. Need Help?",
      icon: <HelpIcon sx={{ color: theme.palette.text.primary }} />,
      items: [
        "Visit our Help Centre or email support@ptrsplatform.au.",
        "Browse FAQs, watch video tutorials, or book a support call.",
      ],
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: (theme) => theme.spacing(5) }}>
      <Typography variant="h4" gutterBottom>
        🧭 Getting Started with Payment Times Reporting
      </Typography>
      <Typography variant="body1" sx={{ mb: (theme) => theme.spacing(3) }}>
        This guide walks you through the essentials of meeting your Payment
        Times Reporting obligations using our platform.
      </Typography>

      <Divider sx={{ my: (theme) => theme.spacing(3) }} />

      {steps.map((step, index) => (
        <Card
          key={index}
          elevation={2}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            px: 2,
            py: 2,
            mb: 4,
            gap: 2,
          }}
        >
          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: 1, p: 0 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {step.icon}
              <Typography variant="h6" color="text.primary">
                {step.title}
              </Typography>
            </Box>
            <List dense>
              {step.items.map((item, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
