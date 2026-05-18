import { Search } from "lucide-react";
import { Input } from "../ui/Input";

export const Header = ({
  title,
  subtitle,
  search,
  onSearch,
}: {
  title: string;
  subtitle?: string;
  search?: string;
  onSearch?: (value: string) => void;
}) => (
  <header className="flex items-center justify-between gap-6 border-b border-slate-200/80 px-8 py-6">
    <div>
      <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
    {onSearch ? (
      <div className="relative w-80">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          className="pl-9"
          placeholder="Buscar..."
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>
    ) : null}
  </header>
);
