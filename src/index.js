import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./app/router";
import { ThemeProvider } from "@mui/material/styles";
import globalTheme from "./theme/globalTheme";
import { AuthProvider } from "./context/AuthContext";
import { ReportProvider } from "./context/ReportContext"; // Import ReportProvider
import { userService } from "./features/users/user.service";

// attempt silent token refresh before startup
userService
  .refreshToken()
  .then(() => {
    // console.log("Silent token refresh successful");
  })
  .catch((error) => {
    console.warn("Silent token refresh failed:", error.message || error);
    userService.logout(); // Ensure user is logged out on failure
  })
  .finally(startApp);

function startApp() {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <AuthProvider>
        <ReportProvider>
          {/* Wrap the application with ReportProvider */}
          <ThemeProvider theme={globalTheme}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </ReportProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}
