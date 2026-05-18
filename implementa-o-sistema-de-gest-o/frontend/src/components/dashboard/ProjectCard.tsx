import { FolderKanban } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../../types";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

export const ProjectCard = ({ project }: { project: Project }) => (
  <Link to={`/projects/${project.id}`}>
    <Card className="group h-full border-slate-200 p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-200">
      <div className="mb-4 flex items-start justify-between">
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
          <FolderKanban className="h-5 w-5" />
        </div>
        <Badge>{project.status}</Badge>
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
        {project.description || "Sem descricao informada."}
      </p>
      <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
        <span>{project.company?.name}</span>
        <span>{project.subprojects.length} subprojetos</span>
      </div>
    </Card>
  </Link>
);
