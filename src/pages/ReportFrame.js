import React, { useState } from "react";
import { Box, Grid, Button, Collapse } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";
import SectionForm from "./SectionForm";
import { entities } from "../data/entityFields";
import { clients } from "../data/mockClients";
import { payments } from "../data/paymentFields";
import { finance } from "../data/financeFields";

const sectionsConfig = {
  entity: { fields: entities, xeroData: clients },
  payments: { fields: payments, xeroData: clients },
  finance: { fields: finance, xeroData: clients },
  // Add more sections here as needed
};

const ReportFrame = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState(
    Object.keys(sectionsConfig).reduce((acc, section) => {
      acc[section] = false;
      return acc;
    }, {})
  );

  const handleConfirm = () => {
    navigate("/final-review");
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {Object.entries(sectionsConfig).map(([section, config]) => (
            <Box key={section} sx={{ mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => toggleSection(section)}
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
                    />
                  </Box>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => toggleSection(section)}
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
    </Box>
  );
};

export default ReportFrame;
