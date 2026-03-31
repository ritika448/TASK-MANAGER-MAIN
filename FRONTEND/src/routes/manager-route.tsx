import { Navigate, Outlet } from "react-router-dom";
import { routePaths } from "./route-paths";
import { isManagerUser } from "../services/auth/auth-role";

export function ManagerRoute() {
  if (!isManagerUser()) {
    return <Navigate replace to={routePaths.tasks.list} />;
  }

  return <Outlet />;
}
