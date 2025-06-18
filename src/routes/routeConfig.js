/**
 * Refactored route structure for clearer role-based access
 */
import Users from "../features/users/Users";
import UsersLayout from "../features/users/UsersLayout";
import CreateUser from "../features/users/CreateUser";
import Dashboard from "../features/users/Dashboard";
import AdminDashboard from "../features/users/AdminDashboard";
import BossDashboard from "../features/boss/BossDashboard";
import Clients from "../features/clients/Clients";
import ClientRegister from "../features/clients/ClientRegister";
import ReportsLayout from "../features/reports/ReportsLayout";
import CreateReport from "../features/reports/ptrs/CreateReport";
import ReportWizard from "../features/reports/ptrs/ReportWizard";
import ConnectExternalSystems from "../features/reports/ptrs/ConnectExternalSystems";
import XeroConnectProgress from "../features/reports/ptrs/XeroConnectProgress";
import StepsOverview from "../features/reports/ptrs/StepsOverview";
import ReportErrorBoundary from "../components/navigation/ReportErrorBoundary";
import Role from "../context/role";
import XeroSelection from "../features/reports/ptrs/XeroSelection";

export const protectedRoutes = [
  // User-level routes
  {
    requiredRoles: [Role.User, Role.Admin, Role.Boss],
    path: "/user",
    children: [{ path: "dashboard", Component: Dashboard }],
  },

  // Admin-level routes (includes User access)
  {
    requiredRoles: [Role.Admin, Role.Boss],
    path: "/admin",
    children: [
      { index: true, Component: AdminDashboard },
      {
        path: "users",
        Component: UsersLayout,
        children: [
          { index: true, Component: Users },
          { path: "create", Component: CreateUser },
        ],
      },
    ],
  },

  // Boss-level routes (full admin rights)
  {
    requiredRoles: [Role.Boss],
    path: "/boss",
    children: [
      { index: true, Component: BossDashboard },
      {
        path: "clients",
        children: [
          { index: true, Component: Clients },
          { path: "register", Component: ClientRegister },
        ],
      },
      {
        path: "content",
        children: [
          {
            path: "faq",
            Component: require("../features/admin/content/EditFaq").default,
          },
          {
            path: "blog/:slug",
            Component: require("../features/admin/content/EditBlog").default,
          },
        ],
      },
    ],
  },

  // Shared protected reports
  {
    requiredRoles: [Role.User, Role.Admin, Role.Audit, Role.Boss],
    path: "/reports",
    children: [
      {
        Component: ReportsLayout,
        ErrorBoundary: ReportErrorBoundary,
        children: [
          { path: ":code/create", Component: CreateReport },
          { path: ":code/:reportId", Component: ReportWizard },
          {
            path: ":code/:reportId/connect",
            Component: ConnectExternalSystems,
          },
          {
            path: ":code/:reportId/selection",
            Component: XeroSelection,
          },
          {
            path: ":code/:reportId/progress",
            Component: XeroConnectProgress,
          },
          { path: "steps", Component: StepsOverview },
        ],
      },
    ],
  },
];
