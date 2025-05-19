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
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { AddCircleOutline, CheckCircle, Circle } from "@mui/icons-material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HelpIcon from "@mui/icons-material/Help";
import SendIcon from "@mui/icons-material/Send";

export default function GettingStartedPage() {
  const theme = useTheme();

  const steps = [
    {
      title: "1. Check Reporting Obligation",
      icon: <CheckCircle sx={{ color: theme.palette.text.primary }} />,
      items: [
        <>
          Use our{" "}
          <Tooltip title="Open the Entity Navigator in a new tab">
            <Link
              href="/navigator"
              underline="hover"
              target="_blank"
              rel="noopener"
            >
              Compliance Navigator
              <OpenInNewIcon sx={{ fontSize: 14, ml: 0.5 }} />
            </Link>
          </Tooltip>{" "}
          to identify which entity in your corporate group needs to report, if
          applicable.
        </>,
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
        "This will form your TCP dataset, the basis of your report.",
      ],
    },
    {
      title: "3. Upload Your Files",
      icon: <UploadFileIcon sx={{ color: theme.palette.text.primary }} />,
      items: [
        <>
          Download our{" "}
          <Tooltip title="Download CSV template">
            <Link
              href="/static-content/resources/ptr_template.csv"
              underline="hover"
              target="_blank"
              rel="noopener"
              download
            >
              CSV template
              <OpenInNewIcon sx={{ fontSize: 14, ml: 0.5 }} />
            </Link>
          </Tooltip>{" "}
          to make sure your file is includes all mandatory fields.
        </>,
        "Upload your Payment CSV file from Step 2.",
        "Review all records and eliminate those that aren't considered TCPs.",
      ],
    },
    {
      title: "4. Confirm and Augment Small Business Payments",
      icon: <AddCircleOutline sx={{ color: theme.palette.text.primary }} />,
      items: [
        <>
          Download a list of ABNs to match against the{" "}
          <Tooltip title="Regulator's SBI tool">
            <Link
              href="https://paymenttimes.gov.au/guidance/regulatory-resources/information-sheet-6"
              underline="hover"
              target="_blank"
              rel="noopener"
            >
              SBI tool
              <OpenInNewIcon sx={{ fontSize: 14, ml: 0.5 }} />
            </Link>
          </Tooltip>
          .
        </>,
        "Upload the file from the SBI tool to create the SBTCP dataset.",
        "Update the SBTCP dataset with additional columns of information.",
      ],
    },
    {
      title: "5. Review and Finalise",
      icon: <CheckCircle sx={{ color: theme.palette.text.primary }} />,
      items: [
        "The platform will update the dataset with the required calculations.",
        "Finalise your dataset for submission.",
        <>
          Check out our blog on{" "}
          <Tooltip title="Read blog post on data quality">
            <Link
              href="/blog/improve-data-quality"
              underline="hover"
              target="_blank"
              rel="noopener"
            >
              data validation tips
              <OpenInNewIcon sx={{ fontSize: 14, ml: 0.5 }} />
            </Link>
          </Tooltip>
          .
        </>,
      ],
    },
    {
      title: "6. Submit to Regulator",
      icon: <SendIcon sx={{ color: theme.palette.text.primary }} />,
      items: [
        "Download your PDF summary and final CSV file.",
        "Submit them via the regulator’s online portal.",
        <>
          Follow our step-by-step{" "}
          <Tooltip title="Follow checklist before submitting">
            <Link
              href="/help/submission-checklist"
              underline="hover"
              target="_blank"
              rel="noopener"
            >
              submission checklist
              <OpenInNewIcon sx={{ fontSize: 14, ml: 0.5 }} />
            </Link>
          </Tooltip>
          .
        </>,
      ],
    },
    {
      title: "7. Need Help?",
      icon: <HelpIcon sx={{ color: theme.palette.text.primary }} />,
      items: [
        "Visit our Help Centre or email support@ptrsplatform.au.",
        "Browse FAQs, watch video tutorials, or book a support call.",
        <>
          Still stuck?{" "}
          <Tooltip title="Get support and guidance">
            <Link
              href="/getting-help"
              underline="hover"
              target="_blank"
              rel="noopener"
            >
              Start here
              <OpenInNewIcon sx={{ fontSize: 14, ml: 0.5 }} />
            </Link>
          </Tooltip>{" "}
          for tailored onboarding support.
        </>,
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
                    <Circle fontSize="small" />
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
