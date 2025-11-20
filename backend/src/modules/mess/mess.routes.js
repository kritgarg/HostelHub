import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";
import {
  createMenu,
  updateMenu,
  deleteMenu,
  listMenus,
  createFeedback,
  analytics,
} from "./mess.controller.js";

const router = Router();

// Menu management (warden/admin)
router.post("/menu", auth, role("WARDEN", "ADMIN"), createMenu);
router.put("/menu/:id", auth, role("WARDEN", "ADMIN"), updateMenu);
router.delete("/menu/:id", auth, role("WARDEN", "ADMIN"), deleteMenu);

// Fetch menus (any authenticated user)
router.get("/menu", auth, listMenus);

// Feedback (student only)
router.post("/feedback", auth, role("STUDENT"), createFeedback);

// Analytics (warden/admin)
router.get("/analytics", auth, role("WARDEN", "ADMIN"), analytics);

export default router;
