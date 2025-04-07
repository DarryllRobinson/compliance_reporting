import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import Layout, { layoutLoader } from "./components/generic/Layout";
import ErrorPage from "./components/navigation/ErrorPage";
import LandingPage from "./components/generic/LandingPage";
import ReportForm from "./pages/ReportForm";
import InvoiceMetrics from "./pages/InvoiceMetrics";

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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
