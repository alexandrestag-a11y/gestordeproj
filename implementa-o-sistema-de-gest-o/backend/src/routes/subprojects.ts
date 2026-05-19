import { Router } from "express";
import {
  createStage,
  updateSubproject,
} from "../controllers/subprojectController";

const router = Router();

router.put("/:id", updateSubproject);
router.post("/:id/stages", createStage);

export default router;
