import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useTheme } from "@mui/material/styles";
import { useAuthContext } from "../../context/AuthContext"; // Assuming an AuthContext exists

export default function ErrorPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isSignedIn } = useAuthContext(); // Check if the user is signed in

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        padding: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Error
      </Typography>
      <Typography variant="body1" gutterBottom>
        Sorry, an unexpected error has occurred.
      </Typography>
      <Box sx={{ display: "flex", gap: 2, marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)} // Navigate back to the previous page
        >
          Go Back
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/")} // Navigate to the home page
        >
          Home
        </Button>
        {isSignedIn && (
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/dashboard")} // Navigate to the dashboard
          >
            Dashboard
          </Button>
        )}
      </Box>
    </Box>
  );
}
