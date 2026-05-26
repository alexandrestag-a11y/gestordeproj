import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { ensureCompanyRole } from "../middleware/permission";
import { asyncHandler } from "../utils/errors";
import { getParamString } from "../utils/request";
import { folderSchema } from "../utils/validation";

export const listFolders = asyncHandler(async (req: Request, res: Response) => {
  const companyId = String(req.query.companyId || "");
  if (!companyId) {
    return res.status(400).json({ message: "companyId is required" });
  }
  ensureCompanyRole(req.user?.memberships, companyId, "viewer");

  const folders = await prisma.folder.findMany({
    where: { companyId },
    include: {
      subfolders: true,
      projects: true,
    },
    orderBy: { createdAt: "asc" },
  });

  res.json(folders);
});

export const createFolder = asyncHandler(async (req: Request, res: Response) => {
  const data = folderSchema.parse(req.body);
  ensureCompanyRole(req.user?.memberships, data.companyId, "admin");

  const folder = await prisma.folder.create({
    data,
  });

  res.status(201).json(folder);
});

export const updateFolder = asyncHandler(async (req: Request, res: Response) => {
  const id = getParamString(req.params.id);
  const folder = await prisma.folder.findUnique({ where: { id } });
  if (!folder) return res.status(404).json({ message: "Folder not found" });

  ensureCompanyRole(req.user?.memberships, folder.companyId, "admin");

  const data = folderSchema.partial().omit({ companyId: true }).parse(req.body);

  const updated = await prisma.folder.update({
    where: { id },
    data,
  });

  res.json(updated);
});

export const deleteFolder = asyncHandler(async (req: Request, res: Response) => {
  const id = getParamString(req.params.id);
  const folder = await prisma.folder.findUnique({ where: { id } });
  if (!folder) return res.status(404).json({ message: "Folder not found" });

  ensureCompanyRole(req.user?.memberships, folder.companyId, "admin");

  await prisma.folder.delete({ where: { id } });
  res.status(204).send();
});
