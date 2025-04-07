import React, { useState } from "react";
import { Box, TextField, Typography, Grid, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fields } from "../data/reportFields";
import { users } from "../data/mockUsers";
import { clients } from "../data/mockClients";

const ReportForm = () => {
  const theme = useTheme();
  const [fieldStatus, setFieldStatus] = useState(
    fields.reduce((acc, field) => {
      acc[field.name] = false;
      return acc;
    }, {})
  );

  const handleCheckboxChange = (fieldName) => {
    setFieldStatus((prevStatus) => ({
      ...prevStatus,
      [fieldName]: !prevStatus[fieldName],
    }));
  };

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ color: theme.palette.text.primary }}
      >
        Report Form
      </Typography>
      <form>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              {field.name === "SubmitterFirstName" ||
              field.name === "SubmitterLastName" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  placeholder={users[0]?.firstName || "First Name"}
                  variant="outlined"
                  sx={{
                    ...theme.typography.body1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              ) : field.name === "BusinessName" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  placeholder={clients[0]?.businessName || "Business Name"}
                  variant="outlined"
                  sx={{
                    ...theme.typography.body1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              ) : (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  placeholder="Enter value"
                  variant="outlined"
                  sx={{
                    ...theme.typography.body1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              )}
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <input
                  type="checkbox"
                  checked={fieldStatus[field.name]}
                  onChange={() => handleCheckboxChange(field.name)}
                />
                <Typography sx={{ ml: 1, color: theme.palette.text.secondary }}>
                  Confirmed
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ color: theme.palette.text.primary }}
          >
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ReportForm;
