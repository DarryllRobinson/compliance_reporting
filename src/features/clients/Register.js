import React, { useState } from "react";
import { Form, redirect } from "react-router";
import {
  Box,
  Typography,
  Button,
  TextField,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  Grid,
} from "@mui/material";
import { userService } from "../../features/users/user.service";
import { clientService } from "./client.service";

export async function clientRegisterAction({ request }) {
  await userService.refreshToken();
  const formData = await request.formData();
  let clientDetails = Object.fromEntries(formData);
  console.log("Client Details:", clientDetails);
  await clientService.create(clientDetails);
  return redirect("/clients");
}

export default function ClientRegister() {
  const theme = useTheme();
  const [errors, setErrors] = useState({});

  const validateForm = (formData) => {
    const newErrors = {};
    if (!formData.clientName) newErrors.clientName = "Client Name is required.";
    if (!formData.abn) newErrors.abn = "ABN is required.";
    if (!formData.acn) newErrors.acn = "ACN is required.";
    if (!formData.contactFirst)
      newErrors.contactFirst = "Contact First Name is required.";
    if (!formData.contactLast)
      newErrors.contactLast = "Contact Last Name is required.";
    if (!formData.contactEmail)
      newErrors.contactEmail = "Contact Email is required.";
    if (!formData.contactPhone)
      newErrors.contactPhone = "Contact Phone is required.";
    if (!formData.industryCode)
      newErrors.industryCode = "Industry Code is required.";
    if (!formData.country) newErrors.country = "Country is required.";
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const clientDetails = Object.fromEntries(formData);
    const validationErrors = validateForm(clientDetails);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      event.target.submit();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 800,
          width: "100%",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Register a New Client
        </Typography>
        <Form
          method="post"
          id="register-client-form"
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Client Name"
                name="clientName"
                type="string"
                fullWidth
                required
                error={!!errors.clientName}
                helperText={errors.clientName}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="ABN"
                name="abn"
                type="string"
                fullWidth
                required
                error={!!errors.abn}
                helperText={errors.abn}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="ACN"
                name="acn"
                type="string"
                fullWidth
                required
                error={!!errors.acn}
                helperText={errors.acn}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address Line 1"
                name="addressline1"
                type="string"
                fullWidth
                required
                error={!!errors.addressline1}
                helperText={errors.addressline1}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Address Line 2"
                name="addressline2"
                type="string"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Address Line 3"
                name="addressline3"
                type="string"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="City"
                name="city"
                type="string"
                fullWidth
                required
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="State"
                name="state"
                type="string"
                fullWidth
                required
                error={!!errors.state}
                helperText={errors.state}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Postcode"
                name="postcode"
                type="string"
                fullWidth
                required
                error={!!errors.postcode}
                helperText={errors.postcode}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Country"
                name="country"
                type="string"
                fullWidth
                required
                error={!!errors.country}
                helperText={errors.country}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Postal Address Line 1"
                name="postaladdressline1"
                type="string"
                fullWidth
                required
                error={!!errors.postaladdressline1}
                helperText={errors.postaladdressline1}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Postal Address Line 2"
                name="postaladdressline2"
                type="string"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Postal Address Line 3"
                name="postaladdressline3"
                type="string"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Postal City"
                name="postalcity"
                type="string"
                fullWidth
                required
                error={!!errors.postalcity}
                helperText={errors.postalcity}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Postal State"
                name="postalstate"
                type="string"
                fullWidth
                required
                error={!!errors.postalstate}
                helperText={errors.postalstate}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Postal Postcode"
                name="postalpostcode"
                type="string"
                fullWidth
                required
                error={!!errors.postalpostcode}
                helperText={errors.postalpostcode}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Postal Country"
                name="postalcountry"
                type="string"
                fullWidth
                required
                error={!!errors.postalcountry}
                helperText={errors.postalcountry}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.industryCode}>
                <InputLabel id="industry-code-select-label">
                  Industry Code
                </InputLabel>
                <Select
                  labelId="industry-code-select-label"
                  name="industryCode"
                  id="industry-code-select"
                  label="Industry Code"
                  defaultValue=""
                  required
                >
                  <MenuItem value="111">111</MenuItem>
                  <MenuItem value="222">222</MenuItem>
                  <MenuItem value="333">333</MenuItem>
                </Select>
                {errors.industryCode && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.industryCode}
                  </Alert>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Contact First Name"
                name="contactFirst"
                type="string"
                fullWidth
                required
                error={!!errors.contactFirst}
                helperText={errors.contactFirst}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Contact Last Name"
                name="contactLast"
                type="string"
                fullWidth
                required
                error={!!errors.contactLast}
                helperText={errors.contactLast}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Contact Position"
                name="contactPosition"
                type="string"
                fullWidth
                required
                error={!!errors.contactPosition}
                helperText={errors.contactPosition}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Contact Email"
                name="contactEmail"
                type="email"
                fullWidth
                required
                error={!!errors.contactEmail}
                helperText={errors.contactEmail}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Contact Phone"
                name="contactPhone"
                type="string"
                fullWidth
                required
                error={!!errors.contactPhone}
                helperText={errors.contactPhone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Controlling Corporation Name"
                name="controllingCorporationName"
                type="string"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Controlling Corporation ABN"
                name="controllingCorporationAbn"
                type="string"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Controlling Corporation ACN"
                name="controllingCorporationAcn"
                type="string"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Head Entity Name"
                name="headEntityName"
                type="string"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Head Entity ABN"
                name="headEntityAbn"
                type="string"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Head Entity ACN"
                name="headEntityAcn"
                type="string"
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register Client
          </Button>
        </Form>
      </Paper>
    </Box>
  );
}
