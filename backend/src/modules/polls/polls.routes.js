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

router.post("/", auth, role("WARDEN", "ADMIN"), createPoll);
router.get("/", auth, listPolls);
router.get("/:id", auth, getPollById);
router.post("/:pollId/vote", auth, role("STUDENT"), vote);
router.get("/results/:id", auth, role("WARDEN", "ADMIN"), results);
router.delete("/:id", auth, role("WARDEN", "ADMIN"), deletePoll);

export default router;
