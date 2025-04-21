import React from "react";
import { useParams, useNavigate } from "react-router";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import { calculateInvoiceMetrics } from "../../../utils/invoiceCalculations";
import { mockInvoices } from "../../../data/mockInvoiceData";
import { useTheme } from "@mui/material/styles";

export default function ReviewRecords() {
  const { index } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const { paidMetrics, unpaidMetrics } = calculateInvoiceMetrics();
  const metrics = [...paidMetrics, ...unpaidMetrics];
  const selectedMetric = metrics[parseInt(index, 10)] || {
    label: "Unknown Metric",
    number: 0,
    value: 0,
  };

  // Filter invoices based on the selected metric
  const filteredInvoices = mockInvoices.filter((invoice) => {
    if (invoice.paidStatus && invoice.paidDate) {
      const invoiceDueDate = new Date(invoice.dueDate);
      const paidDate = new Date(invoice.paidDate);
      const daysToPay = Math.round(
        (paidDate - invoiceDueDate) / (1000 * 60 * 60 * 24)
      );

      switch (parseInt(index, 10)) {
        case 0:
          return daysToPay >= 0 && daysToPay <= 20;
        case 1:
          return daysToPay >= 21 && daysToPay <= 30;
        case 2:
          return daysToPay >= 31 && daysToPay <= 60;
        case 3:
          return daysToPay >= 61 && daysToPay <= 90;
        case 4:
          return daysToPay >= 91 && daysToPay <= 120;
        case 5:
          return daysToPay > 120;
        default:
          return false;
      }
    } else if (!invoice.paidStatus) {
      const invoiceDueDate = new Date(invoice.dueDate);
      const today = new Date();
      const overdueDays = Math.round(
        (today - invoiceDueDate) / (1000 * 60 * 60 * 24)
      );

      switch (parseInt(index, 10)) {
        case 6:
          return overdueDays >= 0 && overdueDays <= 20;
        case 7:
          return overdueDays >= 21 && overdueDays <= 30;
        case 8:
          return overdueDays >= 31 && overdueDays <= 60;
        case 9:
          return overdueDays >= 61 && overdueDays <= 90;
        case 10:
          return overdueDays >= 91 && overdueDays <= 120;
        case 11:
          return overdueDays > 120;
        default:
          return false;
      }
    }
    return false;
  });

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(-1)} // Navigate back one step in history
        sx={{ mt: 3 }}
      >
        Back to Metrics
      </Button>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: theme.palette.text.primary }}
      >
        {selectedMetric.label}
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        sx={{ color: theme.palette.text.secondary }}
      >
        Number: {selectedMetric.number}
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        sx={{ color: theme.palette.text.secondary }}
      >
        Value: ${selectedMetric.value.toFixed(2)}
      </Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {filteredInvoices.map((invoice) => (
          <Grid item xs={12} sm={6} md={4} key={invoice.invoiceNumber}>
            <Paper
              elevation={3}
              sx={{ p: 2, backgroundColor: theme.palette.background.paper }}
            >
              <Typography
                variant="body1"
                gutterBottom
                sx={{ color: theme.palette.text.primary }}
              >
                Invoice Number: {invoice.invoiceNumber}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Customer: {invoice.customerName}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Amount: ${invoice.invoiceAmount}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Invoice Date: {invoice.invoiceDate}
              </Typography>
              {invoice.paidDate && (
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Paid Date: {invoice.paidDate}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
