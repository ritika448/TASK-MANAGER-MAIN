import { Navigate } from "react-router-dom";
import { routePaths } from "../../../routes/route-paths";

export function TaskEditorPage() {
  return <Navigate replace to={routePaths.tasks.list} />;
}
