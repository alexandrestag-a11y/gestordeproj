import clsx from "clsx";
import type { Subproject } from "../../types";
import { Button } from "../ui/Button";

export const SubprojectPanel = ({
  subprojects,
  activeId,
  onSelect,
  onCreate,
}: {
  subprojects: Subproject[];
  activeId?: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
}) => (
  <aside className="w-80 border-r border-slate-200 bg-white/80 p-5">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
        Subprojetos
      </h2>
      <Button className="px-3 py-1.5 text-xs" onClick={onCreate}>
        Novo
      </Button>
    </div>
    <div className="space-y-2">
      {subprojects.map((subproject) => (
        <button
          key={subproject.id}
          className={clsx(
            "w-full rounded-2xl px-4 py-3 text-left transition",
            activeId === subproject.id
              ? "bg-slate-900 text-white"
              : "bg-slate-50 text-slate-700 hover:bg-slate-100",
          )}
          onClick={() => onSelect(subproject.id)}
        >
          <div className="text-sm font-medium">{subproject.name}</div>
          <div className="mt-1 text-xs opacity-70">{subproject.stages.length} etapas</div>
        </button>
      ))}
    </div>
  </aside>
);
