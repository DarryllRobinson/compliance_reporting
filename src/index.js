import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./app/AppRouter";
import { ThemeProvider } from "@mui/material/styles";
import globalTheme from "./theme/globalTheme";
import { AuthProvider } from "./context/AuthContext";
import { ReportProvider } from "./context/ReportContext"; // Import ReportProvider
import { userService } from "./features/users/user.service";

// Sentry logging
// TODO: Uncomment and configure Sentry
// import * as Sentry from "@sentry/react";
// import { BrowserTracing } from "@sentry/tracing";

// // Optional: import.meta.env.MODE for Vite, process.env.NODE_ENV for others
// Sentry.init({
//   dsn: "https://your-public-key@o123456.ingest.sentry.io/project-id", // Replace this with your real DSN
//   integrations: [new BrowserTracing()],
//   tracesSampleRate: 1.0,
//   environment: process.env.NODE_ENV || "development",
// });

// attempt silent token refresh before startup
userService
  .refreshToken()
  .then(() => {
    console.log("Silent token refresh successful");
  })
  .catch((error) => {
    console.warn("Silent token refresh failed:", error.message || error);
    userService.logout(); // Ensure user is logged out on failure
  })
  .finally(startApp);

function startApp() {
  ReactDOM.createRoot(document.getElementById("root")).render(
    // <AuthProvider>
    //   <ReportProvider>
    <ThemeProvider theme={globalTheme}>
      <AppRouter />
    </ThemeProvider>
    //   </ReportProvider>
    // </AuthProvider>
  );
}
