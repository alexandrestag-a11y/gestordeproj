import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getItemWithAccess, getStageWithAccess } from "../services/access";
import { asyncHandler } from "../utils/errors";
import { getParamString } from "../utils/request";
import {
  itemMoveSchema,
  itemReorderSchema,
  itemSchema,
} from "../utils/validation";

export const listItems = asyncHandler(async (req: Request, res: Response) => {
  const stageId = getParamString(req.params.id);
  await getStageWithAccess(req.user!.memberships || [], stageId, "viewer");

  const items = await prisma.item.findMany({
    where: { stageId, parentId: null },
    include: {
      children: {
        orderBy: { order: "asc" },
      },
      fieldValues: {
        include: { field: true },
      },
      attachments: true,
      lists: {
        include: {
          entries: {
            orderBy: { order: "asc" },
          },
        },
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
  });

  res.json(items);
});

export const createItem = asyncHandler(async (req: Request, res: Response) => {
  const stageId = getParamString(req.params.id);
  await getStageWithAccess(req.user!.memberships || [], stageId, "member");
  const data = itemSchema.parse(req.body);

  const item = await prisma.item.create({
    data: {
      stageId,
      name: data.name,
      order: data.order ?? 0,
      parentId: data.parentId ?? null,
    },
  });

  res.status(201).json(item);
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const itemId = getParamString(req.params.id);
  await getItemWithAccess(req.user!.memberships || [], itemId, "member");
  const data = itemSchema.partial().parse(req.body);

  const item = await prisma.item.update({
    where: { id: itemId },
    data,
  });

  res.json(item);
});

export const moveItem = asyncHandler(async (req: Request, res: Response) => {
  const itemId = getParamString(req.params.id);
  await getItemWithAccess(req.user!.memberships || [], itemId, "member");
  const data = itemMoveSchema.parse(req.body);
  await getStageWithAccess(req.user!.memberships || [], data.stageId, "member");

  const item = await prisma.item.update({
    where: { id: itemId },
    data: {
      stageId: data.stageId,
      order: data.order ?? 0,
      parentId: data.parentId ?? null,
    },
  });

  res.json(item);
});

export const reorderItem = asyncHandler(async (req: Request, res: Response) => {
  const itemId = getParamString(req.params.id);
  await getItemWithAccess(req.user!.memberships || [], itemId, "member");
  const data = itemReorderSchema.parse(req.body);

  const item = await prisma.item.update({
    where: { id: itemId },
    data,
  });

  res.json(item);
});

export const createChildItem = asyncHandler(async (req: Request, res: Response) => {
  const itemId = getParamString(req.params.id);
  const parent = await getItemWithAccess(
    req.user!.memberships || [],
    itemId,
    "member",
  );
  const data = itemSchema.parse(req.body);

  const item = await prisma.item.create({
    data: {
      name: data.name,
      order: data.order ?? 0,
      stageId: parent.stageId,
      parentId: parent.id,
    },
  });

  res.status(201).json(item);
});

export const getItemDetail = asyncHandler(async (req: Request, res: Response) => {
  const itemId = getParamString(req.params.id);
  await getItemWithAccess(req.user!.memberships || [], itemId, "viewer");

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: {
      children: {
        include: {
          children: true,
        },
        orderBy: { order: "asc" },
      },
      stage: {
        include: {
          subproject: {
            include: {
              project: {
                include: {
                  customFields: true,
                },
              },
            },
          },
        },
      },
      fieldValues: {
        include: {
          field: true,
        },
      },
      attachments: true,
      lists: {
        include: {
          entries: {
            orderBy: { order: "asc" },
          },
        },
      },
      assignments: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  res.json(item);
});
