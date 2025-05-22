import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "../components/layout/Layout";
import LandingPage from "../components/common/LandingPage";
import RootErrorBoundary from "../components/navigation/RootErrorBoundary";
import Fallback from "../components/common/Fallback";

// Publicly available
import Contact from "../components/common/Contact";
import PublicComplianceNavigator from "../components/common/PublicComplianceNavigator";
import PTRSolution from "../components/common/PTRSolution";
import ResourcePage from "../components/common/ResourcePage";
import { SubmissionChecklistViewer } from "../components/common/SubmissionChecklistViewer";

// Policy documents
import ClientServiceAgreement from "../components/policies/ClientServiceAgreement";
import PrivacyPolicy from "../components/policies/PrivacyPolicy";

// Static page viewer
import StaticPageViewer from "../components/StaticPageViewer";

// Testing pdf email
import TestPdfEmail from "../components/common/TestPdfEmail";

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

// Reports
import ReportErrorBoundary from "../components/navigation/ReportErrorBoundary";
import ReportsLayout from "../features/reports/ReportsLayout";

// PTRS
import ReportWizard from "../features/reports/ptrs/ReportWizard";
import CreateReport from "../features/reports/ptrs/CreateReport";
import ConnectExternalSystems from "../features/reports/ptrs/ConnectExternalSystems";
import StepsOverview from "../features/reports/ptrs/StepsOverview";
import GettingStartedPage from "../components/common/GettingStarted";
import FAQ from "../components/common/FAQ";
import Booking from "../components/common/Booking";
import ContactThankyou from "../components/common/ContactThankyou";
import BookingThankyou from "../components/common/BookingThankyou";
import BlogIndex from "../routes/BlogIndex";
import LegalDisclaimer from "../components/policies/LegalDisclaimer";

import ProtectedRoute from "../components/navigation/ProtectedRoute";
import Role from "../context";

import { protectedRoutes } from "../routes/routeConfig";
import { publicRoutes } from "../routes/publicRoutes";

// TODO: Optimise the whole thing: https://reactrouter.com/tutorials/address-book

export default function AppRouter() {
  const router = createBrowserRouter([
    {
      path: "",
      Component: Layout,
      HydrateFallback: Fallback,
      ErrorBoundary: RootErrorBoundary,
      children: [
        {
          path: "unauthorised",
          Component: () => (
            <RootErrorBoundary
              status={403}
              title="Access Denied"
              message="You don't have permission to view this page."
            />
          ),
        },
        {
          index: true,
          Component: LandingPage,
        },
        // Static page viewer and blog index
        {
          path: "/blog",
          Component: BlogIndex,
        },
        {
          path: "/blog/:slug",
          Component: StaticPageViewer,
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
          path: "test-pdf-email",
          Component: TestPdfEmail,
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
          path: "resources",
          Component: ResourcePage,
        },
        {
          path: "resources/submission-checklist",
          Component: SubmissionChecklistViewer,
        },
        {
          path: "thankyou-booking",
          Component: BookingThankyou,
        },
        // Policy documents
        {
          path: "policy-documents/client-service-agreement",
          Component: ClientServiceAgreement,
        },
        {
          path: "policy-documents/privacy-policy",
          Component: PrivacyPolicy,
        },
        {
          path: "policy-documents/legal",
          Component: LegalDisclaimer,
        },
        // Public user routes
        {
          path: "/user",
          children: [
            {
              path: "login",
              Component: Login,
            },
            {
              path: "forgot-password",
              Component: ForgotPassword,
            },
            {
              path: "reset-password",
              Component: ResetPassword,
            },
          ],
        },
        ...publicRoutes,
        // Protected routes dynamically inserted from routeConfig.js
        ...protectedRoutes.map(({ requiredRoles, ...route }) => ({
          path: route.path,
          Component: () =>
            requiredRoles ? (
              <ProtectedRoute requiredRoles={requiredRoles} />
            ) : (
              <ProtectedRoute />
            ),
          children: route.children,
        })),
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
