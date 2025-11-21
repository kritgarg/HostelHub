import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";
import { report, list, resolve, getById, remove } from "./lostfound.controller.js";

const router = Router();

// Create report (student only)
router.post("/report", auth, role("STUDENT"), report);

// List (any authenticated)
router.get("/", auth, list);

// Resolve (owner or warden) -> controller enforces ownership/role
router.put("/:id/resolve", auth, resolve);

// Get by id (any authenticated)
router.get("/:id", auth, getById);

// Delete (owner or warden)
router.delete("/:id", auth, role("STUDENT", "WARDEN"), remove);

export default router;
