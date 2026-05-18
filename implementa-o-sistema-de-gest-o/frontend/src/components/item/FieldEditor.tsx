import type { CustomField, FieldValue } from "../../types";
import { Input } from "../ui/Input";

export const FieldEditor = ({
  field,
  value,
  onChange,
}: {
  field: CustomField;
  value?: FieldValue;
  onChange: (nextValue: string) => void;
}) => {
  const parsedOptions = field.options ? JSON.parse(field.options) as string[] : [];

  if (field.type === "select") {
    return (
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-600">{field.name}</span>
        <select
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          value={value?.value || ""}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Selecione</option>
          {parsedOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-600">{field.name}</span>
      <Input
        type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
        value={value?.value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
};
