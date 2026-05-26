import { Building2, ChevronDown, ChevronRight, Folder as FolderIcon, FolderKanban, LayoutDashboard, LogOut, Users, Plus, FileText, CheckSquare } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import type { Company, Folder, Project, Subproject, Stage, Item } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useFolders, useProjects, useSubprojects } from "../../hooks/useProjects";

const ProjectTreeItem = ({ project, level = 0 }: { project: Project, level?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: subprojects = [] } = useSubprojects(isOpen ? project.id : undefined);

  return (
    <div className="space-y-1">
      <div
        className="flex w-full items-center gap-2 rounded-xl py-2 pr-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white cursor-pointer"
        style={{ paddingLeft: `${(level + 1) * 0.75 + 0.75}rem` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <button className="p-0.5 hover:bg-white/10 rounded">
          {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
        <FolderKanban className="h-3.5 w-3.5 text-blue-500/50" />
        <Link
          to={`/projects/${project.id}`}
          className="truncate flex-1 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {project.name}
        </Link>
      </div>

      {isOpen && (
        <div className="space-y-1">
          {subprojects.map(sub => (
            <SubprojectTreeItem key={sub.id} subproject={sub} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const SubprojectTreeItem = ({ subproject, level = 0 }: { subproject: Subproject, level?: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1">
      <div
        className="flex w-full items-center gap-2 rounded-xl py-2 pr-3 text-sm text-slate-500 transition hover:bg-white/5 hover:text-white cursor-pointer"
        style={{ paddingLeft: `${(level + 1) * 0.75 + 0.75}rem` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <button className="p-0.5 hover:bg-white/10 rounded">
          {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
        <span className="truncate flex-1">{subproject.name}</span>
      </div>

      {isOpen && (
        <div className="space-y-1">
          {subproject.stages.map(stage => (
            <StageTreeItem key={stage.id} stage={stage} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const StageTreeItem = ({ stage, level = 0 }: { stage: Stage, level?: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1">
      <div
        className="flex w-full items-center gap-2 rounded-xl py-2 pr-3 text-xs text-slate-500 transition hover:bg-white/5 hover:text-white cursor-pointer"
        style={{ paddingLeft: `${(level + 1) * 0.75 + 0.75}rem` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <button className="p-0.5 hover:bg-white/10 rounded">
          {isOpen ? <ChevronDown className="h-2.5 w-2.5" /> : <ChevronRight className="h-2.5 w-2.5" />}
        </button>
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: stage.color || "#475569" }}
        />
        <span className="truncate flex-1">{stage.name}</span>
      </div>

      {isOpen && (
        <div className="space-y-1">
          {stage.items.map(item => (
            <Link
              key={item.id}
              to={`/items/${item.id}`}
              className="flex items-center gap-2 rounded-xl py-1.5 pr-3 text-[11px] text-slate-600 transition hover:bg-white/5 hover:text-white"
              style={{ paddingLeft: `${(level + 2) * 0.75 + 0.75}rem` }}
            >
              <CheckSquare className="h-3 w-3 text-slate-700" />
              <span className="truncate">{item.name}</span>
            </Link>
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
  level = 0
}: {
  folder: Folder;
  allFolders: Folder[];
  allProjects: Project[];
  level?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const subfolders = allFolders.filter(f => f.parentId === folder.id);
  const projects = allProjects.filter(p => p.folderId === folder.id);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
        style={{ paddingLeft: `${(level + 1) * 0.75 + 0.75}rem` }}
      >
        {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        <FolderIcon className="h-4 w-4 text-blue-400/60" />
        <span className="truncate">{folder.name}</span>
      </button>

      {isOpen && (
        <div className="space-y-1">
          {subfolders.map(sub => (
            <FolderItem
              key={sub.id}
              folder={sub}
              allFolders={allFolders}
              allProjects={allProjects}
              level={level + 1}
            />
          ))}
          {projects.map(project => (
            <ProjectTreeItem key={project.id} project={project} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar = ({
  companies,
  activeCompanyId,
}: {
  companies: Company[];
  activeCompanyId?: string;
}) => {
  const { user, logout } = useAuth();
  const { data: folders = [] } = useFolders(activeCompanyId);
  const { data: projects = [] } = useProjects(activeCompanyId);

  const rootFolders = folders.filter(f => !f.parentId);
  const rootProjects = projects.filter(p => !p.folderId);

  return (
    <aside className="flex w-80 flex-col bg-slate-950 px-5 py-6 text-slate-100">
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
                    />
                  ))}
                  {rootProjects.map(project => (
                    <ProjectTreeItem key={project.id} project={project} />
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
