import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import Layout, { layoutLoader } from "./components/generic/Layout";
import ErrorPage from "./components/navigation/ErrorPage";
import LandingPage from "./components/generic/LandingPage";
import ReportForm from "./pages/ptrs/ReportForm";
import InvoiceMetrics from "./pages/ptrs/InvoiceMetrics";
import ReviewRecords from "./pages/ptrs/ReviewRecords";
import SelectReport from "./pages/ptrs/SelectReport";
import XeroCredentials from "./pages/ptrs/XeroCredentials";
import ReportFrame from "./pages/ptrs/ReportFrame";
import FinalReview from "./pages/ptrs/FinalReview";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />, // Replace placeholder with Layout component
    errorElement: <ErrorPage />, // Add ErrorPage for error handling
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
      { path: "review-report", element: <ReportFrame /> },
      { path: "invoice-metrics", element: <InvoiceMetrics /> },
      { path: "final-review", element: <FinalReview /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
