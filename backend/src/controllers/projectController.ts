import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { ensureCompanyRole } from "../middleware/permission";
import { getProjectWithAccess } from "../services/access";
import { asyncHandler } from "../utils/errors";
import { getParamString } from "../utils/request";
import { projectSchema } from "../utils/validation";

export const listProjects = asyncHandler(async (req: Request, res: Response) => {
  const companyId = String(req.query.companyId || "");
  if (companyId) {
    ensureCompanyRole(req.user?.memberships, companyId, "viewer");
  }

  const projects = await prisma.project.findMany({
    where: companyId
      ? {
          OR: [
            { companyId },
            { shares: { some: { userId: req.user!.id } } }
          ],
          companyId // Filter by company if provided, but still check access
        }
      : {
          OR: [
            {
              company: {
                memberships: {
                  some: { userId: req.user!.id },
                },
              },
            },
            {
              shares: {
                some: { userId: req.user!.id },
              },
            },
          ],
        },
    include: {
      company: true,
      subprojects: {
        include: {
          stages: {
            include: {
              items: {
                include: {
                  children: true,
                },
                orderBy: { order: "asc" },
              },
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
      customFields: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(projects);
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const data = projectSchema.parse(req.body);
  ensureCompanyRole(req.user?.memberships, data.companyId, "admin");

  const project = await prisma.project.create({
    data: data,
    include: { company: true, subprojects: true, customFields: true },
  });

  res.status(201).json(project);
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = getParamString(req.params.id);
  const project = await getProjectWithAccess(
    req.user!.id,
    req.user!.memberships || [],
    projectId,
    "admin",
  );
  const data = projectSchema.partial().omit({ companyId: true }).parse(req.body);

  const updated = await prisma.project.update({
    where: { id: project.id },
    data,
  });

  res.json(updated);
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = getParamString(req.params.id);
  const project = await getProjectWithAccess(
    req.user!.id,
    req.user!.memberships || [],
    projectId,
    "admin",
  );

  await prisma.project.delete({ where: { id: project.id } });
  res.status(204).send();
});

export const getProjectSubprojects = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = getParamString(req.params.id);
    const project = await getProjectWithAccess(
      req.user!.id,
      req.user!.memberships || [],
      projectId,
      "viewer",
    );

    const subprojects = await prisma.subproject.findMany({
      where: { projectId: project.id },
      include: {
        stages: {
          include: {
            items: {
              include: {
                children: {
                  orderBy: { order: "asc" },
                },
                fieldValues: true,
                attachments: true,
                lists: {
                  include: { entries: { orderBy: { order: "asc" } } },
                },
                assignments: {
                  include: {
                    user: {
                      select: { id: true, name: true, email: true },
                    },
                  },
                },
              },
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    res.json(subprojects);
  },
);
