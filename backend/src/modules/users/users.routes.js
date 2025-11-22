import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";
import { listUsers, updateMe, getStudentStats } from "./users.controller.js";

const router = Router();

router.get("/", auth, role("WARDEN", "ADMIN"), listUsers);
router.get("/stats", auth, role("STUDENT"), getStudentStats);
router.patch("/me", auth, updateMe);

export default router;
