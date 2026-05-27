import { Router } from "express";
import { deleteList, updateList } from "../controllers/listController";

const router = Router();

router.put("/:id", updateList);
router.delete("/:id", deleteList);

export default router;
