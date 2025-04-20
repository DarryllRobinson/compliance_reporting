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
import { clientService } from "../../features/clients/client.service";
import {
  financeService,
  paymentService,
  submissionService,
} from "../../services";
import { useReportContext } from "../../context/ReportContext";
import { userService } from "../../features/users/user.service";

const SectionForm = ({ section = "", fields = [], xeroData = {} }) => {
  // console.log("SectionForm props", section, fields, xeroData);
  const user = userService.userValue;
  const { reportDetails } = useReportContext();
  const theme = useTheme();

  // Normalise xeroData keys to lowercase
  const normalisedXeroData = Object.keys(xeroData).reduce((acc, key) => {
    acc[key.toLowerCase()] = xeroData[key];
    return acc;
  }, {});

  const [fieldStatus, setFieldStatus] = useState(
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

    // Convert all field values to strings, preserving null values
    let dataToSubmit = Object.entries(fieldStatus).reduce(
      (acc, [fieldName, status]) => {
        acc[fieldName] = status.value != null ? String(status.value) : null; // Keep null as null
        return acc;
      },
      {}
    );

    // console.log("Data to submit:", dataToSubmit);

    dataToSubmit = {
      ...dataToSubmit,
      reportId: reportDetails.reportId,
      // createdBy: user.id,
      updatedBy: user.id,
      submittedBy: user.id,
      reportStatus: "Updated",
    };

    // Use a switch block for section-specific logic
    switch (section) {
      case "client":
        // Handle client-specific submission logic here
        // console.log("Submitting client section data...");
        clientService
          .update(user.clientId, dataToSubmit)
          .then((response) => {
            console.log("Client data submitted successfully:", response);
          })
          .catch((error) => {
            console.error("Error submitting client data:", error);
          });
        break;
      case "payments":
        // Handle payments-specific submission logic here
        // console.log("Submitting payments section data...", dataToSubmit);
        try {
          paymentService
            .update(reportDetails.paymentId, dataToSubmit)
            .then((response) => {
              console.log("Payments data submitted successfully:", response);
            });
        } catch (error) {
          console.error("SectionForm payment update error", error);
        }
        break;
      case "finance":
        // Handle finance-specific submission logic here
        // console.log("Submitting finance section data...");
        try {
          financeService
            .update(reportDetails.financeId, dataToSubmit)
            .then((response) => {
              console.log("Finance data submitted successfully:", response);
            });
        } catch (error) {
          console.error("SectionForm finance update error", error);
        }
        break;
      case "submission":
        // Handle submission-specific submission logic here
        // console.log(
        //   "Submitting submission section data...",
        //   reportDetails.submissionId,
        //   dataToSubmit
        // );
        try {
          submissionService
            .update(reportDetails.submissionId, dataToSubmit)
            .then((response) => {
              console.log("Submission data submitted successfully:", response);
            });
        } catch (error) {
          console.error("SectionForm submission update error", error);
        }
        break;
      default:
        console.error("Unknown section:", section);
        return; // Stop submission if section is unknown
    }
  };

  const renderField = (field) => {
    // console.log("Field:", field);
    const fieldKey = field.name.toLowerCase();
    const isFieldPresent =
      normalisedXeroData.hasOwnProperty(fieldKey) &&
      normalisedXeroData[fieldKey] !== undefined &&
      normalisedXeroData[fieldKey] !== null &&
      normalisedXeroData[fieldKey] !== "";

    const placeholder = isFieldPresent
      ? normalisedXeroData[fieldKey]
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
            // label={field.label}
            placeholder={placeholder}
            value={fieldStatus[field.name]?.value || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            variant="outlined"
            disabled={isFieldPresent && section === "client"} // Disable the TextField if isFieldPresent is true
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
