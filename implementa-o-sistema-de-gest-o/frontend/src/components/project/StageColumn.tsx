import { Plus } from "lucide-react";
import type { Item, Stage } from "../../types";
import { ItemRow } from "./ItemRow";

export const StageColumn = ({
  stage,
  onAddItem,
  onOpenItem,
}: {
  stage: Stage;
  onAddItem: (stageId: string) => void;
  onOpenItem: (itemId: string) => void;
}) => (
  <section className="flex w-80 shrink-0 flex-col rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: stage.color || "#94a3b8" }}
        />
        <h3 className="font-semibold text-slate-900">{stage.name}</h3>
      </div>
      <button
        className="rounded-full bg-white p-2 text-slate-500 hover:text-slate-900"
        onClick={() => onAddItem(stage.id)}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
    <div className="space-y-3">
      {stage.items.map((item: Item) => (
        <ItemRow key={item.id} item={item} onOpen={onOpenItem} />
      ))}
    </div>
  </section>
);
