import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { HttpError } from "../utils/errors";
import { verifyToken } from "../utils/auth";

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  if (!token) {
    return next(new HttpError(401, "Authentication required"));
  }

  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { memberships: true },
    });

    if (!user) {
      return next(new HttpError(401, "User not found"));
    }

    req.user = {
      id: user.id,
      email: user.email,
      memberships: user.memberships,
    };
    return next();
  } catch {
    return next(new HttpError(401, "Invalid token"));
  }
};
