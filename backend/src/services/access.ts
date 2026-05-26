import type { Membership } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { ensureCompanyRole } from "../middleware/permission";
import { HttpError } from "../utils/errors";

type MembershipScope = Pick<Membership, "id" | "userId" | "companyId" | "role">;

export const getProjectWithAccess = async (
  userId: string,
  memberships: MembershipScope[],
  projectId: string,
  minimumRole: "viewer" | "member" | "admin" = "viewer",
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { shares: true },
  });

  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  // Check if user has direct share
  const share = project.shares.find((s) => s.userId === userId);
  const shareRank = share ? (share.role === "editor" ? 2 : 1) : 0;
  const minimumRank = minimumRole === "admin" ? 3 : minimumRole === "member" ? 2 : 1;

  if (shareRank >= minimumRank) {
    return project;
  }

  ensureCompanyRole(memberships, project.companyId, minimumRole);
  return project;
};

export const getSubprojectWithAccess = async (
  memberships: MembershipScope[],
  subprojectId: string,
  minimumRole: "viewer" | "member" | "admin" = "viewer",
) => {
  const subproject = await prisma.subproject.findUnique({
    where: { id: subprojectId },
    include: { project: true },
  });

  if (!subproject) {
    throw new HttpError(404, "Subproject not found");
  }

  ensureCompanyRole(memberships, subproject.project.companyId, minimumRole);
  return subproject;
};

export const getStageWithAccess = async (
  memberships: MembershipScope[],
  stageId: string,
  minimumRole: "viewer" | "member" | "admin" = "viewer",
) => {
  const stage = await prisma.stage.findUnique({
    where: { id: stageId },
    include: { subproject: { include: { project: true } } },
  });

  if (!stage) {
    throw new HttpError(404, "Stage not found");
  }

  ensureCompanyRole(
    memberships,
    stage.subproject.project.companyId,
    minimumRole,
  );
  return stage;
};

export const getItemWithAccess = async (
  memberships: MembershipScope[],
  itemId: string,
  minimumRole: "viewer" | "member" | "admin" = "viewer",
) => {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: {
      stage: {
        include: {
          subproject: {
            include: {
              project: true,
            },
          },
        },
      },
    },
  });

  if (!item) {
    throw new HttpError(404, "Item not found");
  }

  ensureCompanyRole(
    memberships,
    item.stage.subproject.project.companyId,
    minimumRole,
  );
  return item;
};