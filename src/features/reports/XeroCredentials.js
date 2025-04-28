import React from "react";
import { Form } from "react-router";
import { Box, Button, TextField, useTheme, Paper, Grid } from "@mui/material";

function handleSubmit(setXeroSuccess) {
  setXeroSuccess(true);
}

export default function XeroCredentials(props) {
  const { setXeroSuccess } = props;
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        // minHeight: "100vh",
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
        <Box sx={{ mb: 2 }}>Xero Credentials</Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Xero Username"
              name="username"
              type="string"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Xero Password"
              name="password"
              type="password"
              fullWidth
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleSubmit(setXeroSuccess);
          }}
          fullWidth
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </Paper>
    </Box>
  );
}
