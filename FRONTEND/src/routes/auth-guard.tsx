import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authStorage } from "../services/auth/auth-storage";
import { routePaths } from "./route-paths";

export function AuthGuard() {
  const location = useLocation();
  const token = authStorage.getToken();

  if (!token) {
    return <Navigate replace state={{ from: location }} to={routePaths.login} />;
  }

  return <Outlet />;
}

