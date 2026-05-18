import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getStageWithAccess } from "../services/access";
import { asyncHandler } from "../utils/errors";
import { stageReorderSchema, stageSchema } from "../utils/validation";

export const updateStage = asyncHandler(async (req: Request, res: Response) => {
  await getStageWithAccess(req.user!.memberships || [], req.params.id, "member");
  const data = stageSchema.partial().parse(req.body);

  const stage = await prisma.stage.update({
    where: { id: req.params.id },
    data,
  });

  res.json(stage);
});

export const reorderStages = asyncHandler(async (req: Request, res: Response) => {
  const currentStage = await getStageWithAccess(
    req.user!.memberships || [],
    req.params.id,
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
