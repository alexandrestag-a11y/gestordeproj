import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      toast.success("Autenticacao realizada com sucesso");
      navigate("/");
    } catch {
      toast.error("Nao foi possivel autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#1d4ed820,transparent_35%),linear-gradient(180deg,#f8fafc_0%,#e0f2fe_100%)] px-6">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6">
          <div className="text-sm uppercase tracking-[0.24em] text-blue-600">Orbit</div>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">
            Gestao multi-empresa sem perder contexto
          </h1>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          {mode === "register" ? (
            <Input
              placeholder="Nome"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
          ) : null}
          <Input
            placeholder="E-mail"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <Input
            placeholder="Senha"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          <Button className="w-full py-3" disabled={loading}>
            {loading ? "Entrando..." : mode === "login" ? "Entrar" : "Criar conta"}
          </Button>
        </form>
        <button
          className="mt-4 text-sm text-slate-500"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Criar uma conta" : "Ja tenho conta"}
        </button>
      </Card>
    </div>
  );
}
