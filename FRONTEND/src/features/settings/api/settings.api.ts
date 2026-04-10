import { apiClient } from "../../../services/api/client";
import type { UserRecord } from "../../users/api/users.api";

export type UserSettings = {
  workspaceName: string;
  timezone: string;
  defaultTaskPriority: string;
  defaultTaskView: string;
  notificationSettings: {
    email: boolean;
    dueDates: boolean;
    weeklySummary: boolean;
    push: boolean;
  };
  appearanceSettings: {
    theme: string;
    secureSession: boolean;
  };
};

export const settingsApi = {
  getCurrentSettings: () => apiClient.get<UserRecord>("UserManagement/CurrentUser/GetModel"),
  updateSettings: (payload: Partial<UserRecord>) =>
    apiClient.put<UserRecord>("UserManagement/CurrentUser/Update", payload),
};
