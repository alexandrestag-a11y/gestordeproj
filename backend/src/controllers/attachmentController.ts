import fs from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { config } from "../config";
import { getItemWithAccess } from "../services/access";
import { asyncHandler, HttpError } from "../utils/errors";
import { getParamString } from "../utils/request";

export const createAttachment = asyncHandler(async (req: Request, res: Response) => {
  const itemId = getParamString(req.params.id);
  await getItemWithAccess(req.user!.memberships || [], itemId, "member");

  if (!req.file) {
    throw new HttpError(400, "File is required");
  }

  const attachment = await prisma.attachment.create({
    data: {
      itemId,
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    },
  });

  res.status(201).json(attachment);
});

export const deleteAttachment = asyncHandler(async (req: Request, res: Response) => {
  const attachmentId = getParamString(req.params.id);
  const attachment = await prisma.attachment.findUnique({
    where: { id: attachmentId },
    include: { item: true },
  });

  if (!attachment) {
    throw new HttpError(404, "Attachment not found");
  }

  await getItemWithAccess(req.user!.memberships || [], attachment.itemId, "member");

  const diskPath = path.join(process.cwd(), config.uploadDir, path.basename(attachment.fileUrl));
  if (fs.existsSync(diskPath)) {
    fs.unlinkSync(diskPath);
  }

  await prisma.attachment.delete({ where: { id: attachment.id } });
  res.status(204).send();
});
