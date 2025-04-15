import React, { useEffect, useState } from "react";
import { Box, Grid, Button, Collapse, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLoaderData, useNavigate } from "react-router";
// import SectionForm from "./SectionForm";
import { clients } from "../../data/clientFields";
// import { clients } from "../../data/mockClients";
import { payments } from "../../data/paymentFields";
import { finance } from "../../data/financeFields";
import { admin } from "../../data/adminFields";
import { users } from "../../data/mockUsers";
import { clientService } from "../../features/clients/client.service";
import { userService } from "../../features/users/user.service";
import { useReportContext } from "../../context/ReportContext";
import { paymentService } from "../../services/payment.service";

export async function reportFrameLoader({ params }) {
  console.log("reportFrameLoader params", params);
}

export async function _reportFrameLoader(reportContext) {
  console.log("reportFrameLoader", reportContext);
  const { reportDetails } = reportContext;
  // Needs to be updated to extract all relevant data from the database
  if (reportDetails) {
    try {
      const user = await userService.refreshToken();
      const client = await clientService.getById(user.clientId);
      console.log("reportFrameLoader client", client);
      if (!client) {
        throw new Response("reportFrameLoader client problem", { status: 500 });
      }
      // const payments = await paymentService.getByReportId(reportDetails.id);
      // if (!payments) {
      //   throw new Response("reportFrameLoader payments problem", {
      //     status: 500,
      //   });
      // }
      // return { client, payments };
      return { client };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
}

export default function ReportFrame() {
  return <Box>ReportFrame</Box>;
}

function _ReportFrame() {
  const { reportDetails } = useReportContext(); // Access context
  console.log("ReportFrame Details:", reportDetails);
  const { client } = useLoaderData();
  // const { client, payments } = useLoaderData();
  console.log("ReportFrame Client Data:", client);

  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  const sectionsConfig = {
    client: { fields: clients, xeroData: client },
    payments: { fields: payments, xeroData: clients },
    finance: { fields: finance, xeroData: clients },
    admin: { fields: admin, xeroData: users },
    // Add more sections here as needed
  };

  const [expandedSections, setExpandedSections] = useState(
    Object.keys(sectionsConfig).reduce((acc, section) => {
      acc[section] = false;
      return acc;
    }, {})
  );

  // useEffect(() => {
  //   const subscription = userService.user.subscribe((x) => setUser(x));
  //   return () => subscription.unsubscribe();
  // }, []);

  // useEffect(() => {
  //   if (!reportDetails) {
  //     navigate("/user/dashboard"); // Redirect if reportDetails is missing
  //   }
  // }, [reportDetails, navigate]);

  const handleConfirm = () => {
    navigate("/invoice-metrics");
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
                      {/* <SectionForm
                        section={section}
                        fields={config.fields}
                        xeroData={config.xeroData}
                        user={user}
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

// export default ReportFrame;
