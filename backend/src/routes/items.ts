import { Router } from "express";
import {
  createChildItem,
  deleteItem,
  getItemDetail,
  moveItem,
  reorderItem,
  updateItem,
} from "../controllers/itemController";
import { createAttachment } from "../controllers/attachmentController";
import { saveFieldValue } from "../controllers/fieldController";
import { createList } from "../controllers/listController";
import { upload } from "../middleware/upload";

const router = Router();

router.get("/:id", getItemDetail);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);
router.patch("/:id/move", moveItem);
router.patch("/:id/reorder", reorderItem);
router.post("/:id/children", createChildItem);
router.post("/:id/field-values", saveFieldValue);
router.post("/:id/lists", createList);
router.post("/:id/attachments", upload.single("file"), createAttachment);

export default router;
