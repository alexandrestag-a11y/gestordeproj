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
  <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 px-4 py-4 md:px-8 md:py-6">
    <div>
      <h1 className="text-xl md:text-2xl font-semibold text-slate-950 truncate max-w-[250px] md:max-w-none">{title}</h1>
      {subtitle ? <p className="mt-1 text-xs md:text-sm text-slate-500 line-clamp-1 md:line-clamp-none">{subtitle}</p> : null}
    </div>
    {onSearch ? (
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          className="pl-9 w-full"
          placeholder="Buscar..."
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>
    ) : null}
  </header>
);
