import { useEffect, useState, useMemo } from "react";
import { Outlet, useLocation } from "react-router";
import { Box, Button, CssBaseline, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";
import ProcessFlow from "../../features/reports/ptrs/ProcessFlow";
import { Alert, Snackbar } from "@mui/material";
import globalTheme from "../../theme/globalTheme"; // Ensure the import matches the export

export default function Layout() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const location = useLocation();
  const [isAuthorized] = useState(true); // Track authorization status

  const theme = useMemo(() => {
    const mode = isDarkTheme ? "dark" : "light"; // Determine the mode
    return globalTheme(mode); // Use the globalTheme function
  }, [isDarkTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkTheme(mediaQuery.matches); // Set initial theme based on system preference

    const handleChange = (event) => setIsDarkTheme(event.matches);
    mediaQuery.addEventListener("change", handleChange); // Listen for system theme changes

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Scroll to the top of the screen when the pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleTheme = () => setIsDarkTheme((prev) => !prev); // Toggle between light and dark modes

  const showProcessFlow = ["/reports/ptr/"].some((path) =>
    location.pathname.startsWith(path)
  );

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage] = useState("");
  const [alertSeverity] = useState("info");

  if (!isAuthorized) {
    // Fallback UI for unauthorized users
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Typography variant="h4" color="text.primary" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You are not authorised to view this page. Please contact support if
            you believe this is an error.
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Navbar isDarkTheme={isDarkTheme} onToggleTheme={toggleTheme} />
        {showProcessFlow && <ProcessFlow />}
        <Box sx={{ flex: 1 }}>
          <Outlet />
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "flex-start", mt: 2, px: 2 }}
        >
          <Button size="small" href="#">
            ↑ Back to top
          </Button>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
