import React, { useEffect, useState } from "react";
import { Box, Grid, Button, Collapse, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";
import SectionForm from "./SectionForm";
import { clients } from "../../data/clientFields";
// import { clients } from "../../data/mockClients";
import { payments } from "../../data/paymentFields";
import { finance } from "../../data/financeFields";
import { report } from "../../data/reportFields";
import { users } from "../../data/mockUsers";
import { clientService } from "../../features/clients/client.service";
import { userService } from "../../features/users/user.service";

const sectionsConfig = {
  client: { fields: clients, xeroData: clients },
  payments: { fields: payments, xeroData: clients },
  finance: { fields: finance, xeroData: clients },
  report: { fields: report, xeroData: users },
  // Add more sections here as needed
};

export async function reportFrameLoader() {
  try {
    userService.refreshToken();
    console.log("reportFrameLoader");
    const response = await clientService.getAll();
    console.log("Response from API:", response);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const ReportFrame = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  const [expandedSections, setExpandedSections] = useState(
    Object.keys(sectionsConfig).reduce((acc, section) => {
      acc[section] = false;
      return acc;
    }, {})
  );

  useEffect(() => {
    const subscription = userService.user.subscribe((x) => setUser(x));
    return () => subscription.unsubscribe();
  }, []);

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
                      <SectionForm
                        fields={config.fields}
                        xeroData={config.xeroData}
                        user={user}
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
};

export default ReportFrame;
