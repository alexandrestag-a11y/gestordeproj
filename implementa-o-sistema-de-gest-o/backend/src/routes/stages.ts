import { Router } from "express";
import { createItem, listItems } from "../controllers/itemController";
import { reorderStages, updateStage } from "../controllers/stageController";

const router = Router();

router.put("/:id", updateStage);
router.patch("/:id/reorder", reorderStages);
router.get("/:id/items", listItems);
router.post("/:id/items", createItem);

export default router;
