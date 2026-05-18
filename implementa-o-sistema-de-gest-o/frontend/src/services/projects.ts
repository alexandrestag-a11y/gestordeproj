import type { Company, CustomField, Item, Project, Subproject } from "../types";
import { api } from "./api";

export const projectService = {
  getCompanies: async () => {
    const { data } = await api.get<Company[]>("/companies");
    return data;
  },
  createCompany: async (payload: { name: string; logoUrl?: string }) => {
    const { data } = await api.post<Company>("/companies", payload);
    return data;
  },
  getProjects: async (companyId?: string) => {
    const { data } = await api.get<Project[]>("/projects", {
      params: companyId ? { companyId } : undefined,
    });
    return data;
  },
  createProject: async (payload: Partial<Project> & { companyId: string; name: string }) => {
    const { data } = await api.post<Project>("/projects", payload);
    return data;
  },
  updateProject: async (id: string, payload: Partial<Project>) => {
    const { data } = await api.put<Project>(`/projects/${id}`, payload);
    return data;
  },
  getSubprojects: async (projectId: string) => {
    const { data } = await api.get<Subproject[]>(`/projects/${projectId}/subprojects`);
    return data;
  },
  createSubproject: async (projectId: string, payload: { name: string }) => {
    const { data } = await api.post<Subproject>(`/projects/${projectId}/subprojects`, payload);
    return data;
  },
  createStage: async (subprojectId: string, payload: { name: string; color?: string }) => {
    const { data } = await api.post(`/subprojects/${subprojectId}/stages`, payload);
    return data;
  },
  updateStage: async (stageId: string, payload: { name?: string; color?: string }) => {
    const { data } = await api.put(`/stages/${stageId}`, payload);
    return data;
  },
  createItem: async (stageId: string, payload: { name: string; parentId?: string | null }) => {
    const { data } = await api.post<Item>(`/stages/${stageId}/items`, payload);
    return data;
  },
  createChildItem: async (itemId: string, payload: { name: string }) => {
    const { data } = await api.post<Item>(`/items/${itemId}/children`, payload);
    return data;
  },
  updateItem: async (itemId: string, payload: Partial<Item>) => {
    const { data } = await api.put<Item>(`/items/${itemId}`, payload);
    return data;
  },
  moveItem: async (
    itemId: string,
    payload: { stageId: string; order: number; parentId?: string | null },
  ) => {
    const { data } = await api.patch<Item>(`/items/${itemId}/move`, payload);
    return data;
  },
  reorderItem: async (itemId: string, payload: { order: number; parentId?: string | null }) => {
    const { data } = await api.patch<Item>(`/items/${itemId}/reorder`, payload);
    return data;
  },
  getItem: async (itemId: string) => {
    const { data } = await api.get<Item>(`/items/${itemId}`);
    return data;
  },
  getFields: async (projectId: string) => {
    const { data } = await api.get<CustomField[]>(`/projects/${projectId}/fields`);
    return data;
  },
  createField: async (
    projectId: string,
    payload: { name: string; type: string; options?: string[] },
  ) => {
    const { data } = await api.post<CustomField>(`/projects/${projectId}/fields`, payload);
    return data;
  },
  updateField: async (
    fieldId: string,
    payload: { name?: string; type?: string; options?: string[] },
  ) => {
    const { data } = await api.put<CustomField>(`/fields/${fieldId}`, payload);
    return data;
  },
  deleteField: async (fieldId: string) => {
    await api.delete(`/fields/${fieldId}`);
  },
  saveFieldValue: async (itemId: string, payload: { fieldId: string; value: string }) => {
    const { data } = await api.post(`/items/${itemId}/field-values`, payload);
    return data;
  },
  createList: async (
    itemId: string,
    payload: { title: string; entries: { text: string; done?: boolean; order?: number }[] },
  ) => {
    const { data } = await api.post(`/items/${itemId}/lists`, payload);
    return data;
  },
  updateList: async (
    listId: string,
    payload: { title: string; entries: { id?: string; text: string; done?: boolean; order?: number }[] },
  ) => {
    const { data } = await api.put(`/lists/${listId}`, payload);
    return data;
  },
  uploadAttachment: async (itemId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post(`/items/${itemId}/attachments`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  deleteAttachment: async (attachmentId: string) => {
    await api.delete(`/attachments/${attachmentId}`);
  },
  getUserProjects: async (userId: string) => {
    const { data } = await api.get(`/users/${userId}/projects`);
    return data;
  },
  getMembers: async (companyId: string) => {
    const { data } = await api.get(`/companies/${companyId}/members`);
    return data;
  },
  addMember: async (companyId: string, payload: { email: string; role: string; name?: string }) => {
    const { data } = await api.post(`/companies/${companyId}/members`, payload);
    return data;
  },
};
