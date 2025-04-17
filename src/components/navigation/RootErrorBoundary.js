import React, { useEffect } from "react";
import * as Sentry from "@sentry/react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router";
import { useTheme } from "@mui/material/styles";
import { useAuthContext } from "../../context/AuthContext";

export default function RootErrorBoundary() {
  const theme = useTheme();
  const navigate = useNavigate?.() || (() => {}); // Fallback to a no-op function
  const { isSignedIn } = useAuthContext?.() || { isSignedIn: false }; // Fallback to default values
  const error = useRouteError?.() || null; // Fallback to null if useRouteError is unavailable

  let title = "Something went wrong";
  let message = "An unexpected error has occurred.";

  if (isRouteErrorResponse?.(error)) {
    switch (error.status) {
      case 404:
        title = "Page Not Found";
        message = "Sorry, we couldn't find what you were looking for.";
        break;
      case 401:
        title = "Unauthorised";
        message = "You must be logged in to view this page.";
        break;
      case 403:
        title = "Forbidden";
        message = "You don't have permission to view this page.";
        break;
      default:
        title = `${error.status} ${error.statusText}`;
        message =
          error.data?.message || "An error occurred while loading the page.";
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  useEffect(() => {
    if (error) {
      console.error("Route error:", error);
      Sentry.captureException(error, {
        tags: { location: "RootErrorBoundary" },
        extra: {
          pathname: window.location.pathname,
          isSignedIn,
        },
      });
    }
  }, [error, isSignedIn]);

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
        {title}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {message}
      </Typography>
      <Box sx={{ display: "flex", gap: 2, marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/")}
        >
          Home
        </Button>
        {isSignedIn && (
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/users/dashboard")}
          >
            Dashboard
          </Button>
        )}
      </Box>
    </Box>
  );
}
