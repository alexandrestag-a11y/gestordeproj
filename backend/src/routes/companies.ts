import { Router } from "express";
import {
  addMember,
  createCompany,
  deleteCompany,
  listCompanies,
  listMembers,
  updateCompany,
} from "../controllers/companyController";

const router = Router();

router.get("/", listCompanies);
router.post("/", createCompany);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);
router.get("/:id/members", listMembers);
router.post("/:id/members", addMember);

export default router;
