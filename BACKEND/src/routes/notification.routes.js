import { Router } from "express";
import {
  getNotificationList,
  getUnreadCount,
  markAllRead,
  streamNotifications,
} from "../controllers/notification.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/GetList", requireAuth, getNotificationList);
router.get("/GetUnreadCount", requireAuth, getUnreadCount);
router.post("/MarkAllRead", requireAuth, markAllRead);
router.get("/Stream", streamNotifications);

export default router;

