import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { useAlert, useReportContext } from "../context/";
import Layout from "../components/generic/Layout";
import LandingPage from "../components/generic/LandingPage";
import RootErrorBoundary from "../components/navigation/RootErrorBoundary";
import Fallback from "../components/generic/Fallback";

// Publicly available
import Contact from "../components/generic/Contact";
import PublicComplianceNavigator from "../components/generic/PublicComplianceNavigator";
// Testing pdf email
import PTRSolution from "../components/generic/PTRSolution";

// Users
import Users from "../features/users/Users";
import UsersLayout from "../features/users/UsersLayout";
import CreateUser from "../features/users/CreateUser";

// User
import Dashboard from "../features/users/Dashboard";
import ForgotPassword from "../features/users/ForgotPassword";
import ResetPassword from "../features/users/ResetPassword";
import Login from "../features/users/Login";

// Clients
import Clients from "../features/clients/Clients";
import ClientsLayout from "../features/clients/ClientsLayout";
import ClientRegister from "../features/clients/ClientRegister";

// Reports
import ReportErrorBoundary from "../components/navigation/ReportErrorBoundary";
import ReportsMain from "../features/reports/ReportsMain";
import ReportsLayout from "../features/reports/ReportsLayout";

// PTRS
import ReportWizard from "../features/reports/ptrs/ReportWizard";
// import ComplianceFlowChart from "../features/reports/ptrs/ComplianceFlowChart";
import CreateReport from "../features/reports/ptrs/CreateReport";
import ConnectExternalSystems from "../features/reports/ptrs/ConnectExternalSystems";
import StepsOverview from "../features/reports/ptrs/StepsOverview";
import GettingStartedPage from "../components/generic/GettingStarted";
import FAQ from "../components/generic/FAQ";
import Booking from "../components/generic/Booking";
import ContactThankyou from "../components/generic/ContactThankyou";
import BookingThankyou from "../components/generic/BookingThankyou";
// import Step1, { step1Loader } from "../features/reports/ptrs/Step1";
// import Step2, { step2Loader } from "../features/reports/ptrs/Step2";
// import Step3, { step3Loader } from "../features/reports/ptrs/Step3";
// import Step4, { step4Loader } from "../features/reports/ptrs/Step4";
// import Step5, { step5Loader } from "../features/reports/ptrs/Step5";

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
        {
          path: "compliance-navigator",
          Component: PublicComplianceNavigator,
        },
        {
          path: "contact",
          Component: Contact,
        },
        {
          path: "thankyou-contact",
          Component: ContactThankyou,
        },
        {
          path: "ptr-solution",
          Component: PTRSolution,
        },
        {
          path: "getting-started",
          Component: GettingStartedPage,
        },
        {
          path: "faq",
          Component: FAQ,
        },
        {
          path: "booking",
          Component: Booking,
        },
        {
          path: "thankyou-booking",
          Component: BookingThankyou,
        },
        // Users
        {
          path: "/users",
          children: [
            { index: true, Component: Users },
            {
              Component: UsersLayout,
              children: [
                {
                  path: "create",
                  Component: CreateUser,
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
                },
                {
                  path: "forgot-password",
                  Component: ForgotPassword,
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
            },
            {
              Component: ClientsLayout,
              children: [
                // Register
                {
                  path: "register",
                  Component: ClientRegister,
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
              children: [
                {
                  // Create PTRS Report
                  path: ":code/create",
                  Component: CreateReport,
                },
                // PTRS Wizard uses step-based route pattern: /reports/ptrs/stepX/:reportId
                {
                  path: ":code/:reportId",
                  Component: ReportWizard,
                },
                {
                  // Connect to external data source
                  path: ":code/:reportId/connect",
                  Component: ConnectExternalSystems,
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
