import { EventEmitter } from "node:events";
import { Notification } from "../models/Notification.js";

const emitter = new EventEmitter();

function serializeNotification(notification) {
  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type ?? "info",
    entityType: notification.entityType ?? "",
    entityId: notification.entityId ?? "",
    read: Boolean(notification.read),
    createdAt: notification.createdAt?.toISOString?.() ?? new Date().toISOString(),
  };
}

async function createNotification({ userId, title, message, type = "info", entityType = "", entityId = "" }) {
  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
    entityType,
    entityId,
  });

  return notification;
}

export const notificationHub = {
  async notifyUser(userId, payload) {
    const notification = await createNotification({ userId, ...payload });
    emitter.emit(`user:${String(userId)}`, serializeNotification(notification));
    return notification;
  },
  async notifyMany(userIds, payload) {
    const uniqueUserIds = Array.from(new Set(userIds.map((id) => String(id))));
    await Promise.all(uniqueUserIds.map((id) => notificationHub.notifyUser(id, payload)));
  },
  subscribe(userId, handler) {
    const channel = `user:${String(userId)}`;
    emitter.on(channel, handler);
    return () => emitter.off(channel, handler);
  },
  serializeNotification,
};

