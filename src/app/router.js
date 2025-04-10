import React from "react";
import { createBrowserRouter } from "react-router";

import Layout, { layoutLoader } from "../components/generic/Layout";
import ErrorPage from "../components/navigation/ErrorPage";
import LandingPage from "../components/generic/LandingPage";
import ReportForm from "../pages/ptrs/ReportForm";
import InvoiceMetrics from "../pages/ptrs/InvoiceMetrics";
import ReviewRecords from "../pages/ptrs/ReviewRecords";
import SelectReport from "../pages/ptrs/SelectReport";
import XeroCredentials from "../pages/ptrs/XeroCredentials";
import ReportFrame, { reportFrameLoader } from "../pages/ptrs/ReportFrame";
import FinalReview from "../pages/ptrs/FinalReview";
import SignIn, { loginAction } from "../features/users/SignIn";
import SignUp, { signupAction } from "../features/users/SignUp";
import LoginErrorPage from "../features/users/LoginErrorPage";
import Clients, { clientsLoader } from "../features/clients/Clients";
import ClientRegister, {
  clientRegisterAction,
} from "../features/clients/Register";
const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />, // Replace placeholder with Layout component
    errorElement: <ErrorPage />, // Add ErrorPage for error handling
    loader: layoutLoader, // Add layoutLoader for user authentication
    children: [
      {
        index: true,
        element: <LandingPage />, // Replace placeholder with LandingPage component
      },
      { path: "/report", element: <ReportForm /> }, // Add ReportForm route
      { path: "/review", element: <InvoiceMetrics /> }, // Add InvoiceMetrics route
      { path: "/review/:index", element: <ReviewRecords /> }, // Add ReviewRecords route with index parameter
      { path: "select-report", element: <SelectReport /> },
      { path: "xero-credentials", element: <XeroCredentials /> },
      {
        path: "review-report",
        element: <ReportFrame />,
        loader: reportFrameLoader,
      },
      { path: "invoice-metrics", element: <InvoiceMetrics /> },
      { path: "final-review", element: <FinalReview /> },
      {
        path: "/signin",
        element: <SignIn />,
        errorElement: <LoginErrorPage />,
        action: loginAction,
      },
      {
        path: "/signup",
        element: <SignUp />,
        errorElement: <LoginErrorPage />,
        action: loginAction,
      },
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
