import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";
import { listMyNotifications, sendNotifications, markRead } from "./notifications.controller.js";

const router = Router();

// Fetch notifications for logged-in user
router.get("/", auth, listMyNotifications);

// Send notifications (warden/admin)
router.post("/send", auth, role("WARDEN", "ADMIN"), sendNotifications);

// Mark single notification as read (owner)
router.put("/:id/read", auth, markRead);

export default router;
