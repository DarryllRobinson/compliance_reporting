import React, { useEffect, useState, useMemo } from "react";
import { Outlet, useLocation } from "react-router";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";
import ProcessFlow from "../ProcessFlow";
import { userService } from "../../features/users/user.service";

// Need to check if the user is logged in with a silent check to the db
// export async function layoutLoader() {
//   try {
//     const user = await userService.refreshToken();
//     return { user };
//   } catch (error) {
//     console.warn("Silent login failed:", error.message || error);
//     return { user: null }; // Return null user if refresh fails
//   }
// }

export default function Layout() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const location = useLocation();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkTheme ? "dark" : "light",
        },
      }),
    [isDarkTheme]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkTheme(mediaQuery.matches);

    const handleChange = (event) => setIsDarkTheme(event.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => setIsDarkTheme((prev) => !prev);

  const showProcessFlow = [
    "/xero-credentials",
    "/review-report",
    "/invoice-metrics",
    "/final-review",
  ].includes(location.pathname);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
