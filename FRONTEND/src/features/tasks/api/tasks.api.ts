import { apiClient } from "../../../services/api/client";

export type TaskRecord = {
  id: string;
  taskName: string;
  description: string;
  assignedUsers: Array<{
    id: string;
    name: string;
    emailId: string;
  }>;
  dueDate: string | null;
  priority: number;
  status: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  manager: {
    id: string;
    name: string;
    emailId: string;
  } | null;
};

export type TaskUpsertPayload = {
  taskName: string;
  description: string;
  assignedUserIds: string[];
  dueDate: string | null;
  priority: number;
  status?: string;
  completed?: boolean;
};

export const tasksApi = {
  getList: () => apiClient.get<TaskRecord[]>("TaskManagement/Task/GetList"),
  getModel: (id: string) => apiClient.get<TaskRecord>(`TaskManagement/Task/GetModel/${id}`),
  create: (body: TaskUpsertPayload) => apiClient.post<TaskRecord>("TaskManagement/Task/Insert", body),
  update: (id: string, body: TaskUpsertPayload) =>
    apiClient.put<TaskRecord>(`TaskManagement/Task/Update/${id}`, body),
  delete: (id: string) => apiClient.delete<{ message: string }>(`TaskManagement/Task/Delete/${id}`),
};
