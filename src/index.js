import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import Layout, { layoutLoader } from "./components/generic/Layout";
import ErrorPage from "./components/navigation/ErrorPage";
import LandingPage from "./components/generic/LandingPage";
import ReportForm from "./pages/ReportForm";
import InvoiceMetrics from "./pages/InvoiceMetrics";
import ReviewRecords from "./pages/ReviewRecords";
import SelectReport from "./pages/SelectReport";
import XeroCredentials from "./pages/XeroCredentials";
import ReviewReport from "./pages/ReviewReport";
import FinalReview from "./pages/FinalReview";
import EntityForm from "./pages/EntityForm";

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
      { path: "review-entity", element: <EntityForm /> },
      { path: "invoice-metrics", element: <InvoiceMetrics /> },
      { path: "final-review", element: <FinalReview /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
