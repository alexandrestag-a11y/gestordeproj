import { useParams } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { PageWrapper } from "../components/layout/PageWrapper";
import { MembershipList } from "../components/users/MembershipList";
import { Card } from "../components/ui/Card";
import { useQuery } from "@tanstack/react-query";
import { projectService } from "../services/projects";
import { Badge } from "../components/ui/Badge";
import type { Membership } from "../types";

export default function UserManagement() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["user-projects", id],
    queryFn: () => projectService.getUserProjects(id!),
    enabled: Boolean(id),
  });

  return (
    <PageWrapper>
      <Header title={data?.user?.name || "Usuario"} subtitle={data?.user?.email} />
      <div className="grid grid-cols-[0.9fr_1.1fr] gap-6 p-8">
        <Card className="p-5">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Empresas e memberships</h3>
          <MembershipList memberships={(data?.memberships || []) as Membership[]} />
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Projetos vinculados</h3>
          <div className="space-y-3">
            {data?.projects?.map((project: { id: string; name: string; company: { name: string } }) => (
              <div key={project.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                <div>
                  <div className="font-medium text-slate-900">{project.name}</div>
                  <div className="text-sm text-slate-500">{project.company.name}</div>
                </div>
                <Badge>Projeto</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
