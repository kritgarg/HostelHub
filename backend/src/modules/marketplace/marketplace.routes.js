import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";
import {
  createItem,
  listItems,
  getItemById,
  updateItem,
  deleteItem,
  markSold,
} from "./marketplace.controller.js";

const router = Router();

// Create listing (student only)
router.post("/item", auth, role("STUDENT"), createItem);

// Public listings
router.get("/items", listItems);
router.get("/item/:id", getItemById);

// Owner updates
router.put("/item/:id", auth, role("STUDENT"), updateItem);
router.put("/item/:id/mark-sold", auth, role("STUDENT"), markSold);

// Owner or warden delete
router.delete("/item/:id", auth, role("STUDENT","WARDEN"), deleteItem);

export default router;
