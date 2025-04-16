import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "../components/generic/Layout";
import LandingPage from "../components/generic/LandingPage";
import ErrorPage from "../components/navigation/ErrorPage";

export default function AppRouter() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
