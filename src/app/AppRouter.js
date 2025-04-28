import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { useAlert } from "../context/AlertContext";
import Layout from "../components/generic/Layout";
import LandingPage from "../components/generic/LandingPage";
import RootErrorBoundary from "../components/navigation/RootErrorBoundary";
import Login, { loginAction } from "../features/users/Login";
import Users, { usersLoader } from "../features/users/Users";
import Clients, { clientsLoader } from "../features/clients/Clients";
import ClientRegister, {
  clientRegisterLoader,
  clientRegisterAction,
} from "../features/clients/Register";
import Dashboard, { dashboardLoader } from "../features/users/Dashboard";
import ReportsMain from "../features/reports/ReportsMain";
import ReportsLayout from "../features/reports/ReportsLayout";
import CreateReport, {
  createReportAction,
} from "../features/reports/CreateReport";
import XeroCredentials, {
  xeroAction,
} from "../features/reports/XeroCredentials";
import { useReportContext } from "../context/ReportContext";
import ReportFrame, {
  reportFrameLoader,
} from "../features/reports/ReportFrame";
import ReportErrorBoundary from "../components/navigation/ReportErrorBoundary";
import Fallback from "../components/generic/Fallback";
import { reportLayoutLoader } from "../features/reports/ReportsLayout";
import InvoiceMetrics from "../features/reports/ptrs/InvoiceMetrics";
import ReviewRecords from "../features/reports/ptrs/ReviewRecords";
import FinalReview, {
  finalReviewLoader,
} from "../features/reports/ptrs/FinalReview";
import ClientsLayout, {
  clientLayoutLoader,
} from "../features/clients/ClientsLayout";
import UsersLayout, { usersLayoutLoader } from "../features/users/UsersLayout";
import UsersErrorBoundary from "../features/users/UsersErrorBoundary";
import CreateUser, {
  createUserAction,
  createUserLoader,
} from "../features/users/CreateUser";
import ForgotPassword, {
  forgotPasswordAction,
} from "../features/users/ForgotPassword";
import ResetPassword from "../features/users/ResetPassword";

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
              ErrorBoundary: UsersErrorBoundary,
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
                  path: ":code/create",
                  Component: CreateReport,
                  // loader: createReportLoader,
                  action: (args) =>
                    createReportAction({
                      ...args,
                      context: { reportContext, alertContext },
                    }),
                },
                {
                  path: ":code/xero-credentials",
                  Component: XeroCredentials,
                  action: (args) =>
                    xeroAction({
                      ...args,
                      context: { reportContext, alertContext },
                    }),
                },
                {
                  path: ":code/update",
                  Component: ReportFrame,
                  loader: (args) =>
                    reportFrameLoader({
                      ...args,
                      context: { reportContext, alertContext },
                    }),
                },
                {
                  path: ":code/invoice",
                  Component: InvoiceMetrics,
                },
                {
                  path: ":code/invoice/review/:index",
                  Component: ReviewRecords,
                },
                {
                  path: ":code/review",
                  Component: FinalReview,
                  loader: (args) =>
                    finalReviewLoader({
                      ...args,
                      context: { reportContext, alertContext },
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
