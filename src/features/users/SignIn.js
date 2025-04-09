import React from 'react';
import { Form, redirect } from 'react-router';
import { Box, Typography, Button, TextField, useTheme } from '@mui/material';
import { userService } from './user.service';

export async function loginAction({ request }) {
  const formData = await request.formData();
  const userDetails = Object.fromEntries(formData);
  await userService.login(userDetails);
  return redirect('/dashboard');
}

export default function SignIn() {
  const theme = useTheme(); // Access the theme

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 2,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Sign In
      </Typography>
      <Form method="post" id="signin-form" style={{ width: '100%', maxWidth: 400 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email address"
            name="email"
            type="email"
            defaultValue="darryllrobinson@icloud.com"
            fullWidth
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            defaultValue="newpassss"
            fullWidth
            required
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Sign In
          </Button>
        </Box>
      </Form>
    </Box>
  );
}
