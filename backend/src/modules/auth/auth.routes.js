import { Router } from "express";
import { register, login, me, assignRole } from "./auth.controller.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);
router.post("/assign-role", auth, role("WARDEN", "ADMIN"), assignRole);

export default router;
