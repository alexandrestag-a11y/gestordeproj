import { Building2, LayoutDashboard, LogOut, Users } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import type { Company } from "../../types";
import { useAuth } from "../../contexts/AuthContext";

export const Sidebar = ({
  companies,
  activeCompanyId,
}: {
  companies: Company[];
  activeCompanyId?: string;
}) => {
  const { user, logout } = useAuth();

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
              <div className="mt-2 space-y-1 pl-7">
                {company.projects.slice(0, 4).map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="block text-sm text-slate-400 transition hover:text-white"
                  >
                    {project.name}
                  </Link>
                ))}
              </div>
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
