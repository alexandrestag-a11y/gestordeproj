import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjectSubprojects,
  listProjects,
  updateProject,
} from "../controllers/projectController";
import { createField, listFields } from "../controllers/fieldController";
import { createSubproject } from "../controllers/subprojectController";
import {
  listProjectShares,
  removeProjectShare,
  shareProject,
} from "../controllers/shareController";

const router = Router();

router.get("/", listProjects);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.get("/:id/subprojects", getProjectSubprojects);
router.post("/:id/subprojects", createSubproject);
router.get("/:id/fields", listFields);
router.post("/:id/fields", createField);

router.get("/:projectId/shares", listProjectShares);
router.post("/:projectId/shares", shareProject);
router.delete("/:projectId/shares/:userId", removeProjectShare);

export default router;
