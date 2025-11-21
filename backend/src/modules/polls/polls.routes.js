import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";
import {
  createPoll,
  listPolls,
  getPollById,
  vote,
  results,
  deletePoll,
} from "./polls.controller.js";

const router = Router();

// Create poll (warden/admin)
router.post("/", auth, role("WARDEN", "ADMIN"), createPoll);

// Fetch polls (any authenticated)
router.get("/", auth, listPolls);
router.get("/:id", auth, getPollById);

// Vote (student only)
router.post("/vote/:pollId", auth, role("STUDENT"), vote);

// Results (warden/admin)
router.get("/results/:id", auth, role("WARDEN", "ADMIN"), results);

// Delete poll (warden/admin)
router.delete("/:id", auth, role("WARDEN", "ADMIN"), deletePoll);

export default router;
