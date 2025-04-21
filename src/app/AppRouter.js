import React, { Component } from "react";
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
} from "react-router";
import Layout from "../components/generic/Layout";
import LandingPage from "../components/generic/LandingPage";
import RootErrorBoundary from "../components/navigation/RootErrorBoundary";
import Login, { loginAction } from "../features/users/Login";
import { Box } from "@mui/material";
import { userService } from "../features/users/user.service";
import Users, { usersLoader } from "../features/users/Users";
import Clients, { clientsLoader } from "../features/clients/Clients";
import Dashboard, { dashboardLoader } from "../features/users/Dashboard";
import CreateReport, {
  createReportAction,
  createReportLoader,
} from "../features/reports/CreateReport";
import XeroCredentials, { xeroAction } from "../pages/ptrs/XeroCredentials";
import { useReportContext } from "../context/ReportContext";
import ReportFrame, { reportFrameLoader } from "../pages/ptrs/ReportFrame";
import AuthLayout from "../utils/AuthLayout";
import ProtectedRoutes from "../utils/ProtectedRoutes";

// TODO: Implement user and role auth check
// TODO: Implement ReportMain and ReportLayout
// TODO: Optimise the whole thing: https://reactrouter.com/tutorials/address-book

export default function AppRouter() {
  const reportContext = useReportContext();
  const router = createBrowserRouter([
    {
      path: "",
      Component: Layout,
      HydrateFallback: Fallback,
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
              // Component: AuthLayout,
              children: [
                {
                  path: "dashboard",
                  Component: Dashboard,
                  loader: (args) =>
                    dashboardLoader({
                      ...args,
                      context: { reportContext },
                    }),
                },
              ],
            },
            {
              path: "login",
              Component: Login,
              action: loginAction,
            },
          ],
        },
        // Clients
        {
          path: "/clients",
          Component: Clients,
          loader: clientsLoader,
        },
        // Reports
        {
          path: "reports",
          children: [
            { index: true, Component: ReportsMain, loader: ReportsLoader },
            {
              Component: ReportsLayout,
              children: [
                {
                  path: ":code/create",
                  Component: CreateReport,
                  // loader: createReportLoader,
                  action: (args) =>
                    createReportAction({
                      ...args,
                      context: { reportContext },
                    }),
                },
                {
                  path: ":code/xero-credentials",
                  Component: XeroCredentials,
                  action: (args) =>
                    xeroAction({
                      ...args,
                      context: { reportContext },
                    }),
                },
                {
                  path: ":code/update",
                  Component: ReportFrame,
                  loader: (args) =>
                    reportFrameLoader({
                      ...args,
                      context: { reportContext },
                    }),
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

// Temporary Reports main, loader and layout components
function ReportsMain() {
  // const { reports } = useLoaderData();
  // console.log("ReportsMain reports", reports);
  return (
    <Box>
      <h1>Reports</h1>
      <p>List of reports will be here.</p>
    </Box>
  );
}

function ReportsLoader() {
  console.log("ReportsLoader");
  if (!ProtectedRoutes()) {
    return redirect("/user/login");
  }
}

function ReportsLayout() {
  return (
    <Box>
      <h1>Reports</h1>
      <Outlet />
    </Box>
  );
}

function Fallback() {
  return (
    <Box>
      <h1>Loading...</h1>
    </Box>
  );
}
// function ProtectedRoutes() {
//   const user = userService.userValue; // Get the current user
//   console.log("ProtectedRoutes user", user); // Log the user for debugging
//   if (!user) {
//     return redirect("/user/login"); // Redirect to login page if not authenticated
//   }
//   return <Outlet />; // Render child routes if authenticated
// }
// function ProtectedRoute({ children }) {
//   const user = userService.userValue; // Get the current user
//   console.log("ProtectedRoute user", user); // Log the user for debugging
//   if (!user) {
// return <Navigate to="/user/login" replace />; // Redirect to login page if not authenticated
//   }
//   return children; // Render child routes if authenticated
// }
// }
