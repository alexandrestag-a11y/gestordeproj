import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getProjectWithAccess, getSubprojectWithAccess } from "../services/access";
import { asyncHandler } from "../utils/errors";
import { getParamString } from "../utils/request";
import { stageSchema, subprojectSchema } from "../utils/validation";

export const createSubproject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = getParamString(req.params.id);
  await getProjectWithAccess(
    req.user!.id,
    req.user!.memberships || [],
    projectId,
    "member",
  );
  const data = subprojectSchema.parse(req.body);

  const subproject = await prisma.subproject.create({
    data: {
      projectId,
      name: data.name,
      order: data.order ?? 0,
    },
    include: { stages: true },
  });

  res.status(201).json(subproject);
});

export const updateSubproject = asyncHandler(async (req: Request, res: Response) => {
  const subprojectId = getParamString(req.params.id);
  await getSubprojectWithAccess(req.user!.memberships || [], subprojectId, "member");
  const data = subprojectSchema.partial().parse(req.body);

  const subproject = await prisma.subproject.update({
    where: { id: subprojectId },
    data,
  });

  res.json(subproject);
});

export const createStage = asyncHandler(async (req: Request, res: Response) => {
  const subprojectId = getParamString(req.params.id);
  await getSubprojectWithAccess(req.user!.memberships || [], subprojectId, "member");
  const data = stageSchema.parse(req.body);

  const stage = await prisma.stage.create({
    data: {
      subprojectId,
      name: data.name,
      color: data.color,
      order: data.order ?? 0,
    },
    include: { items: true },
  });

  res.status(201).json(stage);
});

export const deleteSubproject = asyncHandler(async (req: Request, res: Response) => {
  const subprojectId = getParamString(req.params.id);
  const subproject = await getSubprojectWithAccess(req.user!.memberships || [], subprojectId, "admin");

  await prisma.subproject.delete({ where: { id: subproject.id } });
  res.status(204).send();
});
