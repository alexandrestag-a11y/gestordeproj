import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getStageWithAccess } from "../services/access";
import { asyncHandler } from "../utils/errors";
import { getParamString } from "../utils/request";
import { stageReorderSchema, stageSchema } from "../utils/validation";

export const updateStage = asyncHandler(async (req: Request, res: Response) => {
  const stageId = getParamString(req.params.id);
  await getStageWithAccess(req.user!.memberships || [], stageId, "member");
  const data = stageSchema.partial().parse(req.body);

  const stage = await prisma.stage.update({
    where: { id: stageId },
    data,
  });

  res.json(stage);
});

export const reorderStages = asyncHandler(async (req: Request, res: Response) => {
  const stageId = getParamString(req.params.id);
  const currentStage = await getStageWithAccess(
    req.user!.memberships || [],
    stageId,
    "member",
  );
  const { stageIds } = stageReorderSchema.parse(req.body);

  await prisma.$transaction(
    stageIds.map((stageId, index) =>
      prisma.stage.update({
        where: { id: stageId },
        data: { order: index, subprojectId: currentStage.subprojectId },
      }),
    ),
  );

  res.status(204).send();
});

export const deleteStage = asyncHandler(async (req: Request, res: Response) => {
  const stageId = getParamString(req.params.id);
  const stage = await getStageWithAccess(req.user!.memberships || [], stageId, "admin");

  await prisma.stage.delete({ where: { id: stage.id } });
  res.status(204).send();
});
