import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./app/router";
import { userService } from "./features/users/user.service";

<<<<<<< HEAD
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
=======
// Attempt silent token refresh before startup
// userService
//   .refreshToken()
//   .catch((error) => {
//     if (error.response && error.response.status === 404) {
//       console.warn("Token refresh endpoint not found (404).");
//     } else {
//       console.warn("Token refresh failed:", error.message || error);
//     }
//   })
//   .finally(startApp);

startApp();
>>>>>>> 41ba2c2af8190206a4b4162f195d7c3e025c03dd

function startApp() {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
  );
}
