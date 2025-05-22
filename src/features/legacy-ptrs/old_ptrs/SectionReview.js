import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Grid,
  Checkbox,
  Tooltip,
} from "@mui/material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { useTheme } from "@mui/material/styles";

const SectionReview = ({
  section = "",
  fields = [],
  xeroData = {},
  onConfirm,
}) => {
  const theme = useTheme();

  // Normalise xeroData keys to lowercase
  const normalisedXeroData = Object.keys(xeroData).reduce((acc, key) => {
    acc[key.toLowerCase()] = xeroData[key];
    return acc;
  }, {});

  const [fieldStatus] = useState(
    fields.reduce((acc, field) => {
      const isFieldPresent = normalisedXeroData.hasOwnProperty(
        field.name.toLowerCase()
      );
      acc[field.name] = {
        value: isFieldPresent
          ? normalisedXeroData[field.name.toLowerCase()]
          : null,
        checked: false,
      };
      return acc;
    }, {})
  );

  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsConfirmed(e.target.checked);
    if (e.target.checked) {
      onConfirm(); // Notify parent when confirmed
    }
  };

  const renderField = (field) => {
    const fieldKey = field.name.toLowerCase();
    const isFieldPresent =
      normalisedXeroData.hasOwnProperty(fieldKey) &&
      normalisedXeroData[fieldKey] !== undefined &&
      normalisedXeroData[fieldKey] !== null &&
      normalisedXeroData[fieldKey] !== "";

    const placeholder = isFieldPresent
      ? normalisedXeroData[fieldKey]
      : "No info provided";

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
            {field.label}
            <Tooltip title={field.tip}>
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
            variant="outlined"
            disabled
            sx={{
              ...theme.typography.body2,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}
          />
        </Box>
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
      <Box sx={{ mb: 2 }}>
        <Checkbox checked={isConfirmed} onChange={handleCheckboxChange} />
        <Typography component="span">
          Confirm {section.toUpperCase()}
        </Typography>
      </Box>
      <Grid container spacing={1}>
        {fields.map((field) => renderField(field))}
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Checkbox checked={isConfirmed} onChange={handleCheckboxChange} />
        <Typography component="span">
          Confirm {section.toUpperCase()}
        </Typography>
      </Box>
    </Box>
  );
};

export default SectionReview;
