import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLoaderData, useNavigate } from "react-router";
import { userService } from "./user.service";
import { reportService } from "../reports/report.service";

export async function dashboardLoader() {
  const user = await userService.refreshToken();
  if (!user) {
    throw new Response("dashboardLoader user problem", { status: 500 });
  }
  //   const user = userService.userValue; // Get the current user
  const reports = await reportService.getAllById({ clientId: user.clientId });
  if (!reports) {
    throw new Response("dashboardLoader reports problem", { status: 500 });
  }
  return { reports };
}

export default function Dashboard() {
  const { reports } = useLoaderData();
  // console.log("reports", reports);
  const navigate = useNavigate();
  const theme = useTheme();

  const reportList = [
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

  function renderTable(row) {
    if (!row) {
      return (
        <TableRow>
          <TableCell colSpan={3}>No data available</TableCell>
        </TableRow>
      );
    }
    return (
      <TableRow key={row.id}>
        <TableCell>
          {new Date(row.ReportingPeriodStartDate).toISOString().split("T")[0]}
        </TableCell>
        <TableCell>
          {new Date(row.ReportingPeriodEndDate).toISOString().split("T")[0]}
        </TableCell>
        <TableCell>{row.reportStatus}</TableCell>
        <TableCell>
          {row.reportStatus === "Created" ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/report-details", { state: { row } })}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/report-details", { state: { row } })}
            >
              View Details
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
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
        {reportList.map((report, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {report.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {report.description}
                </Typography>
                {reports[index] ? (
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Reporting Period Start Date</TableCell>
                          <TableCell>Reporting Period End Date</TableCell>
                          <TableCell>Report Status</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>{renderTable(reports[index])}</TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    No records found for this report
                  </Typography>
                )}
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
