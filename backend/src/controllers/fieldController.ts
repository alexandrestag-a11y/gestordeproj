import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getItemWithAccess, getProjectWithAccess } from "../services/access";
import { asyncHandler } from "../utils/errors";
import { getParamString } from "../utils/request";
import { customFieldSchema, fieldValueSchema } from "../utils/validation";

export const listFields = asyncHandler(async (req: Request, res: Response) => {
  const projectId = getParamString(req.params.id);
  await getProjectWithAccess(
    req.user!.id,
    req.user!.memberships || [],
    projectId,
    "viewer",
  );

  const fields = await prisma.customField.findMany({
    where: { projectId },
    orderBy: { name: "asc" },
  });

  res.json(fields);
});

export const createField = asyncHandler(async (req: Request, res: Response) => {
  const projectId = getParamString(req.params.id);
  await getProjectWithAccess(
    req.user!.id,
    req.user!.memberships || [],
    projectId,
    "admin",
  );
  const data = customFieldSchema.parse(req.body);

  const field = await prisma.customField.create({
    data: {
      projectId,
      name: data.name,
      type: data.type,
      options: data.options ? JSON.stringify(data.options) : null,
    },
  });

  res.status(201).json(field);
});

export const updateField = asyncHandler(async (req: Request, res: Response) => {
  const fieldId = getParamString(req.params.id);
  const field = await prisma.customField.findUnique({
    where: { id: fieldId },
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
    where: { id: fieldId },
    data: {
      name: data.name,
      type: data.type,
      options: data.options ? JSON.stringify(data.options) : undefined,
    },
  });

  res.json(updated);
});

export const deleteField = asyncHandler(async (req: Request, res: Response) => {
  const fieldId = getParamString(req.params.id);
  const field = await prisma.customField.findUnique({
    where: { id: fieldId },
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

  await prisma.customField.delete({ where: { id: fieldId } });
  res.status(204).send();
});

export const saveFieldValue = asyncHandler(async (req: Request, res: Response) => {
  const itemId = getParamString(req.params.id);
  await getItemWithAccess(req.user!.memberships || [], itemId, "member");
  const data = fieldValueSchema.parse(req.body);

  const value = await prisma.fieldValue.upsert({
    where: {
      fieldId_itemId: {
        fieldId: data.fieldId,
        itemId,
      },
    },
    update: {
      value: data.value ?? null,
    },
    create: {
      fieldId: data.fieldId,
      itemId,
      value: data.value ?? null,
    },
    include: {
      field: true,
    },
  });

  res.status(201).json(value);
});
