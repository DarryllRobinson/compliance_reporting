import React from "react";
import { useParams } from "react-router";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { calculateInvoiceMetrics } from "../utils/invoiceCalculations";
import { mockInvoices } from "../data/mockInvoiceData";
import { useTheme } from "@mui/material/styles";

const ReviewRecords = () => {
  const { index } = useParams();
  const theme = useTheme();
  const metrics = calculateInvoiceMetrics();
  const selectedMetric = metrics[index];

  // Filter invoices based on the selected metric
  const filteredInvoices = mockInvoices.filter((invoice) => {
    if (invoice.paidStatus && invoice.paidDate) {
      const invoiceDate = new Date(invoice.invoiceDate);
      const paidDate = new Date(invoice.paidDate);
      const daysToPay = (paidDate - invoiceDate) / (1000 * 60 * 60 * 24);

      switch (parseInt(index, 10)) {
        case 0:
          return daysToPay <= 20;
        case 1:
          return daysToPay > 20 && daysToPay <= 30;
        case 2:
          return daysToPay > 30 && daysToPay <= 60;
        case 3:
          return daysToPay > 60 && daysToPay <= 90;
        case 4:
          return daysToPay > 90 && daysToPay <= 120;
        case 5:
          return daysToPay > 120;
        default:
          return false;
      }
    }
    return false;
  });

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
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
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Paid Date: {invoice.paidDate}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ReviewRecords;
