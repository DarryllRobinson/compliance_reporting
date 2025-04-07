import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { calculateInvoiceMetrics } from "../utils/invoiceCalculations";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router";

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
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Link to={`/review/${index}`} style={{ textDecoration: "none" }}>
              <Paper
                elevation={3}
                sx={{ p: 2, backgroundColor: theme.palette.background.paper }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: theme.palette.text.primary }}
                >
                  {metric.label}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Number: {metric.number}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Value: ${metric.value.toFixed(2)}
                </Typography>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InvoiceMetrics;
