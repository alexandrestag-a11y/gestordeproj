import { Router } from "express";
import {
  addMember,
  createCompany,
  listCompanies,
  listMembers,
} from "../controllers/companyController";

const router = Router();

router.get("/", listCompanies);
router.post("/", createCompany);
router.get("/:id/members", listMembers);
router.post("/:id/members", addMember);

export default router;
