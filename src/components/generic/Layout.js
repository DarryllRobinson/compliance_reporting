import React, { useEffect, useState, useMemo } from "react";
import { Outlet, useLocation } from "react-router";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";
import ProcessFlow from "../../features/reports/ptrs/ProcessFlow";
import { userService } from "../../services";
import Alert from "./Alert";
import { useAlert } from "../../context/AlertContext";
import globalTheme from "../../theme/globalTheme"; // Ensure the import matches the export

export async function layoutLoader({ request }) {
  const user = userService.userValue;
  if (!user) {
    console.log("layoutLoader user problem");
    throw new Response("layoutLoader user problem", { status: 401 });
  }

  // If page not found
  // throw new Response("Page not found", { status: 404 });
}

export default function Layout() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const location = useLocation();

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

  const { alertOpen, severity, message, handleClose } = useAlert();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Alert
        open={alertOpen}
        onClose={handleClose}
        severity={severity}
        message={message}
      />
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
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
