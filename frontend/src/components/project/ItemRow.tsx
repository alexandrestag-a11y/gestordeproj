import { GripVertical, Paperclip, SquareCheckBig } from "lucide-react";
import type { Item } from "../../types";

export const ItemRow = ({
  item,
  onOpen,
}: {
  item: Item;
  onOpen: (itemId: string) => void;
}) => (
  <button
    className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-blue-200"
    onClick={() => onOpen(item.id)}
  >
    <div className="flex items-start gap-3">
      <GripVertical className="mt-0.5 h-4 w-4 text-slate-300" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-slate-900">{item.name}</div>
        <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <SquareCheckBig className="h-3.5 w-3.5" />
            {item.lists.length}
          </span>
          <span className="inline-flex items-center gap-1">
            <Paperclip className="h-3.5 w-3.5" />
            {item.attachments.length}
          </span>
          <span>{item.children.length} subtarefas</span>
        </div>
      </div>
    </div>
  </button>
);
