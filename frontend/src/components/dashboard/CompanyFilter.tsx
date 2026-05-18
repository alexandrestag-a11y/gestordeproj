import type { Company } from "../../types";

export const CompanyFilter = ({
  companies,
  value,
  onChange,
}: {
  companies: Company[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <select
    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
    value={value}
    onChange={(event) => onChange(event.target.value)}
  >
    <option value="">Todas as empresas</option>
    {companies.map((company) => (
      <option key={company.id} value={company.id}>
        {company.name}
      </option>
    ))}
  </select>
);
