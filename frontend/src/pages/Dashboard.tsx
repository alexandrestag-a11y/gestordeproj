import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Folder as FolderIcon, MoreVertical } from "lucide-react";
import { Header } from "../components/layout/Header";
import { PageWrapper } from "../components/layout/PageWrapper";
import { CompanyFilter } from "../components/dashboard/CompanyFilter";
import { ProjectCard } from "../components/dashboard/ProjectCard";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { useCompanies, useProjects } from "../hooks/useProjects";
import { projectService } from "../services/projects";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [open, setOpen] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);
  const [openFolder, setOpenFolder] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  const { data: companies = [] } = useCompanies();
  const { data: projects = [], isLoading } = useProjects(companyId || undefined);

  // Use a local state for folders to allow easy fetching
  const [folders, setFolders] = useState<any[]>([]);

  useEffect(() => {
    if (companyId) {
      projectService.getFolders(companyId).then(setFolders);
    } else {
      setFolders([]);
    }
  }, [companyId]);

  const currentFolders = useMemo(() => {
    return folders.filter(f => f.parentId === activeFolderId);
  }, [folders, activeFolderId]);

  const currentProjects = useMemo(() => {
    return projects.filter(p => p.folderId === activeFolderId);
  }, [projects, activeFolderId]);

  const filteredProjects = useMemo(
    () => currentProjects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase())),
    [currentProjects, search],
  );

  const breadcrumbs = useMemo(() => {
    const list = [];
    let currentId = activeFolderId;
    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (folder) {
        list.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    return list;
  }, [folders, activeFolderId]);

  const createProject = useMutation({
    mutationFn: () => projectService.createProject({
      name: projectName,
      companyId,
      folderId: activeFolderId
    }),
    onSuccess: async () => {
      setOpen(false);
      setProjectName("");
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      await queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  const createFolder = useMutation({
    mutationFn: () => projectService.createFolder({
      name: folderName,
      companyId,
      parentId: activeFolderId
    }),
    onSuccess: async () => {
      setOpenFolder(false);
      setFolderName("");
      const updated = await projectService.getFolders(companyId);
      setFolders(updated);
    },
  });

  const createCompany = useMutation({
    mutationFn: () => projectService.createCompany({ name: companyName }),
    onSuccess: async () => {
      setOpenCompany(false);
      setCompanyName("");
      await queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  return (
    <PageWrapper>
      <Header
        title="Dashboard"
        subtitle="Projetos organizados por empresa, com busca e criacao rapida."
        search={search}
        onSearch={setSearch}
      />
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CompanyFilter companies={companies} value={companyId} onChange={(val) => {
              setCompanyId(val);
              setActiveFolderId(null);
            }} />
            <Button className="bg-slate-200 text-slate-800 hover:bg-slate-300" onClick={() => setOpenCompany(true)}>
              Nova Empresa
            </Button>
            {companyId && (
              <Button className="bg-slate-200 text-slate-800 hover:bg-slate-300" onClick={() => setOpenFolder(true)}>
                Nova Pasta
              </Button>
            )}
          </div>
          <Button onClick={() => setOpen(true)} disabled={!companyId}>
            Novo Projeto
          </Button>
        </div>

        {companyId && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <button
              className="hover:text-blue-600"
              onClick={() => setActiveFolderId(null)}
            >
              Raiz
            </button>
            {breadcrumbs.map(folder => (
              <div key={folder.id} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4" />
                <button
                  className="hover:text-blue-600"
                  onClick={() => setActiveFolderId(folder.id)}
                >
                  {folder.name}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 gap-5">
          {currentFolders.map((folder) => (
            <div
              key={folder.id}
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-200 cursor-pointer hover:border-blue-400 transition"
              onClick={() => setActiveFolderId(folder.id)}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <FolderIcon className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium text-slate-900">{folder.name}</span>
              </div>
              <MoreVertical className="h-4 w-4 text-slate-400" />
            </div>
          ))}

          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-48 animate-pulse rounded-2xl bg-white/70" />
              ))
            : filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </div>

      <Modal open={open} title="Criar novo projeto" onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Input
            placeholder="Nome do projeto"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
          />
          <Button className="w-full" onClick={() => createProject.mutate()} disabled={!projectName || !companyId}>
            Salvar
          </Button>
        </div>
      </Modal>

      <Modal open={openFolder} title="Criar nova pasta" onClose={() => setOpenFolder(false)}>
        <div className="space-y-4">
          <Input
            placeholder="Nome da pasta"
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
          />
          <Button className="w-full" onClick={() => createFolder.mutate()} disabled={!folderName}>
            Salvar
          </Button>
        </div>
      </Modal>

      <Modal open={openCompany} title="Criar nova empresa" onClose={() => setOpenCompany(false)}>
        <div className="space-y-4">
          <Input
            placeholder="Nome da empresa"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
          />
          <Button className="w-full" onClick={() => createCompany.mutate()} disabled={!companyName}>
            Salvar
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
