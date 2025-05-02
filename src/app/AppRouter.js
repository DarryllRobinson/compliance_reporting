import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { useAlert, useReportContext } from "../context/";
import Layout from "../components/generic/Layout";
import LandingPage from "../components/generic/LandingPage";
import RootErrorBoundary from "../components/navigation/RootErrorBoundary";
import Fallback from "../components/generic/Fallback";

// Users
import Users, { usersLoader } from "../features/users/Users";
import UsersLayout, { usersLayoutLoader } from "../features/users/UsersLayout";
import CreateUser, {
  createUserAction,
  createUserLoader,
} from "../features/users/CreateUser";

// User
import Dashboard, { dashboardLoader } from "../features/users/Dashboard";
import ForgotPassword, {
  forgotPasswordAction,
} from "../features/users/ForgotPassword";
import ResetPassword from "../features/users/ResetPassword";
import Login, { loginAction } from "../features/users/Login";

// Clients
import Clients, { clientsLoader } from "../features/clients/Clients";
import ClientsLayout, {
  clientLayoutLoader,
} from "../features/clients/ClientsLayout";
import ClientRegister, {
  clientRegisterAction,
} from "../features/clients/ClientRegister";

// Reports
import ReportErrorBoundary from "../components/navigation/ReportErrorBoundary";
import ReportsMain from "../features/reports/ReportsMain";
import ReportsLayout, {
  reportLayoutLoader,
} from "../features/reports/ReportsLayout";
// import CreateReport, {
//   createReportAction,
// } from "../features/reports/CreateReport";
// import ReportFrame, {
//   reportFrameLoader,
// } from "../features/reports/ReportFrame";
// import CreatePtrs, {
//   createPtrsAction,
// } from "../features/reports/ptrs/CreatePtrs";
// import UpdatePtrs, {
//   updatePtrsLoader,
// } from "../features/reports/ptrs/UpdatePtrs";
import CreateReport, {
  createReportAction,
} from "../features/reports/ptrs/CreateReport";
import ConnectExternalSystems from "../features/reports/ptrs/ConnectExternalSystems";
import ReviewRecords, {
  reviewRecordsLoader,
} from "../features/reports/ptrs/ReviewRecords";
import StepsOverview from "../features/reports/ptrs/StepsOverview";

// TODO: Optimise the whole thing: https://reactrouter.com/tutorials/address-book

export default function AppRouter() {
  const reportContext = useReportContext();
  const alertContext = useAlert();
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
          children: [
            { index: true, Component: Users, loader: usersLoader },
            {
              Component: UsersLayout,
              loader: (args) =>
                usersLayoutLoader({
                  ...args,
                  context: { alertContext },
                }),
              children: [
                {
                  path: "create",
                  Component: CreateUser,
                  action: (args) =>
                    createUserAction({
                      ...args,
                      context: { alertContext },
                    }),
                  loader: createUserLoader,
                },
              ],
            },
          ],
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
                {
                  path: "forgot-password",
                  Component: ForgotPassword,
                  action: (args) =>
                    forgotPasswordAction({
                      ...args,
                      context: { alertContext },
                    }),
                },
                {
                  path: "reset-password",
                  Component: ResetPassword,
                  // action: (args) =>
                  //   forgotPasswordAction({
                  //     ...args,
                  //     context: { alertContext },
                  //   }),
                },
              ],
            },
            {
              path: "login",
              Component: Login,
              action: (args) =>
                loginAction({
                  ...args,
                  context: { alertContext },
                }),
            },
          ],
        },
        // Clients
        {
          path: "/clients",
          children: [
            {
              index: true,
              Component: Clients,
              loader: clientsLoader,
            },
            {
              Component: ClientsLayout,
              loader: clientLayoutLoader,
              children: [
                // Register
                {
                  path: "register",
                  Component: ClientRegister,
                  action: (args) =>
                    clientRegisterAction({
                      ...args,
                      context: { alertContext },
                    }),
                },
              ],
            },
          ],
        },
        // Reports
        {
          path: "reports",
          children: [
            { index: true, Component: ReportsMain },
            {
              Component: ReportsLayout,
              ErrorBoundary: ReportErrorBoundary,
              loader: (args) =>
                reportLayoutLoader({ ...args, context: { alertContext } }),
              children: [
                {
                  // Create PTRS Report
                  path: ":code/create",
                  Component: CreateReport,
                  action: (args) =>
                    createReportAction({
                      ...args,
                      context: { alertContext, reportContext },
                    }),
                },
                {
                  // Connect to external data source and review records
                  path: ":code/report/:reportId",
                  Component: ReviewRecords,
                  loader: (args) =>
                    reviewRecordsLoader({
                      ...args,
                      context: { alertContext, reportContext },
                    }),
                },
                { path: "steps", Component: StepsOverview },
              ],
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
