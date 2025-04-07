import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { calculateInvoiceMetrics } from "../utils/invoiceCalculations";
import { useTheme } from "@mui/material/styles";

const InvoiceMetrics = () => {
  const theme = useTheme();
  const metrics = calculateInvoiceMetrics();

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ color: theme.palette.text.primary }}
      >
        Invoice Metrics
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(metrics).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Paper
              elevation={3}
              sx={{ p: 2, backgroundColor: theme.palette.background.paper }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: theme.palette.text.primary }}
              >
                {key.replace(/([A-Z])/g, " $1").trim()}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.secondary }}
              >
                {value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InvoiceMetrics;
