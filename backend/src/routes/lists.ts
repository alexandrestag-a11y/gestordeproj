import { Router } from "express";
import { updateList } from "../controllers/listController";

const router = Router();

router.put("/:id", updateList);

export default router;
