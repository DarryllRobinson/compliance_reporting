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
import { redirect, useLoaderData, useNavigate } from "react-router";
import { reportService, userService } from "../../services";
import ProtectedRoutes from "../../utils/ProtectedRoutes";

export async function dashboardLoader() {
  const user = userService.userValue; // Get the current user

  // Redirect if the user is not authenticated
  if (!ProtectedRoutes()) {
    return redirect("/user/login");
  }

  try {
    const reports = await reportService.getAll({
      clientId: user.clientId,
    });
    return { reports };
  } catch (error) {
    console.error("Error fetching reports:", error);
    return { reports: [], error: "Failed to fetch reports" }; // Return an empty array and error message
  }
}

export default function Dashboard() {
  const { reports } = useLoaderData();
  const user = userService.userValue; // Get the current user
  const navigate = useNavigate();
  const theme = useTheme(); // Access the theme

  const reportList = [
    {
      name: "Payment Times Reporting Scheme",
      code: "ptrs",
      description: "History of submitted reports",
    },
  ];

  function createReport(report) {
    navigate(`/reports/${report.code}/create`);
  }

  async function continueReport(report) {
    try {
      // No need to fetch savedRecords or pass state; wizard loads from main route
      navigate(`/reports/ptrs/${report.id}`);
    } catch (error) {
      console.error("Error continuing report:", error);
    }
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
              onClick={() => continueReport(row)}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => createReport(row)}
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
        padding: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to Your Dashboard, {user?.firstName} {user?.lastName}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Here you can manage your reports and track their progress
      </Typography>

      <Grid container spacing={3} sx={{ marginTop: theme.spacing(2) }}>
        {reportList.map((report, index) => {
          // Ensure reports is an array before filtering
          const relevantReports = Array.isArray(reports)
            ? reports.filter((r) => r.code === report.code)
            : [];

          const hasCreatedReport = relevantReports.some(
            (r) => r.reportStatus === "Created"
          );

          return (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {report.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    {report.description}
                  </Typography>
                  {relevantReports.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table size="small" aria-label="dense table of reports">
                        <TableHead>
                          <TableRow>
                            <TableCell>Reporting Period Start Date</TableCell>
                            <TableCell>Reporting Period End Date</TableCell>
                            <TableCell>Report Status</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {relevantReports.map((row) => renderTable(row))}
                        </TableBody>
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
                  {!hasCreatedReport && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => createReport(report)}
                      sx={{ marginTop: theme.spacing(2) }}
                    >
                      Create New Report
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
