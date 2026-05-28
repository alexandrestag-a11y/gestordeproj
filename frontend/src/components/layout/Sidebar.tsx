import { Building2, ChevronDown, ChevronRight, Folder as FolderIcon, FolderKanban, LayoutDashboard, LogOut, Users, Plus, FileText, CheckSquare, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import type { Company, Folder, Project, Subproject, Stage, Item } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useFolders, useProjects, useSubprojects } from "../../hooks/useProjects";

const ProjectTreeItem = ({
  project,
  level = 0,
  onEdit,
  onDelete,
  onEditSubproject,
  onDeleteSubproject,
  onEditStage,
  onDeleteStage,
  onEditItem,
  onDeleteItem,
}: {
  project: Project,
  level?: number,
  onEdit?: (p: Project) => void,
  onDelete?: (id: string) => void,
  onEditSubproject?: (s: Subproject) => void,
  onDeleteSubproject?: (id: string) => void,
  onEditStage?: (s: Stage) => void,
  onDeleteStage?: (id: string) => void,
  onEditItem?: (i: Item) => void,
  onDeleteItem?: (id: string) => void,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: subprojects = [] } = useSubprojects(isOpen ? project.id : undefined);

  return (
    <div className="space-y-1 group/item">
      <div
        className="flex w-full items-center gap-2 rounded-xl py-2 pr-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white cursor-pointer relative"
        style={{ paddingLeft: `${(level + 1) * 0.75 + 0.75}rem` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <button className="p-0.5 hover:bg-white/10 rounded">
          {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
        <FolderKanban className="h-3.5 w-3.5 text-blue-500/50" />
        <Link
          to={`/projects/${project.id}`}
          className="truncate flex-1 hover:underline text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          {project.name}
        </Link>
        <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition ml-2">
          <button
            className="p-1 hover:text-blue-400"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(project);
            }}
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            className="p-1 hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(project.id);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-1">
          {subprojects.map(sub => (
            <SubprojectTreeItem
              key={sub.id}
              subproject={sub}
              level={level + 1}
              onEdit={onEditSubproject}
              onDelete={onDeleteSubproject}
              onEditStage={onEditStage}
              onDeleteStage={onDeleteStage}
              onEditItem={onEditItem}
              onDeleteItem={onDeleteItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SubprojectTreeItem = ({
  subproject,
  level = 0,
  onEdit,
  onDelete,
  onEditStage,
  onDeleteStage,
  onEditItem,
  onDeleteItem,
}: {
  subproject: Subproject,
  level?: number,
  onEdit?: (s: Subproject) => void,
  onDelete?: (id: string) => void,
  onEditStage?: (s: Stage) => void,
  onDeleteStage?: (id: string) => void,
  onEditItem?: (i: Item) => void,
  onDeleteItem?: (id: string) => void,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1 group/sub">
      <div
        className="flex w-full items-center gap-2 rounded-xl py-2 pr-3 text-[13px] text-slate-500 transition hover:bg-white/5 hover:text-white cursor-pointer"
        style={{ paddingLeft: `${(level + 1) * 0.75 + 0.75}rem` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <button className="p-0.5 hover:bg-white/10 rounded">
          {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
        <span className="truncate flex-1">{subproject.name}</span>
        <div className="flex gap-1 opacity-0 group-hover/sub:opacity-100 transition ml-2">
          <button
            className="p-1 hover:text-blue-400"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(subproject);
            }}
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            className="p-1 hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(subproject.id);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-1">
          {subproject.stages.map(stage => (
            <StageTreeItem
              key={stage.id}
              stage={stage}
              level={level + 1}
              onEdit={onEditStage}
              onDelete={onDeleteStage}
              onEditItem={onEditItem}
              onDeleteItem={onDeleteItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const StageTreeItem = ({
  stage,
  level = 0,
  onEdit,
  onDelete,
  onEditItem,
  onDeleteItem,
}: {
  stage: Stage,
  level?: number,
  onEdit?: (s: Stage) => void,
  onDelete?: (id: string) => void,
  onEditItem?: (i: Item) => void,
  onDeleteItem?: (id: string) => void,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1 group/stage">
      <div
        className="flex w-full items-center gap-2 rounded-xl py-2 pr-3 text-xs text-slate-500 transition hover:bg-white/5 hover:text-white cursor-pointer"
        style={{ paddingLeft: `${(level + 1) * 0.75 + 0.75}rem` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <button className="p-0.5 hover:bg-white/10 rounded">
          {isOpen ? <ChevronDown className="h-2.5 w-2.5" /> : <ChevronRight className="h-2.5 w-2.5" />}
        </button>
        <div
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: stage.color || "#475569" }}
        />
        <span className="truncate flex-1">{stage.name}</span>
        <div className="flex gap-1 opacity-0 group-hover/stage:opacity-100 transition ml-2">
          <button
            className="p-1 hover:text-blue-400"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(stage);
            }}
          >
            <Pencil className="h-2.5 w-2.5" />
          </button>
          <button
            className="p-1 hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(stage.id);
            }}
          >
            <Trash2 className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-1">
          {stage.items.map(item => (
            <div key={item.id} className="group/it relative">
              <Link
                to={`/items/${item.id}`}
                className="flex items-center gap-2 rounded-xl py-1.5 pr-3 text-[11px] text-slate-600 transition hover:bg-white/5 hover:text-white"
                style={{ paddingLeft: `${(level + 2) * 0.75 + 0.75}rem` }}
              >
                <CheckSquare className="h-3 w-3 text-slate-700" />
                <span className="truncate flex-1">{item.name}</span>
              </Link>
              <div className="absolute top-1 right-2 flex gap-1 opacity-0 group-hover/it:opacity-100 transition">
                <button
                  className="p-0.5 hover:text-blue-400"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEditItem?.(item);
                  }}
                >
                  <Pencil className="h-2.5 w-2.5" />
                </button>
                <button
                  className="p-0.5 hover:text-red-400"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDeleteItem?.(item.id);
                  }}
                >
                  <Trash2 className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FolderItem = ({
  folder,
  allFolders,
  allProjects,
  level = 0,
  onEditFolder,
  onDeleteFolder,
  onEditProject,
  onDeleteProject,
  onEditSubproject,
  onDeleteSubproject,
  onEditStage,
  onDeleteStage,
  onEditItem,
  onDeleteItem,
}: {
  folder: Folder;
  allFolders: Folder[];
  allProjects: Project[];
  level?: number;
  onEditFolder?: (f: Folder) => void;
  onDeleteFolder?: (id: string) => void;
  onEditProject?: (p: Project) => void;
  onDeleteProject?: (id: string) => void;
  onEditSubproject?: (s: Subproject) => void;
  onDeleteSubproject?: (id: string) => void;
  onEditStage?: (s: Stage) => void;
  onDeleteStage?: (id: string) => void;
  onEditItem?: (i: Item) => void;
  onDeleteItem?: (id: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const subfolders = allFolders.filter(f => f.parentId === folder.id);
  const projects = allProjects.filter(p => p.folderId === folder.id);

  return (
    <div className="space-y-1 group/folder">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white cursor-pointer"
        style={{ paddingLeft: `${(level + 1) * 0.75 + 0.75}rem` }}
      >
        {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        <FolderIcon className="h-4 w-4 text-blue-400/60" />
        <span className="truncate flex-1">{folder.name}</span>
        <div className="flex gap-1 opacity-0 group-hover/folder:opacity-100 transition ml-2">
          <button
            className="p-1 hover:text-blue-400"
            onClick={(e) => {
              e.stopPropagation();
              onEditFolder?.(folder);
            }}
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            className="p-1 hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteFolder?.(folder.id);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-1">
          {subfolders.map(sub => (
            <FolderItem
              key={sub.id}
              folder={sub}
              allFolders={allFolders}
              allProjects={allProjects}
              level={level + 1}
              onEditFolder={onEditFolder}
              onDeleteFolder={onDeleteFolder}
              onEditProject={onEditProject}
              onDeleteProject={onDeleteProject}
            />
          ))}
          {projects.map(project => (
            <ProjectTreeItem
              key={project.id}
              project={project}
              level={level + 1}
              onEdit={onEditProject}
              onDelete={onDeleteProject}
              onEditSubproject={onEditSubproject}
              onDeleteSubproject={onDeleteSubproject}
              onEditStage={onEditStage}
              onDeleteStage={onDeleteStage}
              onEditItem={onEditItem}
              onDeleteItem={onDeleteItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar = ({
  companies,
  activeCompanyId,
  onEditFolder,
  onDeleteFolder,
  onEditProject,
  onDeleteProject,
  onEditSubproject,
  onDeleteSubproject,
  onEditStage,
  onDeleteStage,
  onEditItem,
  onDeleteItem,
}: {
  companies: Company[];
  activeCompanyId?: string;
  onEditFolder?: (f: Folder) => void;
  onDeleteFolder?: (id: string) => void;
  onEditProject?: (p: Project) => void;
  onDeleteProject?: (id: string) => void;
  onEditSubproject?: (s: Subproject) => void;
  onDeleteSubproject?: (id: string) => void;
  onEditStage?: (s: Stage) => void;
  onDeleteStage?: (id: string) => void;
  onEditItem?: (i: Item) => void;
  onDeleteItem?: (id: string) => void;
}) => {
  const { user, logout } = useAuth();
  const { data: folders = [] } = useFolders(activeCompanyId);
  const { data: projects = [] } = useProjects(activeCompanyId);

  const rootFolders = folders.filter(f => !f.parentId);
  const rootProjects = projects.filter(p => !p.folderId);

  return (
    <aside className="flex h-full w-80 flex-col bg-slate-950 px-5 py-6 text-slate-100 overflow-y-auto">
      <Link to="/" className="mb-8 block rounded-3xl bg-white/5 px-4 py-4">
        <div className="text-xs uppercase tracking-[0.24em] text-blue-200">Orbit</div>
        <div className="mt-2 text-xl font-semibold">Project Control Hub</div>
      </Link>

      <nav className="space-y-2">
        <NavLink
          to="/"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </NavLink>
      </nav>

      <div className="mt-8">
        <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Empresas</div>
        <div className="space-y-3">
          {companies.map((company) => (
            <div
              key={company.id}
              className={`rounded-2xl px-4 py-3 ${activeCompanyId === company.id ? "bg-blue-600/20 ring-1 ring-blue-400/40" : "bg-white/5"}`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-blue-200" />
                <div className="font-medium">{company.name}</div>
              </div>
              {activeCompanyId === company.id && (
                <div className="mt-2 space-y-1">
                  {rootFolders.map(folder => (
                    <FolderItem
                      key={folder.id}
                      folder={folder}
                      allFolders={folders}
                      allProjects={projects}
                      onEditFolder={onEditFolder}
                      onDeleteFolder={onDeleteFolder}
                      onEditProject={onEditProject}
                      onDeleteProject={onDeleteProject}
                      onEditSubproject={onEditSubproject}
                      onDeleteSubproject={onDeleteSubproject}
                      onEditStage={onEditStage}
                      onDeleteStage={onDeleteStage}
                      onEditItem={onEditItem}
                      onDeleteItem={onDeleteItem}
                    />
                  ))}
                  {rootProjects.map(project => (
                    <ProjectTreeItem
                      key={project.id}
                      project={project}
                      onEdit={onEditProject}
                      onDelete={onDeleteProject}
                      onEditSubproject={onEditSubproject}
                      onDeleteSubproject={onDeleteSubproject}
                      onEditStage={onEditStage}
                      onDeleteStage={onDeleteStage}
                      onEditItem={onEditItem}
                      onDeleteItem={onDeleteItem}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
          <Users className="h-3.5 w-3.5" />
          Usuarios
        </div>
        <div className="space-y-2">
          {companies
            .find((company) => company.id === activeCompanyId)
            ?.memberships.slice(0, 5)
            .map((membership) => (
              <Link
                key={membership.id}
                to={`/users/${membership.user.id}`}
                className="block rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
              >
                {membership.user.name}
              </Link>
            ))}
        </div>
      </div>

      <div className="mt-auto rounded-3xl bg-white/5 p-4">
        <div className="text-sm font-semibold">{user?.name}</div>
        <div className="text-xs text-slate-400">{user?.email}</div>
        <button
          className="mt-4 inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
};
