import React, { useState } from "react";
import { Box, TextField, Typography, Grid, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fields } from "../data/entityFields";
import { users } from "../data/mockUsers";
import { clients } from "../data/mockClients";
import { useNavigate } from "react-router";

const EntityForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
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

  const handleConfirm = () => {
    navigate("/final-review");
  };

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
      <form>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              {field.name}
              {field.name === "SubmitterFirstName" ||
              field.name === "SubmitterLastName" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={
                    field.name === "SubmitterFirstName"
                      ? (users[0]?.firstName ?? "")
                      : (users[0]?.lastName ?? "")
                  }
                  placeholder={
                    field.name === "SubmitterFirstName"
                      ? "First Name"
                      : "Last Name"
                  }
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
                  value={clients[0]?.name ?? ""}
                  placeholder="Business Name"
                  variant="outlined"
                  sx={{
                    ...theme.typography.body1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              ) : field.name === "ABN" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={clients[0]?.abn ?? ""}
                  placeholder="ABN"
                  variant="outlined"
                  sx={{
                    ...theme.typography.body1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              ) : field.name === "ACN" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={clients[0]?.acn ?? ""}
                  placeholder="ACN"
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
            Save Changes
          </Button>
        </Box>
      </form>
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button variant="contained" color="primary" onClick={handleConfirm}>
          Confirm and Proceed
        </Button>
      </Box>
    </Box>
  );
};

export default EntityForm;
