import jwt from "jsonwebtoken";
import { Notification } from "../models/Notification.js";
import { notificationHub } from "../services/notification-hub.js";

function requireAuthFromQuery(req, res) {
  const token = typeof req.query.token === "string" ? req.query.token : "";
  if (!token) {
    res.status(401).json({ message: "Authorization token is required." });
    return null;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.userId;
  } catch {
    res.status(401).json({ message: "Invalid or expired token." });
    return null;
  }
}

export async function getNotificationList(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit ?? 25) || 25, 50);
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json(notifications.map(notificationHub.serializeNotification));
  } catch (error) {
    return next(error);
  }
}

export async function getUnreadCount(req, res, next) {
  try {
    const count = await Notification.countDocuments({ userId: req.userId, read: false });
    return res.status(200).json({ unreadCount: count });
  } catch (error) {
    return next(error);
  }
}

export async function markAllRead(req, res, next) {
  try {
    await Notification.updateMany({ userId: req.userId, read: false }, { $set: { read: true } });
    return res.status(200).json({ message: "Notifications marked as read." });
  } catch (error) {
    return next(error);
  }
}

export async function streamNotifications(req, res, next) {
  try {
    const userId = requireAuthFromQuery(req, res);
    if (!userId) {
      return;
    }

    res.status(200);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const send = (payload) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };

    send({ type: "connected" });

    const unsubscribe = notificationHub.subscribe(userId, (notification) => {
      send({ type: "notification", notification });
    });

    const keepAlive = setInterval(() => {
      send({ type: "ping", at: new Date().toISOString() });
    }, 25000);

    req.on("close", () => {
      clearInterval(keepAlive);
      unsubscribe();
    });
  } catch (error) {
    return next(error);
  }
}

