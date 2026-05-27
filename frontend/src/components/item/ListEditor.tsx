import { Pencil, Trash2 } from "lucide-react";
import type { ItemList } from "../../types";
import { Input } from "../ui/Input";

export const ListEditor = ({
  lists,
  onToggle,
  onEditEntry,
  onDeleteEntry,
}: {
  lists: ItemList[];
  onToggle: (listId: string, entryId: string, nextDone: boolean) => void;
  onEditEntry?: (listId: string, entryId: string, text: string) => void;
  onDeleteEntry?: (listId: string, entryId: string) => void;
}) => (
  <div className="space-y-4">
    {lists.map((list) => (
      <div key={list.id} className="rounded-2xl border border-slate-200 p-4">
        <h4 className="mb-3 font-semibold text-slate-900">{list.title}</h4>
        <div className="space-y-2">
          {list.entries.map((entry) => (
            <div key={entry.id} className="group/entry flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 transition hover:bg-slate-100/80">
              <input
                type="checkbox"
                checked={entry.done}
                onChange={(event) => onToggle(list.id, entry.id, event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <Input
                className="flex-1 border-0 bg-transparent px-0 py-0 text-sm focus:ring-0"
                value={entry.text}
                onChange={(e) => onEditEntry?.(list.id, entry.id, e.target.value)}
                readOnly={!onEditEntry}
              />
              <button
                className="opacity-0 group-hover/entry:opacity-100 p-1 text-slate-400 hover:text-red-600 transition"
                onClick={() => onDeleteEntry?.(list.id, entry.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
