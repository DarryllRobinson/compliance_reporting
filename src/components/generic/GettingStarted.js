import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HelpIcon from "@mui/icons-material/Help";
import SendIcon from "@mui/icons-material/Send";

export default function GettingStartedPage() {
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

      {/* 1. Check Eligibility */}
      <Section
        icon={<CheckCircleIcon />}
        title="1. Check Eligibility"
        items={[
          "Use our Entity Navigator Tool to identify which entities in your corporate group need to report.",
          "Confirm your group meets the >$100M revenue threshold.",
          "Refer to the regulator’s portal for more details.",
        ]}
      />

      {/* 2. Prepare Your Data */}
      <Section
        icon={<AssignmentIcon />}
        title="2. Prepare Your Data"
        items={[
          "Prepare a CSV file of all payments made during the reporting period.",
          "Include supplier ABNs, invoice details, and payment dates.",
          "You’ll upload this to generate an ABN list for the SBI tool.",
        ]}
      />

      {/* 3. Upload Your Files */}
      <Section
        icon={<UploadFileIcon />}
        title="3. Upload Your Files"
        items={[
          "Upload your Transaction CSV file.",
          "Download the generated ABN list and submit it to the SBI tool.",
          "Upload the SBI results CSV so we can flag small business payments.",
        ]}
      />

      {/* 4. Review and Finalise */}
      <Section
        icon={<CheckCircleIcon />}
        title="4. Review and Finalise"
        items={[
          "Review stats, trends and outliers.",
          "Download your validation report and fix any issues.",
          "Finalise your dataset for submission.",
        ]}
      />

      {/* 5. Submit to Regulator */}
      <Section
        icon={<SendIcon />}
        title="5. Submit to Regulator"
        items={[
          "Download your PDF summary and final CSV file.",
          "Submit them via the regulator’s online portal.",
        ]}
      />

      {/* 6. Need Help? */}
      <Section
        icon={<HelpIcon />}
        title="6. Need Help?"
        items={[
          "Visit our Help Centre or email support@ptrsplatform.au.",
          "Browse FAQs, watch video tutorials, or book a support call.",
        ]}
      />
    </Container>
  );
}

function Section({ icon, title, items }) {
  return (
    <Box sx={{ mb: (theme) => theme.spacing(5) }}>
      <Typography
        variant="h6"
        sx={{
          display: "flex",
          alignItems: "center",
          mb: (theme) => theme.spacing(1),
        }}
      >
        {icon}
        <Box component="span" sx={{ ml: 1 }}>
          {title}
        </Box>
      </Typography>
      <List dense>
        {items.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
