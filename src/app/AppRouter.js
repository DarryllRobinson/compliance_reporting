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
      element: <Layout />,
      ErrorBoundary: RootErrorBoundary,
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
        // User
        { path: "/users", element: <div>Users</div> },
        {
          path: "/dashboard",
          element: (
            <Box>
              Dashboard
              <Outlet />
            </Box>
          ),
          children: [
            { index: true, element: <Box>Home</Box> },
            { path: "settings", element: <Box>Settings</Box> },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
