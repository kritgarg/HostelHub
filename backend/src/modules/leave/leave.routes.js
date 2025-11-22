import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";
import {
  applyLeave,
  getMyLeaves,
  listPending,
  approveLeave,
  rejectLeave,
  getById,
  deleteLeave,
} from "./leave.controller.js";

const router = Router();

// student
router.post("/apply", auth, role("STUDENT"), applyLeave);
router.get("/my-leaves", auth, role("STUDENT"), getMyLeaves);
router.delete("/:id", auth, role("STUDENT"), deleteLeave);

// warden
router.get("/pending", auth, role("WARDEN"), listPending);
router.put("/approve/:id", auth, role("WARDEN"), approveLeave);
router.put("/reject/:id", auth, role("WARDEN"), rejectLeave);

// warden/student
router.get("/:id", auth, getById);

export default router;
