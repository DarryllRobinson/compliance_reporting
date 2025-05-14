import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { useAlert, useReportContext } from "../context/";
import Layout from "../components/generic/Layout";
import LandingPage from "../components/generic/LandingPage";
import RootErrorBoundary from "../components/navigation/RootErrorBoundary";
import Fallback from "../components/generic/Fallback";

// Publicly available
import Contact from "../components/generic/Contact";
import PublicEntityNavigator from "../components/generic/PublicEntityNavigator";
// Testing pdf email
import PTRSolution from "../components/generic/PTRSolution";

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

// PTRS
import ReportWizard from "../features/reports/ptrs/ReportWizard";
// import EntityFlowChart from "../features/reports/ptrs/EntityFlowChart";
import CreateReport, {
  createReportAction,
} from "../features/reports/ptrs/CreateReport";
import ConnectExternalSystems from "../features/reports/ptrs/ConnectExternalSystems";
import StepsOverview from "../features/reports/ptrs/StepsOverview";
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
          path: "entity-navigator",
          Component: PublicEntityNavigator,
        },
        {
          path: "contact",
          Component: Contact,
        },
        {
          path: "ptr-solution",
          Component: PTRSolution,
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
                // PTRS Wizard uses step-based route pattern: /reports/ptrs/stepX/:reportId
                {
                  path: ":code/step1/:reportId",
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
