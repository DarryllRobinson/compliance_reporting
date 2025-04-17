import { Outlet, redirect } from "react-router";
import { userService } from "../features/users/user.service";

export default function ProtectedRoutes() {
  const user = userService.userValue; // Get the current user
  console.log("ProtectedRoutes user", user); // Log the user for debugging
  if (!user) {
    return redirect("/user/login"); // Redirect to login page if not authenticated
  }
  return <Outlet />; // Render child routes if authenticated
}
