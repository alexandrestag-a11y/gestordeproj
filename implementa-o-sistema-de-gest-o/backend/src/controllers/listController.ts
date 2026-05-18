import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getItemWithAccess } from "../services/access";
import { asyncHandler, HttpError } from "../utils/errors";
import { listSchema, listUpdateSchema } from "../utils/validation";

export const createList = asyncHandler(async (req: Request, res: Response) => {
  await getItemWithAccess(req.user!.memberships || [], req.params.id, "member");
  const data = listSchema.parse(req.body);

  const list = await prisma.itemList.create({
    data: {
      itemId: req.params.id,
      title: data.title,
      entries: {
        create:
          data.entries?.map((entry, index) => ({
            text: entry.text,
            done: entry.done ?? false,
            order: entry.order ?? index,
          })) || [],
      },
    },
    include: { entries: { orderBy: { order: "asc" } } },
  });

  res.status(201).json(list);
});

export const updateList = asyncHandler(async (req: Request, res: Response) => {
  const list = await prisma.itemList.findUnique({
    where: { id: req.params.id },
    include: { item: true },
  });

  if (!list) {
    throw new HttpError(404, "List not found");
  }

  await getItemWithAccess(req.user!.memberships || [], list.itemId, "member");
  const data = listUpdateSchema.parse(req.body);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.listEntry.deleteMany({
      where: { listId: list.id },
    });

    await tx.itemList.update({
      where: { id: list.id },
      data: { title: data.title },
    });

    return tx.itemList.update({
      where: { id: list.id },
      data: {
        entries: {
          create: data.entries.map((entry, index) => ({
            text: entry.text,
            done: entry.done ?? false,
            order: entry.order ?? index,
          })),
        },
      },
      include: { entries: { orderBy: { order: "asc" } } },
    });
  });

  res.json(updated);
});
