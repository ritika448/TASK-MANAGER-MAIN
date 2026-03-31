import { Navigate } from "react-router-dom";
import { routePaths } from "../../../routes/route-paths";

export function CityEditorPage() {
  return <Navigate replace to={routePaths.cities.list} />;
}
