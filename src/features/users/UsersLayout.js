import { Box } from "@mui/material";
import { Outlet, redirect } from "react-router";
import ProtectedRoutes from "../../utils/ProtectedRoutes";

export function usersLayoutLoader({ context }) {
  const { alertContext } = context;

  // Check if the user is authorized
  if (!ProtectedRoutes("Admin")) {
    // Prevent multiple alerts by checking if an alert is already active
    if (!alertContext.hasActiveAlert) {
      alertContext.sendAlert(
        "error",
        "You are not authorised to view this page"
      );
      alertContext.hasActiveAlert = true; // Set a flag to indicate an active alert
    }
    return redirect("/user/dashboard");
  }

  // Reset the flag if the user is authorized
  alertContext.hasActiveAlert = false;
}

export default function UsersLayout() {
  return (
    <Box>
      {/* <h1>Users</h1> */}
      <Outlet />
    </Box>
  );
}
