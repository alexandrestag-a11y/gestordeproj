import { ChevronDown, ChevronRight, Folder as FolderIcon, MoreVertical } from "lucide-react";
import { useState } from "react";
import type { Folder, Project } from "../../types";
import { ProjectCard } from "../dashboard/ProjectCard";

interface FolderTreeProps {
  folders: Folder[];
  projects: Project[];
  level?: number;
  onNavigate: (folderId: string | null) => void;
  activeFolderId: string | null;
}

export const FolderTree = ({
  folders,
  projects,
  level = 0,
  onNavigate,
  activeFolderId,
}: FolderTreeProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-1">
      {folders.map((folder) => (
        <div key={folder.id}>
          <div
            className={`flex items-center justify-between rounded-xl px-3 py-2 cursor-pointer transition ${
              activeFolderId === folder.id ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200" : "hover:bg-slate-50 text-slate-700"
            }`}
            style={{ marginLeft: `${level * 1.5}rem` }}
            onClick={() => onNavigate(folder.id)}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => toggle(folder.id, e)}
                className="p-0.5 hover:bg-slate-200 rounded"
              >
                {expanded[folder.id] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              <FolderIcon className={`h-4 w-4 ${activeFolderId === folder.id ? "text-blue-600" : "text-slate-400"}`} />
              <span className="text-sm font-medium">{folder.name}</span>
            </div>
            <MoreVertical className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100" />
          </div>

          {expanded[folder.id] && (
            <div className="mt-1">
              <FolderTree
                folders={folders.filter((f) => f.parentId === folder.id)}
                projects={projects.filter((p) => p.folderId === folder.id)}
                level={level + 1}
                onNavigate={onNavigate}
                activeFolderId={activeFolderId}
              />

              {projects
                .filter((p) => p.folderId === folder.id)
                .map((project) => (
                  <div
                    key={project.id}
                    className="ml-4 mt-2 mb-4"
                    style={{ marginLeft: `${(level + 1) * 1.5 + 1}rem` }}
                  >
                     <ProjectCard project={project} />
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
