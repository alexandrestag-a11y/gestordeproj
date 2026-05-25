import type { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const errorHandler = (
  error: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("Error caught by errorHandler:", error);

  const status = error.status || 500;
  res.status(status).json({
    message: error.message || "Internal server error",
    error: process.env.NODE_ENV !== "production" ? error : undefined,
  });
};
