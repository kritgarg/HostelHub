import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";
import { listMyNotifications, sendNotifications, markRead } from "./notifications.controller.js";

const router = Router();


router.get("/", auth, listMyNotifications);

router.post("/send", auth, role("WARDEN", "ADMIN"), sendNotifications);

router.put("/:id/read", auth, markRead);

export default router;
