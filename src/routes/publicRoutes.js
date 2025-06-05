import ClientRegister from "../features/clients/ClientRegister";

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

import ForgotPassword from "../features/users/ForgotPassword";
import ResetPassword from "../features/users/ResetPassword";
import Login from "../features/users/Login";
import GettingStartedPage from "../components/common/GettingStarted";
import FAQ from "../components/common/FAQ";
import Booking from "../components/common/Booking";
import ContactThankyou from "../components/common/ContactThankyou";
import BookingThankyou from "../components/common/BookingThankyou";
import BlogIndex from "../routes/BlogIndex";
import LegalDisclaimer from "../components/policies/LegalDisclaimer";
import VerifyEmail from "../features/users/VerifyEmail";
import FirstUserRegister from "../features/users/FirstUserRegister";
import ConnectExternalSystemsTest from "../features/reports/ptrs/ConnectExternalSystemsTest";

const isPublicOnlyMode = process.env.REACT_APP_PUBLIC_ONLY === "true";

const allPublicRoutes = [
  {
    path: "/clients/register",
    Component: ClientRegister,
  },
  { path: "/clients/register-first-user", Component: FirstUserRegister },
  {
    path: "/user/login",
    Component: Login,
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
    path: "blog/:slug",
    Component: StaticPageViewer,
  },
  {
    path: "blog",
    Component: BlogIndex,
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
  { path: "connect-xero", Component: ConnectExternalSystemsTest },
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
  {
    path: "/user/verify-email",
    Component: VerifyEmail,
  },
  {
    path: "/user/forgot-password",
    Component: ForgotPassword,
  },
  { path: "/user/reset-password", Component: ResetPassword },
];

const launchPublicRoutes = [
  {
    path: "compliance-navigator",
    Component: PublicComplianceNavigator,
  },
  {
    path: "contact",
    Component: Contact,
  },
  {
    path: "blog/:slug",
    Component: StaticPageViewer,
  },
  {
    path: "blog",
    Component: BlogIndex,
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
  // Super secret routes for boss access
  {
    path: "/bossonlyaccess-i-mean-it",
    Component: Login,
  },
];

export const publicRoutes = isPublicOnlyMode
  ? launchPublicRoutes
  : allPublicRoutes;
