import jwt from "jsonwebtoken";
import { config } from "../config";

export type JwtPayload = {
  sub: string;
  email: string;
};

export const signToken = (payload: JwtPayload) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });

export const verifyToken = (token: string) =>
  jwt.verify(token, config.jwtSecret) as JwtPayload;
