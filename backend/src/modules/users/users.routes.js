import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { updateMe } from "./users.controller.js";

const router = Router();

router.patch("/me", auth, updateMe);

export default router;
