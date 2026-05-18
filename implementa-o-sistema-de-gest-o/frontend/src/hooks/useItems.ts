import { useQuery } from "@tanstack/react-query";
import { projectService } from "../services/projects";

export const useItem = (itemId?: string) =>
  useQuery({
    queryKey: ["item", itemId],
    queryFn: () => projectService.getItem(itemId!),
    enabled: Boolean(itemId),
  });
