import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getItemWithAccess, getProjectWithAccess } from "../services/access";
import { asyncHandler } from "../utils/errors";
import { customFieldSchema, fieldValueSchema } from "../utils/validation";

export const listFields = asyncHandler(async (req: Request, res: Response) => {
  await getProjectWithAccess(
    req.user!.id,
    req.user!.memberships || [],
    req.params.id,
    "viewer",
  );

  const fields = await prisma.customField.findMany({
    where: { projectId: req.params.id },
    orderBy: { name: "asc" },
  });

  res.json(fields);
});

export const createField = asyncHandler(async (req: Request, res: Response) => {
  await getProjectWithAccess(
    req.user!.id,
    req.user!.memberships || [],
    req.params.id,
    "admin",
  );
  const data = customFieldSchema.parse(req.body);

  const field = await prisma.customField.create({
    data: {
      projectId: req.params.id,
      name: data.name,
      type: data.type,
      options: data.options ? JSON.stringify(data.options) : null,
    },
  });

  res.status(201).json(field);
});

export const updateField = asyncHandler(async (req: Request, res: Response) => {
  const field = await prisma.customField.findUnique({
    where: { id: req.params.id },
    include: { project: true },
  });

  if (!field) {
    return res.status(404).json({ message: "Field not found" });
  }

  await getProjectWithAccess(
    req.user!.id,
    req.user!.memberships || [],
    field.projectId,
    "admin",
  );

  const data = customFieldSchema.partial().parse(req.body);
  const updated = await prisma.customField.update({
    where: { id: req.params.id },
    data: {
      name: data.name,
      type: data.type,
      options: data.options ? JSON.stringify(data.options) : undefined,
    },
  });

  res.json(updated);
});

export const deleteField = asyncHandler(async (req: Request, res: Response) => {
  const field = await prisma.customField.findUnique({
    where: { id: req.params.id },
  });

  if (!field) {
    return res.status(404).json({ message: "Field not found" });
  }

  await getProjectWithAccess(
    req.user!.id,
    req.user!.memberships || [],
    field.projectId,
    "admin",
  );

  await prisma.customField.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export const saveFieldValue = asyncHandler(async (req: Request, res: Response) => {
  await getItemWithAccess(req.user!.memberships || [], req.params.id, "member");
  const data = fieldValueSchema.parse(req.body);

  const value = await prisma.fieldValue.upsert({
    where: {
      fieldId_itemId: {
        fieldId: data.fieldId,
        itemId: req.params.id,
      },
    },
    update: {
      value: data.value ?? null,
    },
    create: {
      fieldId: data.fieldId,
      itemId: req.params.id,
      value: data.value ?? null,
    },
    include: {
      field: true,
    },
  });

  res.status(201).json(value);
});
