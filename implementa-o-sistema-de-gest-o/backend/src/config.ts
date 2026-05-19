import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "change-me",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  maxFileSize: Number(process.env.MAX_FILE_SIZE || 20 * 1024 * 1024),
  uploadDir: process.env.UPLOAD_DIR || "uploads",
};
