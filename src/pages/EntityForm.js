import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Grid,
  Button,
  Checkbox,
  Tooltip,
} from "@mui/material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { useTheme } from "@mui/material/styles";
import { fields } from "../data/entityFields";
import { clients } from "../data/mockClients";

const EntityForm = () => {
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

  const handleSelectAll = () => {
    const allConfirmed = Object.values(fieldStatus).every((status) => status);
    setFieldStatus(
      fields.reduce((acc, field) => {
        acc[field.name] = !allConfirmed;
        return acc;
      }, {})
    );
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
                  <Typography variant="h6">
                    {field.name}
                    <Tooltip title={field.label}>
                      <InfoOutlined />
                    </Tooltip>
                  </Typography>
                </Box>
                {field.name === "BusinessName" ? (
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TextField
                      fullWidth
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
    </Box>
  );
};

export default EntityForm;
