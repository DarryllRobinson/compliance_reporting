import React from "react";
import { createBrowserRouter } from "react-router";

import Layout, { layoutLoader } from "../components/generic/Layout";
import ErrorPage from "../components/navigation/ErrorPage";
import LandingPage from "../components/generic/LandingPage";
import CreateReport, {
  reportCreateAction,
  // reportCreateLoader,
} from "../features/reports/CreateReport";
import ReportForm from "../pages/ptrs/ReportForm";
import InvoiceMetrics from "../pages/ptrs/InvoiceMetrics";
import ReviewRecords from "../pages/ptrs/ReviewRecords";
import SelectReport from "../pages/ptrs/SelectReport";
import XeroCredentials, {
  xeroAction,
  xeroLoader,
} from "../pages/ptrs/XeroCredentials";
import ReportFrame, { reportFrameLoader } from "../pages/ptrs/ReportFrame";
import FinalReview from "../pages/ptrs/FinalReview";
import Login, { loginAction } from "../features/users/Login";
import LoginErrorPage from "../features/users/LoginErrorPage";
import Clients, { clientsLoader } from "../features/clients/Clients";
import ClientRegister, {
  clientRegisterAction,
} from "../features/clients/Register";
import Users, { usersLoader } from "../features/users/Users";
import UserCreate, {
  userCreateAction,
  userCreateLoader,
} from "../features/users/Create";
import VerifyEmail from "../features/users/VerifyEmail";
import Dashboard, { dashboardLoader } from "../features/users/Dashboard";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />, // Ensure Layout is optimized
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      { path: "/report", element: <ReportForm /> },
      { path: "/review", element: <InvoiceMetrics /> },
      { path: "/review/:index", element: <ReviewRecords /> },
      { path: "select-report", element: <SelectReport /> },
      {
        path: "xero-credentials",
        element: <XeroCredentials />,
        action: xeroAction,
        // loader: xeroLoader,
      },
      {
        path: "create-report",
        element: <CreateReport />,
        // loader: reportCreateLoader,
        action: reportCreateAction,
      },
      {
        path: "review-report",
        element: <ReportFrame />,
        loader: reportFrameLoader,
      },
      { path: "invoice-metrics", element: <InvoiceMetrics /> },
      { path: "final-review", element: <FinalReview /> },
      {
        path: "/users",
        element: <Users />,
        loader: usersLoader,
      },
      {
        path: "/user/create",
        element: <UserCreate />,
        loader: userCreateLoader,
        action: userCreateAction,
      },
      {
        path: "/user/dashboard",
        element: <Dashboard />,
        loader: dashboardLoader,
      },
      { path: "/user/verify-email", element: <VerifyEmail /> },
      { path: "/login", element: <Login />, action: loginAction },
      {
        path: "/clients",
        element: <Clients />,
        loader: clientsLoader,
      },
      {
        path: "/clients/register",
        element: <ClientRegister />,
        action: clientRegisterAction,
      },
    ],
  },
]);

export default router;
