import { Router } from "express";
import {
  deleteField,
  updateField,
} from "../controllers/fieldController";

const router = Router();

router.put("/:id", updateField);
router.delete("/:id", deleteField);

export default router;
