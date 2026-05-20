import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler, HttpError } from "../utils/errors";
import { getParamString } from "../utils/request";

export const getUserProjects = asyncHandler(async (req: Request, res: Response) => {
  const requestedUserId = getParamString(req.params.id);
  if (requestedUserId !== req.user!.id) {
    const sharedMembership = await prisma.membership.findFirst({
      where: {
        userId: requestedUserId,
        companyId: {
          in: req.user!.memberships?.map((membership) => membership.companyId) || [],
        },
      },
    });

    if (!sharedMembership) {
      throw new HttpError(403, "Access denied");
    }
  }

  const memberships = await prisma.membership.findMany({
    where: { userId: requestedUserId },
    include: {
      company: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const companyIds = memberships.map((membership) => membership.companyId);
  const projects = await prisma.project.findMany({
    where: {
      companyId: { in: companyIds },
    },
    include: {
      company: true,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: requestedUserId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  res.json({
    user,
    memberships,
    projects,
  });
});
