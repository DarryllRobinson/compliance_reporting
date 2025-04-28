import React, { useState } from "react";
import { Box, Grid, Button, Collapse, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { redirect, useLoaderData, useNavigate } from "react-router";
// import SectionForm from "./ptrs/SectionForm";
import { clientFields } from "../../data/clientFields";
import { paymentFields } from "../../data/paymentFields";
import { financeFields } from "../../data/financeFields";
import { submissionFields } from "../../data/submissionFields";
import { clientService } from "../../features/clients/client.service";
import { userService } from "../../features/users/user.service";
import { useReportContext } from "../../context/ReportContext";
import {
  financeService,
  paymentService,
  submissionService,
} from "../../services";
import ProtectedRoutes from "../../utils/ProtectedRoutes";

export async function reportFrameLoader({ context }) {
  if (!ProtectedRoutes()) {
    return redirect("/user/dashboard");
  }

  const { reportDetails } = context.reportContext;
  const { alertContext } = context;

  try {
    const user = userService.userValue;
    const client = await clientService.getById(user.clientId);
    const finance = await financeService.getByReportId(reportDetails.reportId);
    const payments = await paymentService.getByReportId(reportDetails.reportId);
    const submission = await submissionService.getByReportId(
      reportDetails.reportId
    );

    console.log("ReportFrame Loader data", {
      client,
      finance,
      payments,
      submission,
    });
    // Handle missing data gracefully
    return {
      client: client || null,
      finance: finance || null,
      payments: payments || null,
      submission: submission || null,
    };
  } catch (error) {
    alertContext.sendAlert("error", error.message || "Error loading data");
    console.error("Error fetching data:", error);
    throw error; // Only throw if it's a critical error
  }
}

export default function ReportFrame() {
  const { client, finance, payments, submission } = useLoaderData();
  console.log("ReportFrame rendered");
  const navigate = useNavigate();
  const theme = useTheme();
  const { reportDetails } = useReportContext(); // Access context

  const sectionsConfig = {
    client: { fields: clientFields, xeroData: client },
    payments: { fields: paymentFields, xeroData: payments },
    finance: { fields: financeFields, xeroData: finance },
    submission: { fields: submissionFields, xeroData: submission },
  };

  const [expandedSections, setExpandedSections] = useState(
    Object.keys(sectionsConfig).reduce((acc, section) => {
      acc[section] = false;
      return acc;
    }, {})
  );

  const handleConfirm = () => {
    navigate(`/reports/${reportDetails.code}/invoice`);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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
          width: "100%",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {Object.entries(sectionsConfig).map(([section, config]) => (
              <Box key={section} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => toggleSection(section)}
                  fullWidth
                >
                  {expandedSections[section]
                    ? `Collapse ${section.charAt(0).toUpperCase() + section.slice(1)}`
                    : `Expand ${section.charAt(0).toUpperCase() + section.slice(1)}`}
                </Button>
                <Collapse in={expandedSections[section]}>
                  {expandedSections[section] && (
                    <Box sx={{ mt: 1, pl: 2 }}>
                      {/* <SectionForm
                        section={section}
                        fields={config.fields}
                        xeroData={config.xeroData}
                      /> */}
                      SectionForm
                    </Box>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => toggleSection(section)}
                    fullWidth
                  >
                    {expandedSections[section]
                      ? `Collapse ${section.charAt(0).toUpperCase() + section.slice(1)}`
                      : `Expand ${section.charAt(0).toUpperCase() + section.slice(1)}`}
                  </Button>
                </Collapse>
              </Box>
            ))}
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button variant="contained" color="primary" onClick={handleConfirm}>
            Confirm and Proceed
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
