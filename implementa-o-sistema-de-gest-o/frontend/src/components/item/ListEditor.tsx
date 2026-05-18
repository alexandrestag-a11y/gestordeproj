import type { ItemList } from "../../types";
import { Input } from "../ui/Input";

export const ListEditor = ({
  lists,
  onToggle,
}: {
  lists: ItemList[];
  onToggle: (listId: string, entryId: string, nextDone: boolean) => void;
}) => (
  <div className="space-y-4">
    {lists.map((list) => (
      <div key={list.id} className="rounded-2xl border border-slate-200 p-4">
        <h4 className="mb-3 font-semibold text-slate-900">{list.title}</h4>
        <div className="space-y-2">
          {list.entries.map((entry) => (
            <label key={entry.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
              <input
                type="checkbox"
                checked={entry.done}
                onChange={(event) => onToggle(list.id, entry.id, event.target.checked)}
              />
              <Input className="border-0 bg-transparent px-0 py-0 focus:ring-0" value={entry.text} readOnly />
            </label>
          ))}
        </div>
      </div>
    ))}
  </div>
);
