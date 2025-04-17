import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Layout from "../components/generic/Layout";
import LandingPage from "../components/generic/LandingPage";
import RootErrorBoundary from "../components/navigation/RootErrorBoundary";
import { Box } from "@mui/material";

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
        // User
        {
          path: "/user",
          children: [
            { index: true, Component: Users },
            { path: "dashboard", Component: Dashboard },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

function Users() {
  return (
    <Box>
      <h2>Users</h2>
      <p>List of users will go here.</p>
    </Box>
  );
}

function Dashboard() {
  return (
    <Box>
      <h2>Dashboard</h2>
      <p>Dashboard content will go here.</p>
    </Box>
  );
}
