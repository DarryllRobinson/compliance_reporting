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
import CreateReport, {
  createReportAction,
} from "../features/reports/ptrs/CreateReport";
import ConnectExternalSystems from "../features/reports/ptrs/ConnectExternalSystems";
import StepsOverview from "../features/reports/ptrs/StepsOverview";
import Step1, { step1Loader } from "../features/reports/ptrs/Step1";
import Step2, { step2Loader } from "../features/reports/ptrs/Step2";
import Step3, { step3Loader } from "../features/reports/ptrs/Step3";
import Step4, { step4Loader } from "../features/reports/ptrs/Step4";
import Step5, { step5Loader } from "../features/reports/ptrs/Step5";

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
                  // Connect to external data source
                  path: ":code/:reportId/connect",
                  Component: ConnectExternalSystems,
                },
                {
                  // Step 1: TCP Dataset
                  path: ":code/step1/:reportId",
                  Component: Step1,
                  loader: (args) =>
                    step1Loader({
                      ...args,
                      context: { alertContext, reportContext },
                    }),
                },
                {
                  // Step 2: Capture additional required details for each TCP (Peppol enabled eInvoice, RCTI, Credit Card Payment, Credit Card Number, Partial Payment, Payment Term, Excluded TCPs
                  path: ":code/step2/:reportId",
                  Component: Step2,
                  loader: (args) =>
                    step2Loader({
                      ...args,
                      context: { alertContext, reportContext },
                    }),
                },
                {
                  // Step 3: Run TCP extract against SBI tool and upload SBI results to highlight Small Business TCPs
                  path: ":code/step3/:reportId",
                  Component: Step3,
                  loader: (args) =>
                    step3Loader({
                      ...args,
                      context: { alertContext, reportContext },
                    }),
                },
                {
                  // Step 4:
                  path: ":code/step4/:reportId",
                  Component: Step4,
                  loader: (args) =>
                    step4Loader({
                      ...args,
                      context: { alertContext, reportContext },
                    }),
                },
                {
                  // Step 5:
                  path: ":code/step5/:reportId",
                  Component: Step5,
                  loader: (args) =>
                    step5Loader({
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
