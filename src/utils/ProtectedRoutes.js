import { userService } from "../features/users/user.service";

export default function ProtectedRoutes(role) {
  const user = userService.userValue; // Get the current user
  // console.log("ProtectedRoutes user", user); // Log the user for debugging
  if (!user) {
    // console.log("User not authenticated, redirecting to login"); // Log if user is not authenticated
    return false;
  } else if (role && user.role !== role) {
    // console.log("User does not have the required role, redirecting to login"); // Log if user does not have the required role
    return false;
  }
  // console.log("User authenticated, rendering child routes"); // Log if user is authenticated
  return true; // Render child routes if authenticated
}
