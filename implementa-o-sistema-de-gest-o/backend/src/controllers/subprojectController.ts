import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getProjectWithAccess, getSubprojectWithAccess } from "../services/access";
import { asyncHandler } from "../utils/errors";
import { stageSchema, subprojectSchema } from "../utils/validation";

export const createSubproject = asyncHandler(async (req: Request, res: Response) => {
  await getProjectWithAccess(
    req.user!.id,
    req.user!.memberships || [],
    req.params.id,
    "member",
  );
  const data = subprojectSchema.parse(req.body);

  const subproject = await prisma.subproject.create({
    data: {
      projectId: req.params.id,
      name: data.name,
      order: data.order ?? 0,
    },
    include: { stages: true },
  });

  res.status(201).json(subproject);
});

export const updateSubproject = asyncHandler(async (req: Request, res: Response) => {
  await getSubprojectWithAccess(req.user!.memberships || [], req.params.id, "member");
  const data = subprojectSchema.partial().parse(req.body);

  const subproject = await prisma.subproject.update({
    where: { id: req.params.id },
    data,
  });

  res.json(subproject);
});

export const createStage = asyncHandler(async (req: Request, res: Response) => {
  await getSubprojectWithAccess(req.user!.memberships || [], req.params.id, "member");
  const data = stageSchema.parse(req.body);

  const stage = await prisma.stage.create({
    data: {
      subprojectId: req.params.id,
      name: data.name,
      color: data.color,
      order: data.order ?? 0,
    },
    include: { items: true },
  });

  res.status(201).json(stage);
});
