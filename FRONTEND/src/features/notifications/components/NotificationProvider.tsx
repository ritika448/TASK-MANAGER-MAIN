import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import { notificationsApi, type NotificationRecord } from "../api/notifications.api";
import { authStorage } from "../../../services/auth/auth-storage";
import { useToast } from "../../../components/feedback/ToastProvider";

type NotificationsContextValue = {
  notifications: NotificationRecord[];
  unreadCount: number;
  refresh: () => Promise<void>;
  markAllRead: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5002";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const [authVersion, setAuthVersion] = useState(0);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  async function refresh() {
    const token = authStorage.getToken();
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const [list, unread] = await Promise.all([
      notificationsApi.getList(25),
      notificationsApi.getUnreadCount(),
    ]);
    setNotifications(list);
    setUnreadCount(unread.unreadCount);
  }

  async function markAllRead() {
    const token = authStorage.getToken();
    if (!token) {
      return;
    }

    await notificationsApi.markAllRead();
    await refresh();
  }

  useEffect(() => {
    void refresh();
  }, [authVersion]);

  useEffect(() => {
    const onAuthChanged = () => setAuthVersion((version) => version + 1);
    window.addEventListener("auth-changed", onAuthChanged);
    return () => window.removeEventListener("auth-changed", onAuthChanged);
  }, []);

  useEffect(() => {
    const token = authStorage.getToken();
    if (!token) {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      return;
    }

    const url = `${API_BASE_URL}/Notification/Stream?token=${encodeURIComponent(token)}`;
    const source = new EventSource(url);
    eventSourceRef.current = source;

    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as
          | { type: "connected" }
          | { type: "ping"; at: string }
          | { type: "notification"; notification: NotificationRecord };

        if (payload.type === "notification") {
          setNotifications((current) => [payload.notification, ...current].slice(0, 25));
          setUnreadCount((count) => count + (payload.notification.read ? 0 : 1));
          showToast(payload.notification.title, "info");
        }
      } catch {
        // ignore
      }
    };

    source.onerror = () => {
      // Some browsers keep retrying automatically; keep UI stable.
    };

    return () => {
      source.close();
      if (eventSourceRef.current === source) {
        eventSourceRef.current = null;
      }
    };
  }, [authVersion, showToast]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      refresh,
      markAllRead,
    }),
    [notifications, unreadCount],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }
  return context;
}
