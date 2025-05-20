import { Box } from "@mui/material";
import { Outlet, redirect } from "react-router";
import ProtectedRoutes from "../../lib/utils/ProtectedRoutes";

export function clientLayoutLoader({ context }) {
  const { alertContext } = context;
  if (!ProtectedRoutes("Admin")) {
    alert("User is not authorized to view this page");
    alertContext.sendAlert("error", "You are not authorised to view this page");
    return redirect("/user/dashboard");
  }
}

export default function ClientsLayout() {
  return (
    <Box>
      {/* <h1>Clients</h1> */}
      <Outlet />
    </Box>
  );
}
