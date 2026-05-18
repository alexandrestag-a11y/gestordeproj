import type { AuthPayload, User } from "../types";
import { api } from "./api";

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<AuthPayload>("/auth/login", { email, password });
    return data;
  },
  register: async (name: string, email: string, password: string) => {
    const { data } = await api.post<AuthPayload>("/auth/register", {
      name,
      email,
      password,
    });
    return data;
  },
  me: async () => {
    const { data } = await api.get<User & { memberships: unknown[] }>("/auth/me");
    return data;
  },
};
