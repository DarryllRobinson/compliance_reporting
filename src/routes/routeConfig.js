import Users from "../features/users/Users";
import UsersLayout from "../features/users/UsersLayout";
import CreateUser from "../features/users/CreateUser";
import Dashboard from "../features/users/Dashboard";
import Clients from "../features/clients/Clients";
import ClientsLayout from "../features/clients/ClientsLayout";
import ClientRegister from "../features/clients/ClientRegister";
import ReportErrorBoundary from "../components/navigation/ReportErrorBoundary";
import ReportsLayout from "../features/reports/ReportsLayout";
import CreateReport from "../features/reports/ptrs/CreateReport";
import ReportWizard from "../features/reports/ptrs/ReportWizard";
import ConnectExternalSystems from "../features/reports/ptrs/ConnectExternalSystems";
import StepsOverview from "../features/reports/ptrs/StepsOverview";
import Role from "../context/role";

export const protectedRoutes = [
  {
    requiredRoles: [Role.Admin, Role.Audit, Role.Boss],
    path: "/users",
    children: [
      { index: true, Component: Users },
      {
        Component: UsersLayout,
        children: [{ path: "create", Component: CreateUser }],
      },
    ],
  },
  {
    // All roles
    path: "/user",
    children: [{ path: "dashboard", Component: Dashboard }],
  },
  {
    requiredRoles: [Role.Boss],
    path: "/clients",
    children: [
      { index: true, Component: Clients },
      {
        Component: ClientsLayout,
        children: [{ path: "register", Component: ClientRegister }],
      },
    ],
  },
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
          { path: "steps", Component: StepsOverview },
        ],
      },
    ],
  },
  {
    requiredRoles: [Role.Admin, Role.Audit, Role.Boss],
    path: "/admin",
    children: [
      {
        index: true,
        Component: require("../features/admin/ContentList").default,
      },
      {
        path: "edit-faq",
        Component: require("../features/admin/EditFaq").default,
      },
      {
        path: "edit-blog/:slug",
        Component: require("../features/admin/EditBlog").default,
      },
    ],
  },
];
