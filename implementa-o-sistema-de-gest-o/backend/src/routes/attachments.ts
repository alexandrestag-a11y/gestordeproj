import { Router } from "express";
import { deleteAttachment } from "../controllers/attachmentController";

const router = Router();

router.delete("/:id", deleteAttachment);

export default router;
