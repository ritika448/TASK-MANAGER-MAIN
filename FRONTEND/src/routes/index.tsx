import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../app/layout/AppLayout";
import { RouteErrorFallback } from "../components/common/RouteErrorFallback";
import { AuthLayout } from "../features/auth/components/AuthLayout";
import { ForgotPasswordPage } from "../features/auth/pages/ForgotPasswordPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { NotFoundPage } from "../features/auth/pages/NotFoundPage";
import { SignupPage } from "../features/auth/pages/SignupPage";
import { CitiesPage } from "../features/city/pages/CitiesPage";
import { CityEditorPage } from "../features/city/pages/CityEditorPage";
import { CountriesPage } from "../features/city/pages/CountriesPage";
import { CountryEditorPage } from "../features/city/pages/CountryEditorPage";
import { StateEditorPage } from "../features/city/pages/StateEditorPage";
import { StatesPage } from "../features/city/pages/StatesPage";
import { HomePage } from "../features/home/pages/HomePage";
import { SettingsPage } from "../features/settings/pages/SettingsPage";
import { TaskEditorPage } from "../features/tasks/pages/TaskEditorPage";
import { TasksPage } from "../features/tasks/pages/TasksPage";
import { ProfilePage } from "../features/users/pages/ProfilePage";
import { UserEditorPage } from "../features/users/pages/UserEditorPage";
import { UsersListPage } from "../features/users/pages/UsersListPage";
import { AuthGuard } from "./auth-guard";
import { ManagerRoute } from "./manager-route";
import { routePaths } from "./route-paths";

export const appRouter = createBrowserRouter([
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        errorElement: <RouteErrorFallback />,
        children: [
          { path: routePaths.home, element: <HomePage /> },
          { path: routePaths.profile, element: <ProfilePage /> },
          { path: "/Profile", element: <Navigate replace to={routePaths.profile} /> },
          { path: routePaths.tasks.list, element: <TasksPage /> },
          { path: "/Tasks", element: <Navigate replace to={routePaths.tasks.list} /> },
          { path: routePaths.tasks.create, element: <TaskEditorPage /> },
          { path: "/Tasks/Create", element: <Navigate replace to={routePaths.tasks.create} /> },
          { path: routePaths.tasks.edit, element: <TaskEditorPage /> },
          { path: "/Tasks/Edit/:id", element: <TaskEditorPage /> },
          {
            element: <ManagerRoute />,
            children: [
              { path: routePaths.settings, element: <SettingsPage /> },
              { path: "/Settings", element: <Navigate replace to={routePaths.settings} /> },
              { path: routePaths.users.list, element: <UsersListPage /> },
              { path: "/Users", element: <Navigate replace to={routePaths.users.list} /> },
              { path: routePaths.users.create, element: <UserEditorPage /> },
              { path: "/Users/Create", element: <Navigate replace to={routePaths.users.create} /> },
              { path: routePaths.users.edit, element: <UserEditorPage /> },
              { path: "/Users/Edit/:id", element: <UserEditorPage /> },
              { path: routePaths.countries.list, element: <CountriesPage /> },
              { path: "/Countries", element: <Navigate replace to={routePaths.countries.list} /> },
              { path: routePaths.countries.create, element: <CountryEditorPage /> },
              { path: "/Countries/Create", element: <Navigate replace to={routePaths.countries.create} /> },
              { path: routePaths.countries.edit, element: <CountryEditorPage /> },
              { path: "/Countries/Edit/:id", element: <CountryEditorPage /> },
              { path: routePaths.states.list, element: <StatesPage /> },
              { path: "/States", element: <Navigate replace to={routePaths.states.list} /> },
              { path: routePaths.states.create, element: <StateEditorPage /> },
              { path: "/States/Create", element: <Navigate replace to={routePaths.states.create} /> },
              { path: routePaths.states.edit, element: <StateEditorPage /> },
              { path: "/States/Edit/:id", element: <StateEditorPage /> },
              { path: routePaths.cities.list, element: <CitiesPage /> },
              { path: "/Cities", element: <Navigate replace to={routePaths.cities.list} /> },
              { path: routePaths.cities.create, element: <CityEditorPage /> },
              { path: "/Cities/Create", element: <Navigate replace to={routePaths.cities.create} /> },
              { path: routePaths.cities.edit, element: <CityEditorPage /> },
              { path: "/Cities/Edit/:id", element: <CityEditorPage /> },
            ],
          },
          { path: routePaths.invalidPage, element: <Navigate replace to={routePaths.home} /> },
          { path: "/InvalidPage", element: <Navigate replace to={routePaths.home} /> },
          { path: routePaths.resetPassword, element: <Navigate replace to={routePaths.home} /> },
          { path: "/ResetPassword/:resetPasswordCode", element: <Navigate replace to={routePaths.home} /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      { path: routePaths.login, element: <LoginPage /> },
      { path: "/Login", element: <Navigate replace to={routePaths.login} /> },
      { path: routePaths.signup, element: <SignupPage /> },
      { path: "/Signup", element: <Navigate replace to={routePaths.signup} /> },
      { path: routePaths.forgotPassword, element: <ForgotPasswordPage /> },
      { path: "/ForgotPassword", element: <Navigate replace to={routePaths.forgotPassword} /> },
    ],
  },
]);
