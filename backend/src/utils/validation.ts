import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const companySchema = z.object({
  name: z.string().min(2),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export const membershipSchema = z.object({
  userId: z.string().uuid().optional(),
  email: z.string().email().optional(),
  role: z.enum(["admin", "member", "viewer"]).default("member"),
  name: z.string().min(2).optional(),
});

export const projectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  content: z.string().optional(),
  status: z.string().optional(),
  color: z.string().optional(),
  companyId: z.string().uuid(),
  folderId: z.string().uuid().nullable().optional(),
});

export const folderSchema = z.object({
  name: z.string().min(1),
  companyId: z.string().uuid(),
  parentId: z.string().uuid().nullable().optional(),
});

export const projectShareSchema = z.object({
  email: z.string().email(),
  role: z.enum(["viewer", "editor"]).default("viewer"),
});

export const subprojectSchema = z.object({
  name: z.string().min(2),
  order: z.number().int().optional(),
});

export const stageSchema = z.object({
  name: z.string().min(1),
  order: z.number().int().optional(),
  color: z.string().optional(),
});

export const stageReorderSchema = z.object({
  stageIds: z.array(z.string().uuid()),
});

export const itemSchema = z.object({
  name: z.string().min(1),
  order: z.number().int().optional(),
  parentId: z.string().uuid().nullable().optional(),
});

export const itemMoveSchema = z.object({
  stageId: z.string().uuid(),
  order: z.number().int().optional(),
  parentId: z.string().uuid().nullable().optional(),
});

export const itemReorderSchema = z.object({
  order: z.number().int(),
  parentId: z.string().uuid().nullable().optional(),
});

export const customFieldSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["text", "number", "date", "select", "checkbox", "url"]),
  options: z.array(z.string()).optional(),
});

export const fieldValueSchema = z.object({
  fieldId: z.string().uuid(),
  value: z.string().nullable().optional(),
});

export const listSchema = z.object({
  title: z.string().min(1),
  entries: z
    .array(
      z.object({
        text: z.string().min(1),
        done: z.boolean().optional(),
        order: z.number().int().optional(),
      }),
    )
    .optional(),
});

export const listUpdateSchema = z.object({
  title: z.string().min(1),
  entries: z.array(
    z.object({
      id: z.string().uuid().optional(),
      text: z.string().min(1),
      done: z.boolean().optional(),
      order: z.number().int().optional(),
    }),
  ),
});
