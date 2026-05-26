import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const [projectName, setProjectName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const { data: companies = [] } = useCompanies();
  const { data: projects = [], isLoading } = useProjects(companyId || undefined);

  const filteredProjects = useMemo(
    () => projects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase())),
    [projects, search],
  );

  const createProject = useMutation({
    mutationFn: () => projectService.createProject({ name: projectName, companyId }),
    onSuccess: async () => {
      setOpen(false);
      setProjectName("");
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      await queryClient.invalidateQueries({ queryKey: ["companies"] });
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
            <CompanyFilter companies={companies} value={companyId} onChange={setCompanyId} />
            <Button className="bg-slate-200 text-slate-800 hover:bg-slate-300" onClick={() => setOpenCompany(true)}>
              Nova Empresa
            </Button>
          </div>
          <Button onClick={() => setOpen(true)} disabled={!companyId}>
            Novo Projeto
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-5">
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
