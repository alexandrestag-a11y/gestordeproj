import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Sidebar } from "./components/layout/Sidebar";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import { useCompanies } from "./hooks/useProjects";
import Dashboard from "./pages/Dashboard";
import ItemDetailPage from "./pages/ItemDetail";
import Login from "./pages/Login";
import ProjectView from "./pages/ProjectView";
import UserManagement from "./pages/UserManagement";

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

  return (
    <div className="flex min-h-screen">
      <Sidebar companies={companies} activeCompanyId={activeCompanyId || companies[0]?.id} />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
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
