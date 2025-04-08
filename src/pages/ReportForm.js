import React, { useState } from "react";
import { Box, TextField, Typography, Grid, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fields } from "../data/reportFields";
import { users } from "../data/mockUsers";
import { clients } from "../data/mockClients";
import { calculateInvoiceMetrics } from "../utils/invoiceCalculations";

const ReportForm = () => {
  const theme = useTheme();
  const metrics = calculateInvoiceMetrics();
  const [fieldStatus, setFieldStatus] = useState(
    fields.reduce((acc, field) => {
      acc[field.name] = false;
      return acc;
    }, {})
  );
  //   console.log("metrics", metrics);

  const handleCheckboxChange = (fieldName) => {
    setFieldStatus((prevStatus) => ({
      ...prevStatus,
      [fieldName]: !prevStatus[fieldName],
    }));
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
              ) : field.name === "NumberInvoicesPaidWithin20DaysOfReceipt" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={metrics[0]?.number ?? ""}
                  placeholder="The proportion, determined by total number, of small business invoices paid by the reporting entity during the reporting period within 20 calendar days after the day of receipt day"
                  variant="outlined"
                  sx={{
                    ...theme.typography.body1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              ) : field.name === "NumberInvoicesPaidBetween21And30Days" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={metrics[1]?.number ?? ""}
                  placeholder="The proportion, determined by total number, of small business invoices paid by the reporting entity during the reporting period between 21 and 30 calendar days after the day of receipt"
                  variant="outlined"
                  sx={{
                    ...theme.typography.body1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              ) : field.name === "NumberInvoicesPaidBetween31And60Days" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={metrics[2]?.number ?? ""}
                  placeholder="The proportion, determined by total number, of small business invoices paid by the reporting entity during the reporting period between 31 and 60 calendar days after the day of receipt"
                  variant="outlined"
                  sx={{
                    ...theme.typography.body1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              ) : field.name === "NumberInvoicesPaidBetween61And90Days" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={metrics[3]?.number ?? ""}
                  placeholder="The proportion, determined by total number, of small business invoices paid by the reporting entity during the reporting period between 61 and 90 calendar days after the day of receipt"
                  variant="outlined"
                  sx={{
                    ...theme.typography.body1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              ) : field.name === "NumberInvoicesPaidBetween91And120Days" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={metrics[4]?.number ?? ""}
                  placeholder="The proportion, determined by total number, of small business invoices paid by the reporting entity during the reporting period between 91 and 120 calendar days after the day of receipt"
                  variant="outlined"
                  sx={{
                    ...theme.typography.body1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              ) : field.name === "NumberInvoicesPaidInMoreThan120Days" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={metrics[5]?.number ?? ""}
                  placeholder="The proportion, determined by total number, of small business invoices paid by the reporting entity during the reporting period more than 120 calendar days after the day of receipt"
                  variant="outlined"
                  sx={{
                    ...theme.typography.body1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              ) : field.name === "ValueInvoicesPaidWithin20Days" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={
                    metrics[0]?.value != null
                      ? `$${metrics[0]?.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, " ")}`
                      : ""
                  }
                  placeholder="$0.00"
                  variant="outlined"
                  sx={{
                    ...theme.typography.body1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              ) : field.name === "ValueInvoicesPaidBetween21And30Days" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={
                    metrics[1]?.value != null
                      ? `$${metrics[1]?.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, " ")}`
                      : ""
                  }
                  placeholder="$0.00"
                  variant="outlined"
                  sx={{
                    ...theme.typography.body1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              ) : field.name === "ValueInvoicesPaidBetween31And60Days" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={
                    metrics[2]?.value != null
                      ? `$${metrics[2]?.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, " ")}`
                      : ""
                  }
                  placeholder="$0.00"
                  variant="outlined"
                  sx={{
                    ...theme.typography.body1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              ) : field.name === "ValueInvoicesPaidBetween61And90Days" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={
                    metrics[3]?.value != null
                      ? `$${metrics[3]?.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, " ")}`
                      : ""
                  }
                  placeholder="$0.00"
                  variant="outlined"
                  sx={{
                    ...theme.typography.body1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              ) : field.name === "ValueInvoicesPaidBetween91And120Days" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={
                    metrics[4]?.value != null
                      ? `$${metrics[4]?.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, " ")}`
                      : ""
                  }
                  placeholder="$0.00"
                  variant="outlined"
                  sx={{
                    ...theme.typography.body1,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              ) : field.name === "ValueInvoicesPaidInMoreThan120Days" ? (
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={
                    metrics[5]?.value != null
                      ? `$${metrics[5]?.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, " ")}`
                      : ""
                  }
                  placeholder="$0.00"
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
    </Box>
  );
};

export default ReportForm;
