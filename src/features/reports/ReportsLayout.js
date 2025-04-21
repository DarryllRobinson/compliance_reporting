import { Box } from "@mui/material";
import { Outlet, redirect } from "react-router";
import ProtectedRoutes from "../../utils/ProtectedRoutes";

export function reportLayoutLoader() {
  if (!ProtectedRoutes()) {
    return redirect("/user/dashboard");
  }
}

export default function ReportsLayout() {
  return (
    <Box>
      {/* <h1>Reports</h1> */}
      <Outlet />
    </Box>
  );
}
