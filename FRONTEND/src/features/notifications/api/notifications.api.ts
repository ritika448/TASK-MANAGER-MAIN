import { apiClient } from "../../../services/api/client";

export type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  type: string;
  entityType: string;
  entityId: string;
  read: boolean;
  createdAt: string;
};

export const notificationsApi = {
  getList: (limit = 25) =>
    apiClient.get<NotificationRecord[]>(`Notification/GetList?limit=${encodeURIComponent(String(limit))}`),
  getUnreadCount: () => apiClient.get<{ unreadCount: number }>("Notification/GetUnreadCount"),
  markAllRead: () => apiClient.post<{ message: string }>("Notification/MarkAllRead", {}),
};

