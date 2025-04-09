import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router';

function LoginErrorPage() {
  const theme = useTheme(); // Access the theme
  const navigate = useNavigate();

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
      <Typography variant="h4" gutterBottom color={theme.palette.error.main}>
        Login Error
      </Typography>
      <Typography variant="body1" gutterBottom>
        Something went wrong while trying to log you in. Please try again.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/signin')}
      >
        Go Back to Sign In
      </Button>
    </Box>
  );
}

export default LoginErrorPage;
