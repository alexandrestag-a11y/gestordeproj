import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler, HttpError } from "../utils/errors";
import { signToken } from "../utils/auth";
import { loginSchema, registerSchema } from "../utils/validation";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (existingUser) {
    throw new HttpError(409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
    },
  });

  const token = signToken({ sub: user.id, email: user.email });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    throw new HttpError(401, "Invalid credentials");
  }

  const token = signToken({ sub: user.id, email: user.email });
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      memberships: {
        include: {
          company: true,
        },
      },
    },
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  res.json(user);
});
