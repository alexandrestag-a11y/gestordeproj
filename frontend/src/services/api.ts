import axios from "axios";

// @ts-ignore
const baseURL = (import.meta as any).env.VITE_API_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pm_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
