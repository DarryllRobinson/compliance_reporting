import React, { useEffect } from "react";
import { Form, redirect, useNavigate, useLocation } from "react-router";
import {
  Box,
  Button,
  TextField,
  useTheme,
  Paper,
  Grid,
  Typography,
} from "@mui/material";
import { useReportContext } from "../../context/ReportContext"; // Import ReportContext
// import { userService } from "../../features/users/user.service";

// export async function xeroLoader() {
//   const user = await userService.refreshToken();
//   if (!user) {
//     throw new Response("xeroLoader refreshToken problem", {
//       status: 500,
//     });
//   }
// }

export async function xeroAction({ request, context }) {
  // Extract reportContext from the context parameter
  const { reportContext } = context;

  // await userService.refreshToken();
  const formData = await request.formData();
  let xeroDetails = Object.fromEntries(formData);

  const { username, password } = xeroDetails;
  try {
    // Xero login
    // const xeroLogin = await reportService.xeroLogin();
    // console.log("Xero login response:", xeroLogin);
    return redirect(`/reports/${reportContext.reportDetails.code}/review`);
  } catch (error) {
    console.error("Error logging to Xero:", error);
  }
}

export default function XeroCredentials() {
  const { reportDetails } = useReportContext(); // Access context
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 800,
          width: "100%",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Report Details
        </Typography>
        {reportDetails ? (
          <Box>
            <Typography variant="body1">
              Report Name: {reportDetails.reportName}
            </Typography>
            <Typography variant="body1">
              Reporting Period Start Date:{" "}
              {
                new Date(reportDetails.ReportingPeriodStartDate)
                  .toISOString()
                  .split("T")[0]
              }
            </Typography>
            <Typography variant="body1">
              Reporting Period End Date:{" "}
              {
                new Date(reportDetails.ReportingPeriodEndDate)
                  .toISOString()
                  .split("T")[0]
              }
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1">No report details available.</Typography>
        )}
        <Form
          method="post"
          id="xero-login-form"
          style={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <input
            type="hidden"
            name="reportDetails"
            value={JSON.stringify(reportDetails || {})}
          />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Xero Username"
                name="username"
                type="string"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Xero Password"
                name="password"
                type="password"
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Form>
      </Paper>
    </Box>
  );
}
