import cors from "cors";
import express from "express";
import { config } from "./config";
import { requireAuth } from "./middleware/auth";
import { errorHandler } from "./utils/errors";
import authRoutes from "./routes/auth";
import companyRoutes from "./routes/companies";
import projectRoutes from "./routes/projects";
import subprojectRoutes from "./routes/subprojects";
import stageRoutes from "./routes/stages";
import itemRoutes from "./routes/items";
import fieldRoutes from "./routes/fields";
import attachmentRoutes from "./routes/attachments";
import listRoutes from "./routes/lists";
import userRoutes from "./routes/users";
import path from "node:path";

const app = express();
const uploadDir = path.join(process.cwd(), config.uploadDir);

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/companies", requireAuth, companyRoutes);
app.use("/api/projects", requireAuth, projectRoutes);
app.use("/api/subprojects", requireAuth, subprojectRoutes);
app.use("/api/stages", requireAuth, stageRoutes);
app.use("/api/items", requireAuth, itemRoutes);
app.use("/api/fields", requireAuth, fieldRoutes);
app.use("/api/attachments", requireAuth, attachmentRoutes);
app.use("/api/lists", requireAuth, listRoutes);
app.use("/api/users", requireAuth, userRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`API running on http://localhost:${config.port}`);
});
