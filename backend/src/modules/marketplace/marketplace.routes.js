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

router.post("/item", auth, role("STUDENT"), createItem);

router.get("/items", listItems);
router.get("/item/:id", getItemById);

router.put("/item/:id", auth, role("STUDENT"), updateItem);
router.put("/item/:id/mark-sold", auth, role("STUDENT"), markSold);


router.delete("/item/:id", auth, role("STUDENT","WARDEN"), deleteItem);

export default router;
