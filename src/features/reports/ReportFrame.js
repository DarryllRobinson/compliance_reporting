import React from "react";
import { Box, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { redirect } from "react-router";
import { useReportContext } from "../../context/ReportContext";
import ProtectedRoutes from "../../utils/ProtectedRoutes";

export async function reportFrameLoader({ context }) {
  if (!ProtectedRoutes()) {
    return redirect("/user/dashboard");
  }

  const { reportDetails } = context.reportContext;
  const { alertContext } = context;

  try {
    // const user = userService.userValue;
    // const client = await clientService.getById(user.clientId);
    // const finance = await financeService.getByReportId(reportDetails.reportId);
    // const payments = await paymentService.getByReportId(reportDetails.reportId);
    // const submission = await submissionService.getByReportId(
    //   reportDetails.reportId
    // );
    // console.log("ReportFrame Loader data", {
    //   client,
    //   finance,
    //   payments,
    //   submission,
    // });
    // // Handle missing data gracefully
    // return {
    //   client: client || null,
    //   finance: finance || null,
    //   payments: payments || null,
    //   submission: submission || null,
    // };
  } catch (error) {
    alertContext.sendAlert("error", error.message || "Error loading data");
    console.error("Error fetching data:", error);
    throw error; // Only throw if it's a critical error
  }
}

export default function ReportFrame({ reportType, metrics }) {
  return (
    <Box>
      <Paper>
        <h2>Report Type: {reportType}</h2>
        {/* Display metrics based on the selected report type */}
        {reportType === "Nil Reporter" ? (
          <p>No payments to small businesses during the reporting period.</p>
        ) : (
          <div>
            <h3>Metrics</h3>
            <pre>{JSON.stringify(metrics, null, 2)}</pre>
          </div>
        )}
      </Paper>
    </Box>
  );
}
