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

router.post("/menu", auth, role("WARDEN", "ADMIN"), createMenu);
router.put("/menu/:id", auth, role("WARDEN", "ADMIN"), updateMenu);
router.delete("/menu/:id", auth, role("WARDEN", "ADMIN"), deleteMenu);
router.get("/menu", auth, listMenus);

router.post("/feedback", auth, role("STUDENT"), createFeedback);  

router.get("/analytics", auth, role("WARDEN", "ADMIN"), analytics);

export default router;
