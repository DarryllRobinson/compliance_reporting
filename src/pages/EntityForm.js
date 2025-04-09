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
      acc[field.name] = { value: "", checked: false };
      return acc;
    }, {})
  );

  const handleCheckboxChange = (fieldName) => {
    setFieldStatus((prevStatus) => ({
      ...prevStatus,
      [fieldName]: {
        ...prevStatus[fieldName],
        checked: !prevStatus[fieldName].checked,
      },
    }));
  };

  const handleInputChange = (fieldName, value) => {
    setFieldStatus((prevStatus) => ({
      ...prevStatus,
      [fieldName]: {
        ...prevStatus[fieldName],
        value,
      },
    }));
    console.log(fieldName, value);
  };

  const handleSelectAll = () => {
    const allChecked = Object.values(fieldStatus).every(
      (status) => status.checked
    );
    setFieldStatus(
      fields.reduce((acc, field) => {
        acc[field.name] = {
          ...fieldStatus[field.name],
          checked: !allChecked,
        };
        return acc;
      }, {})
    );
  };

  // Template function to log the state to the console
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(fieldStatus);
  };

  const renderField = (field) => {
    const isFieldPresent = clients[0]?.hasOwnProperty(field.name.toLowerCase());
    const placeholder = isFieldPresent
      ? clients[0][field.name.toLowerCase()]
      : "Enter info";

    return (
      <Grid item xs={12} sm={6} md={4} key={field.name}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontSize: "0.875rem" }}>
            {field.name}
            <Tooltip title={field.label}>
              <InfoOutlined fontSize="small" />
            </Tooltip>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <TextField
            fullWidth
            size="small"
            name={field.name}
            placeholder={placeholder}
            value={
              fieldStatus[field.name]?.value ||
              (isFieldPresent ? placeholder : "")
            }
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            variant="outlined"
            sx={{
              ...theme.typography.body2,
              backgroundColor:
                !fieldStatus[field.name]?.value &&
                !clients[0]?.[field.name.toLowerCase()]
                  ? theme.palette.error.light
                  : theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}
          />
          <Checkbox
            checked={fieldStatus[field.name]?.checked || false}
            disabled={!fieldStatus[field.name]?.value}
            onChange={() => handleCheckboxChange(field.name)}
            sx={{
              ml: 1,
              color: !fieldStatus[field.name]?.value
                ? theme.palette.error.light
                : fieldStatus[field.name]?.checked
                  ? theme.palette.success.main
                  : theme.palette.warning.light,
            }}
          />
        </Box>
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
      <Box sx={{ mb: 2 }}>
        <Checkbox onChange={handleSelectAll} />
        <Typography component="span">Confirm All</Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSubmit}
          sx={{ ml: 2 }}
        >
          State Check
        </Button>
      </Box>
      <form>
        <Grid container spacing={1}>
          {fields.map((field) => renderField(field))}
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
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
