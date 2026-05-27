import { GripVertical, Paperclip, Pencil, SquareCheckBig, Trash2 } from "lucide-react";
import type { Item } from "../../types";

export const ItemRow = ({
  item,
  onOpen,
  onEdit,
  onDelete,
}: {
  item: Item;
  onOpen: (itemId: string) => void;
  onEdit?: (item: Item) => void;
  onDelete?: (id: string) => void;
}) => (
  <div className="group/item relative">
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

        {item.fieldValues && item.fieldValues.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.fieldValues.filter(fv => fv.value).map((fv) => (
              <div key={fv.id} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] text-slate-600 border border-slate-200">
                <span className="font-semibold">{fv.field.name}:</span> {fv.value}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </button>
    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/item:opacity-100 transition">
      <button
        className="p-1.5 bg-white/90 rounded-lg shadow-sm border border-slate-100 text-slate-400 hover:text-blue-600"
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(item);
        }}
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button
        className="p-1.5 bg-white/90 rounded-lg shadow-sm border border-slate-100 text-slate-400 hover:text-red-600"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(item.id);
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  </div>
);
