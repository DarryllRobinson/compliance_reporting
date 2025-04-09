import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./app/router";
import { userService } from "./features/users/user.service";

// Attempt silent token refresh before startup
userService
  .refreshToken()
  .catch((error) => {
    if (error.response && error.response.status === 404) {
      console.warn("Token refresh endpoint not found (404).");
    } else {
      console.warn("Token refresh failed:", error.message || error);
    }
  })
  .finally(startApp);

function startApp() {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
  );
}
