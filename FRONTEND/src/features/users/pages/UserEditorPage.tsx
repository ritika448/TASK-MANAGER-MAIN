import { Navigate } from "react-router-dom";
import { routePaths } from "../../../routes/route-paths";

export function UserEditorPage() {
  return <Navigate replace to={routePaths.users.list} />;
}
