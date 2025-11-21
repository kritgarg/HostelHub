import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";
import {
  createComplaint,
  listMyComplaints,
  listComplaints,
  updateComplaint,
  getComplaintById,
  deleteComplaint,
} from "./complaints.controller.js";

const router = Router();

// student only
router.post("/", auth, role("STUDENT"), createComplaint);
router.get("/my", auth, role("STUDENT"), listMyComplaints);

// warden/admin
router.get("/", auth, role("WARDEN", "ADMIN"), listComplaints);
router.put("/update/:id", auth, role("WARDEN", "ADMIN"), updateComplaint);

// owner, warden, admin
router.get("/:id", auth, getComplaintById);
router.delete("/:id", auth, role("STUDENT", "WARDEN", "ADMIN"), deleteComplaint);

export default router;
