export type Role = "admin" | "member" | "viewer";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

export type Membership = {
  id: string;
  role: Role;
  companyId: string;
  userId: string;
  user: User;
};

export type Company = {
  id: string;
  name: string;
  logoUrl?: string | null;
  createdAt: string;
  memberships: Membership[];
  projects: Project[];
};

export type ProjectSummary = {
  id: string;
  name: string;
  company?: Company;
};

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  color?: string | null;
  companyId: string;
  company?: Company;
  createdAt: string;
  subprojects: Subproject[];
  customFields?: CustomField[];
};

export type Subproject = {
  id: string;
  name: string;
  order: number;
  projectId: string;
  stages: Stage[];
  project?: Project;
};

export type Stage = {
  id: string;
  name: string;
  order: number;
  color?: string | null;
  subprojectId: string;
  items: Item[];
  subproject?: Subproject;
};

export type CustomField = {
  id: string;
  name: string;
  type: "text" | "number" | "date" | "select" | "checkbox" | "url";
  options?: string | null;
  projectId: string;
};

export type FieldValue = {
  id: string;
  fieldId: string;
  itemId: string;
  value?: string | null;
  field: CustomField;
};

export type Attachment = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number | null;
  mimeType?: string | null;
};

export type ListEntry = {
  id: string;
  text: string;
  done: boolean;
  order: number;
};

export type ItemList = {
  id: string;
  title: string;
  itemId: string;
  entries: ListEntry[];
};

export type TaskAssignment = {
  id: string;
  userId: string;
  itemId: string;
  user: User;
};

export type Item = {
  id: string;
  name: string;
  order: number;
  stageId: string;
  parentId?: string | null;
  children: Item[];
  fieldValues: FieldValue[];
  attachments: Attachment[];
  lists: ItemList[];
  assignments: TaskAssignment[];
  createdAt?: string;
  stage?: Stage & {
    subproject: Subproject & {
      project: Project & { customFields: CustomField[] };
    };
  };
};

export type AuthPayload = {
  token: string;
  user: User;
};
