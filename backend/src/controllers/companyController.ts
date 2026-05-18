import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { ensureCompanyRole } from "../middleware/permission";
import { asyncHandler, HttpError } from "../utils/errors";
import { companySchema, membershipSchema } from "../utils/validation";

export const listCompanies = asyncHandler(async (req: Request, res: Response) => {
  const companies = await prisma.company.findMany({
    where: {
      memberships: {
        some: {
          userId: req.user!.id,
        },
      },
    },
    include: {
      memberships: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      projects: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(companies);
});

export const createCompany = asyncHandler(async (req: Request, res: Response) => {
  const data = companySchema.parse(req.body);

  const company = await prisma.company.create({
    data: {
      name: data.name,
      logoUrl: data.logoUrl || null,
      memberships: {
        create: {
          userId: req.user!.id,
          role: "admin",
        },
      },
    },
    include: {
      memberships: true,
    },
  });

  res.status(201).json(company);
});

export const listMembers = asyncHandler(async (req: Request, res: Response) => {
  const companyId = req.params.id;
  ensureCompanyRole(req.user?.memberships, companyId, "viewer");

  const members = await prisma.membership.findMany({
    where: { companyId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  res.json(members);
});

export const addMember = asyncHandler(async (req: Request, res: Response) => {
  const companyId = req.params.id;
  ensureCompanyRole(req.user?.memberships, companyId, "admin");
  const data = membershipSchema.parse(req.body);

  let userId = data.userId;
  if (!userId && data.email) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      userId = existing.id;
    } else {
      if (!data.name) {
        throw new HttpError(400, "Name is required to create a new user");
      }
      const createdUser = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email.toLowerCase(),
          passwordHash: await import("bcryptjs").then(({ default: bcrypt }) =>
            bcrypt.hash("changeme123", 10),
          ),
        },
      });
      userId = createdUser.id;
    }
  }

  if (!userId) {
    throw new HttpError(400, "User reference is required");
  }

  const membership = await prisma.membership.upsert({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
    update: { role: data.role },
    create: {
      userId,
      companyId,
      role: data.role,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  res.status(201).json(membership);
});
