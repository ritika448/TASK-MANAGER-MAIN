import { Navigate } from "react-router-dom";
import { routePaths } from "../../../routes/route-paths";

export function StateEditorPage() {
  return <Navigate replace to={routePaths.states.list} />;
}
