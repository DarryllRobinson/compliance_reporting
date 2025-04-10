import React, { useEffect, useState } from "react";
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
import { clientService } from "../../features/clients/client.service";

const SectionForm = ({ fields = [], xeroData = [{}] }) => {
  const theme = useTheme();

  useEffect(() => {
    async function checkDB() {
      // check if entity record exists
      const id = await clientService.getById();
      console.log("Client ID:", id);
      // if exists, set id from database response
      // if not, create a new entity record}
    }
    checkDB();
  }, []);

  const [fieldStatus, setFieldStatus] = useState(
    fields.reduce((acc, field) => {
      const isFieldPresent = xeroData[0]?.hasOwnProperty(
        field.name.toLowerCase()
      );
      acc[field.name] = {
        value: isFieldPresent ? xeroData[0][field.name.toLowerCase()] : "",
        checked: false,
      };
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = Object.entries(fieldStatus).reduce(
      (acc, [fieldName, status]) => {
        acc[fieldName] = status.value;
        return acc;
      },
      {}
    );
    console.log("Data to submit:", dataToSubmit);
    clientService
      .update(dataToSubmit)
      .then((response) => {
        console.log("Data submitted successfully:", response);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };

  const renderField = (field) => {
    const isFieldPresent = xeroData[0]?.hasOwnProperty(
      field.name.toLowerCase()
    );
    const placeholder = isFieldPresent
      ? xeroData[0][field.name.toLowerCase()]
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
            value={fieldStatus[field.name]?.value || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            variant="outlined"
            sx={{
              ...theme.typography.body2,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}
          />
          <Checkbox
            checked={fieldStatus[field.name]?.checked || false}
            onChange={() => handleCheckboxChange(field.name)}
            sx={{
              ml: 1,
              color: fieldStatus[field.name]?.value
                ? fieldStatus[field.name]?.checked
                  ? theme.palette.success.main
                  : theme.palette.warning.light
                : theme.palette.error.light,
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

export default SectionForm;
