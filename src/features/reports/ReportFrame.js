import React, { useState } from "react";
import { Box, Grid, Button, Collapse, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { redirect, useLoaderData, useNavigate } from "react-router";
import SectionForm from "./SectionForm";
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

export async function reportFrameLoader(reportContext) {
  if (!ProtectedRoutes()) {
    return redirect("/user/dashboard");
  }

  const { reportDetails } = reportContext.context.reportContext;
  // console.log("reportFrameLoader reportDetails", reportDetails);
  // Needs to be updated to extract all relevant data from the database
  // if (reportDetails) {
  try {
    // const user = await userService.refreshToken();
    const user = userService.userValue;
    const client = await clientService.getById(user.clientId);
    // console.log("reportFrameLoader client", client);
    if (!client) {
      throw new Response("reportFrameLoader client problem", { status: 500 });
    }
    const finance = await financeService.getByReportId(reportDetails.reportId);
    if (!finance) {
      throw new Response("reportFrameLoader finance problem", {
        status: 500,
      });
    }
    const payments = await paymentService.getByReportId(reportDetails.reportId);
    if (!payments) {
      throw new Response("reportFrameLoader payments problem", {
        status: 500,
      });
    }
    const submission = await submissionService.getByReportId(
      reportDetails.reportId
    );
    if (!submission) {
      throw new Response("reportFrameLoader submission problem", {
        status: 500,
      });
    }
    return { client, finance, payments, submission };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  // }
}

export default function ReportFrame() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { reportDetails } = useReportContext(); // Access context
  // console.log("ReportFrame Details:", reportDetails);
  // const { client } = useLoaderData();
  const { client, finance, payments, submission } = useLoaderData();
  // console.log(
  //   "ReportFrame Client Data:",
  //   client,
  //   finance,
  //   payments,
  //   submission
  // );

  const sectionsConfig = {
    client: { fields: clientFields, xeroData: client },
    payments: { fields: paymentFields, xeroData: payments },
    finance: { fields: financeFields, xeroData: finance },
    submission: { fields: submissionFields, xeroData: submission },
    // Add more sections here as needed
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
          // maxWidth: 1000,
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
                      <SectionForm
                        section={section}
                        fields={config.fields}
                        xeroData={config.xeroData}
                      />
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
