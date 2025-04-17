import React from "react";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  useLoaderData,
} from "react-router";
import Layout from "../components/generic/Layout";
import LandingPage from "../components/generic/LandingPage";
import RootErrorBoundary from "../components/navigation/RootErrorBoundary";
import Login, { loginAction } from "../features/users/Login";
import { Box } from "@mui/material";
import { userService } from "../features/users/user.service";
import Users, { usersLoader } from "../features/users/Users";

// TODO: Implement user and role auth check

export default function AppRouter() {
  const router = createBrowserRouter([
    {
      path: "",
      Component: Layout,
      ErrorBoundary: RootErrorBoundary,
      children: [
        {
          index: true,
          Component: LandingPage,
        },
        // Users
        {
          path: "/users",
          children: [{ index: true, Component: Users, loader: usersLoader }],
        },
        // User
        {
          path: "/user",
          children: [
            // { index: true, Component: Users },
            {
              path: "dashboard",
              Component: Dashboard,
              loader: dashboardLoader,
            },
            {
              path: "login",
              Component: Login,
              action: loginAction,
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

// function Users() {
//   return (
//     <Box>
//       <h2>Users</h2>
//       <p>List of users will go here.</p>
//     </Box>
//   );
// }

async function dashboardLoader({ params }) {
  const user = userService.userValue; // Get the current user
  if (!user) {
    return redirect("/user/login");
  }
  console.log("Dashboard loader params", params);
  return { message: "Hello World!" };
}

function Dashboard() {
  let data = useLoaderData();
  return (
    <Box>
      <h2>Dashboard</h2>
      <p>Dashboard content will go here.</p>
      <p>Dashboard message: {data.message}</p>
    </Box>
  );
}
