import ClientRegister from "../features/clients/ClientRegister";

// Publicly available
import Contact from "../components/common/Contact";
import PublicComplianceNavigator from "../components/ptrs/PublicComplianceNavigator";
import PTRSolution from "../components/ptrs/PTRSolution";
import ResourcePage from "../components/ptrs/ResourcePage";
import { SubmissionChecklistViewer } from "../components/ptrs/SubmissionChecklistViewer";

// Policy documents
import ClientServiceAgreement from "../components/policies/ClientServiceAgreement";
import PrivacyPolicy from "../components/policies/PrivacyPolicy";

// Static page viewer
import StaticPageViewer from "../components/StaticPageViewer";

// PTRS
// Testing pdf email
import TestPdfEmail from "../components/ptrs/TestPdfEmail";

import ForgotPassword from "../features/users/ForgotPassword";
import ResetPassword from "../features/users/ResetPassword";
import Login from "../features/users/Login";
import GettingStartedPage from "../components/ptrs/GettingStarted";
import FAQ from "../components/ptrs/FAQ";
import Booking from "../components/common/Booking";
import ContactThankyou from "../components/common/ContactThankyou";
import BookingThankyou from "../components/common/BookingThankyou";
import BlogIndex from "../routes/BlogIndex";
import LegalDisclaimer from "../components/policies/LegalDisclaimer";
import VerifyEmail from "../features/users/VerifyEmail";
import FirstUserRegister from "../features/users/FirstUserRegister";
// import PtrsPriceTier:PriceTier from "../components/ptrs/PriceTier";
import SignUp from "../components/common/SignUp";
import SignUpThankyou from "../components/common/SignUpThankyou";
import CompNavThankyou from "../components/common/CompNavThankyou";

// CaaS
import LandingPage from "../components/common/LandingPage";
import PriceTier from "../components/common/PriceTier";

import ModernSlavery from "../components/ms/ModernSlavery";
import WhistleBlower from "../components/wb/WhistleBlower";
import DirectorObligations from "../components/do/DirectorObligations";
import RiskRegister from "../components/rr/RiskRegister";

const isPublicOnlyMode = process.env.REACT_APP_PUBLIC_ONLY === "true";

const allPublicRoutes = [
  { path: "/", Component: LandingPage },
  { path: "/pricing", Component: PriceTier },
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
  { path: "thankyou-compliance-navigator", Component: CompNavThankyou },
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
  {
    path: "overview",
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
  { path: "pricing", Component: PriceTier },
  { path: "/signup", Component: SignUp },
  { path: "thankyou-signup", Component: SignUpThankyou },
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
  { path: "modern-slavery", Component: ModernSlavery },
  { path: "whistleblower-compliance", Component: WhistleBlower },
  { path: "director-obligations", Component: DirectorObligations },
  { path: "risk-register", Component: RiskRegister },
];

const launchPublicRoutes = [
  {
    path: "compliance-navigator",
    Component: PublicComplianceNavigator,
  },
  { path: "thankyou-compliance-navigator", Component: CompNavThankyou },
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
    path: "payment-times-reporting",
    Component: PTRSolution,
  },
  {
    path: "overview",
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
  { path: "thankyou-signup", Component: SignUpThankyou },
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
  { path: "modern-slavery", Component: ModernSlavery },
  { path: "whistleblower-compliance", Component: WhistleBlower },
  { path: "director-obligations", Component: DirectorObligations },
  { path: "risk-register", Component: RiskRegister },
  // Super secret routes for boss access
  {
    path: "/bossmode",
    children: [{ path: "login", Component: Login }],
  },
];

export const publicRoutes = isPublicOnlyMode
  ? launchPublicRoutes
  : allPublicRoutes;
