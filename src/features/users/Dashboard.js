import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme(); // Access the theme
  const reports = [
    {
      name: "Payment Times Reporting Scheme",
      description: "History of submitted reports",
      items: 10,
      link: "/xero-credentials",
    },
    {
      name: "Report B",
      description: "Description of Report B",
      items: 25,
      link: "/xero-credentials",
    },
    {
      name: "Report C",
      description: "Description of Report C",
      items: 15,
      link: "/xero-credentials",
    },
  ];

  function createReport(report) {
    // Logic to create a new report
    navigate("/report-create", {
      state: { reportName: report.name },
    });
  }

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to Your Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom>
        Here you can manage your reports and track their details.
      </Typography>

      <Grid container spacing={3} sx={{ marginTop: 2 }}>
        {reports.map((report, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {report.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {report.description}
                </Typography>
                <Typography variant="body2">Items: {report.items}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => createReport(report)}
                  sx={{ marginTop: 2 }}
                >
                  Create New Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
