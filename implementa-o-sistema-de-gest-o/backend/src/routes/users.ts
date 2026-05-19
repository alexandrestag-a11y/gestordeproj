import { Router } from "express";
import { getUserProjects } from "../controllers/userController";

const router = Router();

router.get("/:id/projects", getUserProjects);

export default router;
