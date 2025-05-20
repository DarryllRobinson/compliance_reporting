import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { clientService, userService } from "../../services";
import { Alert } from "@mui/material";

export default function ClientRegister() {
  const theme = useTheme();
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const [sameAsAddress, setSameAsAddress] = useState(false);
  const [formValues, setFormValues] = useState({
    businessName: "",
    addressline1: "",
    addressline2: "",
    addressline3: "",
    city: "",
    state: "",
    postcode: "",
    country: "Australia",
    postaladdressline1: "",
    postaladdressline2: "",
    postaladdressline3: "",
    postalcity: "",
    postalstate: "",
    postalpostcode: "",
    postalcountry: "Australia",
    // ... add any others as needed
  });

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;

    if (!checked) {
      const confirmClear = window.confirm(
        "Are you sure you want to clear the postal address fields?"
      );
      if (!confirmClear) return;
    }

    setSameAsAddress(checked);

    if (checked) {
      setFormValues((prev) => ({
        ...prev,
        postaladdressline1: prev.addressline1,
        postaladdressline2: prev.addressline2,
        postaladdressline3: prev.addressline3,
        postalcity: prev.city,
        postalstate: prev.state,
        postalpostcode: prev.postcode,
        postalcountry: prev.country,
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        postaladdressline1: "",
        postaladdressline2: "",
        postaladdressline3: "",
        postalcity: "",
        postalstate: "",
        postalpostcode: "",
        postalcountry: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let clientDetails = Object.fromEntries(formData);

    if (
      !clientDetails.businessName ||
      clientDetails.businessName.trim() === ""
    ) {
      setAlert({ type: "error", message: "Business Name is required" });
      return;
    }

    if (!clientDetails.abn || !/^\d{11}$/.test(clientDetails.abn)) {
      setAlert({ type: "error", message: "ABN must be exactly 11 digits" });
      return;
    }

    clientDetails = {
      ...clientDetails,
      active: true,
      createdBy: userService.userValue.id,
    };

    try {
      await clientService.create(clientDetails);
      localStorage.setItem(
        "clientDetails",
        JSON.stringify({
          businessName: clientDetails.businessName,
          contactFirst: clientDetails.contactFirst,
          contactLast: clientDetails.contactLast,
          contactEmail: clientDetails.contactEmail,
          contactPhone: clientDetails.contactPhone,
          contactPosition: clientDetails.contactPosition,
        })
      );
      navigate("/users/create");
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Error creating client",
      });
      console.error("Error creating client:", error);
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
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
        <form
          onSubmit={handleSubmit}
          id="register-client-form"
          style={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Business Name"
                name="businessName"
                type="string"
                fullWidth
                required
                value={formValues.businessName}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    businessName: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="ABN"
                name="abn"
                type="string"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="ACN"
                name="acn"
                type="string"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address Line 1"
                name="addressline1"
                type="string"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Address Line 2"
                name="addressline2"
                type="string"
                fullWidth
                value={formValues.addressline2}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    addressline2: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Address Line 3"
                name="addressline3"
                type="string"
                fullWidth
                value={formValues.addressline3}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    addressline3: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="City"
                name="city"
                type="string"
                fullWidth
                required
                value={formValues.city}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, city: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id="state-select-label">State</InputLabel>
                <Select
                  labelId="state-select-label"
                  name="state"
                  id="state-select"
                  label="State"
                  defaultValue=""
                  required
                  value={formValues.state}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="ACT">ACT</MenuItem>
                  <MenuItem value="NT">NT</MenuItem>
                  <MenuItem value="NSW">NSW</MenuItem>
                  <MenuItem value="QLD">QLD</MenuItem>
                  <MenuItem value="SA">SA</MenuItem>
                  <MenuItem value="TAS">TAS</MenuItem>
                  <MenuItem value="VIC">VIC</MenuItem>
                  <MenuItem value="WA">WA</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Postcode"
                name="postcode"
                type="string"
                fullWidth
                required
                value={formValues.postcode}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    postcode: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Country"
                name="country"
                type="string"
                fullWidth
                required
                value={formValues.country}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sameAsAddress}
                    onChange={handleCheckboxChange}
                    name="sameAsAddress"
                  />
                }
                label="Postal address is the same as the address above"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Postal Address Line 1"
                name="postaladdressline1"
                type="string"
                fullWidth
                required
                value={formValues.postaladdressline1}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    postaladdressline1: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Postal Address Line 2"
                name="postaladdressline2"
                type="string"
                fullWidth
                value={formValues.postaladdressline2}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    postaladdressline2: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Postal Address Line 3"
                name="postaladdressline3"
                type="string"
                fullWidth
                value={formValues.postaladdressline3}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    postaladdressline3: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Postal City"
                name="postalcity"
                type="string"
                fullWidth
                required
                value={formValues.postalcity}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    postalcity: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id="postalstate-select-label">
                  Postal State
                </InputLabel>
                <Select
                  labelId="postalstate-select-label"
                  name="postalstate"
                  id="postalstate-select"
                  label="Postal State"
                  defaultValue=""
                  required
                  value={formValues.postalstate}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      postalstate: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="ACT">ACT</MenuItem>
                  <MenuItem value="NT">NT</MenuItem>
                  <MenuItem value="NSW">NSW</MenuItem>
                  <MenuItem value="QLD">QLD</MenuItem>
                  <MenuItem value="SA">SA</MenuItem>
                  <MenuItem value="TAS">TAS</MenuItem>
                  <MenuItem value="VIC">VIC</MenuItem>
                  <MenuItem value="WA">WA</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Postal Postcode"
                name="postalpostcode"
                type="string"
                fullWidth
                required
                value={formValues.postalpostcode}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    postalpostcode: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Postal Country"
                name="postalcountry"
                type="string"
                fullWidth
                required
                value={formValues.postalcountry}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    postalcountry: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Industry Code"
                name="industryCode"
                type="string"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Contact First Name"
                name="contactFirst"
                type="string"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Contact Last Name"
                name="contactLast"
                type="string"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Contact Position"
                name="contactPosition"
                type="string"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Contact Email"
                name="contactEmail"
                type="email"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Contact Phone"
                name="contactPhone"
                type="string"
                fullWidth
                required
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
        </form>
      </Paper>
    </Box>
  );
}
