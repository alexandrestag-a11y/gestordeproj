import { Router } from "express";
import {
  createStage,
  deleteSubproject,
  updateSubproject,
} from "../controllers/subprojectController";

const router = Router();

router.put("/:id", updateSubproject);
router.delete("/:id", deleteSubproject);
router.post("/:id/stages", createStage);

export default router;
