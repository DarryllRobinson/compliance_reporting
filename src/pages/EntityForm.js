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
  const [expandedSections, setExpandedSections] = useState(
    fields.reduce((acc, field) => {
      acc[field.name] = true;
      return acc;
    }, {})
  );

  const handleCheckboxChange = (fieldName) => {
    setFieldStatus((prevStatus) => ({
      ...prevStatus,
      [fieldName]: !prevStatus[fieldName],
    }));
  };

  const handleSelectAll = () => {
    const allConfirmed = Object.values(fieldStatus).every((status) => status);
    setFieldStatus(
      fields.reduce((acc, field) => {
        acc[field.name] = !allConfirmed;
        return acc;
      }, {})
    );
  };

  const toggleSection = (fieldName) => {
    setExpandedSections((prevSections) => ({
      ...prevSections,
      [fieldName]: !prevSections[fieldName],
    }));
  };

  const handleConfirm = () => {
    navigate("/final-review");
  };

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
      <Box sx={{ mb: 2 }}>
        <Checkbox onChange={handleSelectAll} />
        <Typography component="span">Confirm All</Typography>
      </Box>
      <form>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} key={field.name}>
              <Box
                sx={{
                  border: !fieldStatus[field.name] ? "2px solid red" : "none",
                  borderRadius: "4px",
                  marginBottom: "1em",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">{field.label}</Typography>
                  <Button onClick={() => toggleSection(field.name)}>
                    {expandedSections[field.name] ? "Collapse" : "Expand"}
                  </Button>
                </Box>
                <Collapse in={expandedSections[field.name]}>
                  {field.name === "SubmitterFirstName" ||
                  field.name === "SubmitterLastName" ? (
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
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
                      <Box sx={{ ml: 2 }}>
                        <input
                          type="checkbox"
                          checked={fieldStatus[field.name]}
                          onChange={() => handleCheckboxChange(field.name)}
                        />
                        <Typography
                          sx={{ ml: 1, color: theme.palette.text.secondary }}
                        >
                          Confirmed
                        </Typography>
                      </Box>
                    </Box>
                  ) : field.name === "BusinessName" ? (
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
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
                      <Box sx={{ ml: 2 }}>
                        <input
                          type="checkbox"
                          checked={fieldStatus[field.name]}
                          onChange={() => handleCheckboxChange(field.name)}
                        />
                        <Typography
                          sx={{ ml: 1, color: theme.palette.text.secondary }}
                        >
                          Confirmed
                        </Typography>
                      </Box>
                    </Box>
                  ) : field.name === "ABN" ? (
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
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
                      <Box sx={{ ml: 2 }}>
                        <input
                          type="checkbox"
                          checked={fieldStatus[field.name]}
                          onChange={() => handleCheckboxChange(field.name)}
                        />
                        <Typography
                          sx={{ ml: 1, color: theme.palette.text.secondary }}
                        >
                          Confirmed
                        </Typography>
                      </Box>
                    </Box>
                  ) : field.name === "ACN" ? (
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
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
                      <Box sx={{ ml: 2 }}>
                        <input
                          type="checkbox"
                          checked={fieldStatus[field.name]}
                          onChange={() => handleCheckboxChange(field.name)}
                        />
                        <Typography
                          sx={{ ml: 1, color: theme.palette.text.secondary }}
                        >
                          Confirmed
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
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
                      <Box sx={{ ml: 2 }}>
                        <input
                          type="checkbox"
                          checked={fieldStatus[field.name]}
                          onChange={() => handleCheckboxChange(field.name)}
                        />
                        <Typography
                          sx={{ ml: 1, color: theme.palette.text.secondary }}
                        >
                          Confirmed
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Collapse>
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
