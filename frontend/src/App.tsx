import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Building2 } from "lucide-react";
import { Toaster } from "sonner";
import { Sidebar } from "./components/layout/Sidebar";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";
import { Modal } from "./components/ui/Modal";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import { useCompanies } from "./hooks/useProjects";
import Dashboard from "./pages/Dashboard";
import ItemDetailPage from "./pages/ItemDetail";
import Login from "./pages/Login";
import ProjectView from "./pages/ProjectView";
import UserManagement from "./pages/UserManagement";
import { projectService } from "./services/projects";

const queryClient = new QueryClient();

const PrivateLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { data: companies = [] } = useCompanies();

  if (loading) {
    return <div className="min-h-screen animate-pulse bg-slate-100" />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const activeCompanyId = companies.find((company) =>
    location.pathname.includes(company.id),
  )?.id;

  const [openCompany, setOpenCompany] = useState(false);
  const [openFolder, setOpenFolder] = useState(false);
  const [openProject, setOpenProject] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");

  const createCompany = useMutation({
    mutationFn: () => {
      if (editingId) return projectService.updateCompany(editingId, { name });
      return projectService.createCompany({ name });
    },
    onSuccess: async () => {
      setOpenCompany(false);
      setName("");
      setEditingId(null);
      await queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  const createFolder = useMutation({
    mutationFn: () => {
      if (editingId) return projectService.updateFolder(editingId, { name });
      return projectService.createFolder({ name, companyId: activeCompanyId || "" });
    },
    onSuccess: async () => {
      setOpenFolder(false);
      setName("");
      setEditingId(null);
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  const createProject = useMutation({
    mutationFn: () => {
      if (editingId) return projectService.updateProject(editingId, { name });
      return projectService.createProject({ name, companyId: activeCompanyId || "" });
    },
    onSuccess: async () => {
      setOpenProject(false);
      setName("");
      setEditingId(null);
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const deleteCompany = useMutation({
    mutationFn: projectService.deleteCompany,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });

  const deleteFolder = useMutation({
    mutationFn: projectService.deleteFolder,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ["folders"] }),
  });

  const deleteProject = useMutation({
    mutationFn: projectService.deleteProject,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden ${isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setIsSidebarOpen(false)} />

      <div className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar
          companies={companies}
        activeCompanyId={activeCompanyId || companies[0]?.id}
        onEditFolder={(f) => {
          setName(f.name);
          setEditingId(f.id);
          setOpenFolder(true);
        }}
        onDeleteFolder={(id) => {
          if (confirm("Excluir esta pasta?")) deleteFolder.mutate(id);
        }}
        onEditProject={(p) => {
          setName(p.name);
          setEditingId(p.id);
          setOpenProject(true);
        }}
        onDeleteProject={(id) => {
          if (confirm("Excluir este projeto?")) deleteProject.mutate(id);
        }}
      />
      </div>

      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
          <button
            className="p-2 text-slate-600 hover:text-slate-900"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Building2 className="h-6 w-6" />
          </button>
          <span className="ml-2 font-semibold text-slate-900">Orbit Hub</span>
        </div>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>

      <Modal open={openFolder} title={editingId ? "Editar Pasta" : "Nova Pasta"} onClose={() => setOpenFolder(false)}>
        <div className="space-y-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da pasta" />
          <Button className="w-full" onClick={() => createFolder.mutate()} disabled={!name}>Salvar</Button>
        </div>
      </Modal>

      <Modal open={openProject} title={editingId ? "Editar Projeto" : "Novo Projeto"} onClose={() => setOpenProject(false)}>
        <div className="space-y-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do projeto" />
          <Button className="w-full" onClick={() => createProject.mutate()} disabled={!name}>Salvar</Button>
        </div>
      </Modal>
    </div>
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<PrivateLayout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/projects/:id" element={<ProjectView />} />
      <Route path="/items/:id" element={<ItemDetailPage />} />
      <Route path="/users/:id" element={<UserManagement />} />
    </Route>
  </Routes>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
        <Toaster richColors position="bottom-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
