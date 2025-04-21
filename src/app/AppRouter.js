import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "../components/generic/Layout";
import LandingPage from "../components/generic/LandingPage";
import RootErrorBoundary from "../components/navigation/RootErrorBoundary";
import Login, { loginAction } from "../features/users/Login";
import Users, { usersLoader } from "../features/users/Users";
import Clients, { clientsLoader } from "../features/clients/Clients";
import Dashboard, { dashboardLoader } from "../features/users/Dashboard";
import ReportsMain from "../features/reports/ReportsMain";
import ReportsLayout from "../features/reports/ReportsLayout";
import CreateReport, {
  createReportAction,
} from "../features/reports/CreateReport";
import XeroCredentials, { xeroAction } from "../pages/ptrs/XeroCredentials";
import { useReportContext } from "../context/ReportContext";
import ReportFrame, {
  reportFrameLoader,
} from "../features/reports/ReportFrame";
import Fallback from "../components/generic/Fallback";
import { reportLayoutLoader } from "../features/reports/ReportsLayout";
import InvoiceMetrics from "../features/reports/ptrs/InvoiceMetrics";
import ReviewRecords from "../features/reports/ptrs/ReviewRecords";
import FinalReview, {
  finalReviewLoader,
} from "../features/reports/ptrs/FinalReview";

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
            { index: true, Component: ReportsMain },
            {
              Component: ReportsLayout,
              loader: reportLayoutLoader,
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
