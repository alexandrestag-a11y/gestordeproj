import { useQuery } from "@tanstack/react-query";
import { projectService } from "../services/projects";

export const useCompanies = () =>
  useQuery({
    queryKey: ["companies"],
    queryFn: projectService.getCompanies,
  });

export const useProjects = (companyId?: string) =>
  useQuery({
    queryKey: ["projects", companyId],
    queryFn: () => projectService.getProjects(companyId),
  });

export const useSubprojects = (projectId?: string) =>
  useQuery({
    queryKey: ["subprojects", projectId],
    queryFn: () => projectService.getSubprojects(projectId!),
    enabled: Boolean(projectId),
  });
