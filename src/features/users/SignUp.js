import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
  useTheme, // Import useTheme
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { userService } from './user.service';
import { alertService } from '../../_services';

const theme = createTheme();

export default function SignUp() {
  const theme = useTheme(); // Use the MUI useTheme hook
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: 'Darryll',
    lastName: 'Robinson',
    email: 'darryllrobinson@icloud.com',
    password: 'newpassss',
    confirmPassword: 'newpassss',
    acceptTerms: false,
    acceptMarketing: false,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleTermsChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
  };

  const handleMarketingChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    userService
      .register(formData)
      .then(() => {
        alertService.success(
          'Sign up successful, please check your email for verification instructions',
          {
            keepAfterRouteChange: true,
          }
        );
        navigate('/user/signin');
      })
      .catch((error) => {
        alertService.caller(
          error,
          // { keepAfterRouteChange: true },
          null,
          'Sign up problem',
          'error'
        );
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: theme.palette.background.default, // Use theme for background
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: theme.palette.secondary.main }}> {/* Use theme */}
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                defaultValue={formData.firstName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                defaultValue={formData.lastName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                defaultValue={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                defaultValue={formData.password}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="confirm-password"
                defaultValue={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.acceptTerms}
                    color="primary"
                    name="acceptTerms"
                  />
                }
                label="I accept the terms and conditions."
                onChange={handleTermsChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.acceptMarketing}
                    color="primary"
                    name="acceptMarketing"
                  />
                }
                label="I want to receive inspiration, marketing promotions and updates via email."
                onChange={handleMarketingChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            disabled={!formData.acceptTerms}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/user/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
