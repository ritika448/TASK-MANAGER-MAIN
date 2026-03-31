import { Navigate } from "react-router-dom";
import { routePaths } from "../../../routes/route-paths";

export function ProfilePage() {
  return <Navigate replace to={routePaths.home} />;
}
