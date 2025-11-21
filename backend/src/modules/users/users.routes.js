import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";
import { listUsers, updateMe } from "./users.controller.js";

const router = Router();

router.get("/", auth, role("WARDEN", "ADMIN"), listUsers);
router.patch("/me", auth, updateMe);

export default router;
