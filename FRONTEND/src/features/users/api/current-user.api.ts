import { apiClient } from "../../../services/api/client";
import type { UserRecord, UserUpsertPayload } from "./users.api";

export const currentUserApi = {
  getModel: () => apiClient.get<UserRecord>("UserManagement/CurrentUser/GetModel"),
  update: (body: UserUpsertPayload) =>
    apiClient.put<UserRecord>("UserManagement/CurrentUser/Update", body),
};
