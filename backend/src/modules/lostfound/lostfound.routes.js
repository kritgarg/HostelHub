import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";
import { report, list, resolve, getById, remove } from "./lostfound.controller.js";

const router = Router();

router.post("/report", auth, role("STUDENT"), report);

router.get("/", auth, list);

router.put("/:id/resolve", auth, resolve);

router.get("/:id", auth, getById);

router.delete("/:id", auth, role("STUDENT", "WARDEN"), remove);

export default router;
