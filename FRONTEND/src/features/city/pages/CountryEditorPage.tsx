import { Navigate } from "react-router-dom";
import { routePaths } from "../../../routes/route-paths";

export function CountryEditorPage() {
  return <Navigate replace to={routePaths.countries.list} />;
}
