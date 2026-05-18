import type { Item } from "../../types";
import { Card } from "../ui/Card";

export const ItemDetailCard = ({ item }: { item: Item }) => (
  <Card className="p-5">
    <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
    <p className="mt-2 text-sm text-slate-500">
      {item.children.length} subtarefas, {item.attachments.length} anexos e{" "}
      {item.lists.length} checklists.
    </p>
  </Card>
);
