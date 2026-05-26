import { Router } from "express";
import {
  createFolder,
  deleteFolder,
  listFolders,
  updateFolder,
} from "../controllers/folderController";

const router = Router();

router.get("/", listFolders);
router.post("/", createFolder);
router.put("/:id", updateFolder);
router.delete("/:id", deleteFolder);

export default router;
