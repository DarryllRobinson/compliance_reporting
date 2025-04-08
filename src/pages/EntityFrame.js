import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Grid,
  Button,
  Checkbox,
  Collapse,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";

const EntityFrame = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    entity: false,
    payments: false,
    invoices: false,
    arrangements: false,
    details: false,
    submitter: false,
    approver: false,
  });

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
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {Object.keys(expandedSections).map((section) => (
              <Box key={section} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => toggleSection(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}{" "}
                </Button>
                {expandedSections[section] && (
                  <Box sx={{ mt: 1, pl: 2 }}>
                    {/* Placeholder for importing different groups of the full report */}
                    <Typography variant="body2">
                      Content for {section}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Grid>
        </Grid>
      </form>
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button variant="contained" color="primary" onClick={handleConfirm}>
          Confirm and Proceed
        </Button>
      </Box>
    </Box>
  );
};

export default EntityFrame;
