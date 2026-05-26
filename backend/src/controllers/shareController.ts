import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getProjectWithAccess } from "../services/access";
import { asyncHandler, HttpError } from "../utils/errors";
import { getParamString } from "../utils/request";
import { projectShareSchema } from "../utils/validation";

export const shareProject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = getParamString(req.params.projectId);
  await getProjectWithAccess(
    req.user!.id,
    req.user!.memberships || [],
    projectId,
    "admin",
  );

  const data = projectShareSchema.parse(req.body);
  const targetUser = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (!targetUser) {
    throw new HttpError(404, "User not found");
  }

  const share = await prisma.projectShare.upsert({
    where: {
      projectId_userId: {
        projectId,
        userId: targetUser.id,
      },
    },
    update: { role: data.role },
    create: {
      projectId,
      userId: targetUser.id,
      role: data.role,
    },
  });

  res.status(201).json(share);
});

export const listProjectShares = asyncHandler(async (req: Request, res: Response) => {
  const projectId = getParamString(req.params.projectId);
  await getProjectWithAccess(
    req.user!.id,
    req.user!.memberships || [],
    projectId,
    "admin",
  );

  const shares = await prisma.projectShare.findMany({
    where: { projectId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  res.json(shares);
});

export const removeProjectShare = asyncHandler(async (req: Request, res: Response) => {
  const projectId = getParamString(req.params.projectId);
  const userId = getParamString(req.params.userId);

  await getProjectWithAccess(
    req.user!.id,
    req.user!.memberships || [],
    projectId,
    "admin",
  );

  await prisma.projectShare.delete({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  res.status(204).send();
});
