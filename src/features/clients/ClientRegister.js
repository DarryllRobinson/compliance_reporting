import React from "react";
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
  Grid,
} from "@mui/material";
import { clientService } from "../../services";

export async function clientRegisterAction({ request, context }) {
  const { alertContext } = context;
  const formData = await request.formData();
  let clientDetails = Object.fromEntries(formData);
  clientDetails = { ...clientDetails, active: true };
  try {
    await clientService.create(clientDetails);
    // TODO: Open user creation form after client creation below
    return redirect("/users/create");
  } catch (error) {
    alertContext.sendAlert("error", error || "Error creating client:");
  }
}

export default function ClientRegister() {
  const theme = useTheme();

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
          // onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Business Name"
                name="businessName"
                type="string"
                fullWidth
                // required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="ABN"
                name="abn"
                type="string"
                fullWidth
                // required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="ACN"
                name="acn"
                type="string"
                fullWidth
                // required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address Line 1"
                name="addressline1"
                type="string"
                fullWidth
                // required
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
                // required
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="State"
                name="state"
                type="string"
                fullWidth
                // required
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Postcode"
                name="postcode"
                type="string"
                fullWidth
                // required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Country"
                name="country"
                type="string"
                fullWidth
                // required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Postal Address Line 1"
                name="postaladdressline1"
                type="string"
                fullWidth
                // required
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
                // required
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Postal State"
                name="postalstate"
                type="string"
                fullWidth
                // required
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Postal Postcode"
                name="postalpostcode"
                type="string"
                fullWidth
                // required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Postal Country"
                name="postalcountry"
                type="string"
                fullWidth
                // required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="industry-code-select-label">
                  Industry Code
                </InputLabel>
                <Select
                  labelId="industry-code-select-label"
                  name="industryCode"
                  id="industry-code-select"
                  label="Industry Code"
                  defaultValue=""
                  // required
                >
                  <MenuItem value="111">111</MenuItem>
                  <MenuItem value="222">222</MenuItem>
                  <MenuItem value="333">333</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Contact First Name"
                name="contactFirst"
                type="string"
                fullWidth
                // required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Contact Last Name"
                name="contactLast"
                type="string"
                fullWidth
                // required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Contact Position"
                name="contactPosition"
                type="string"
                fullWidth
                // required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Contact Email"
                name="contactEmail"
                type="email"
                fullWidth
                // required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Contact Phone"
                name="contactPhone"
                type="string"
                fullWidth
                // required
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
