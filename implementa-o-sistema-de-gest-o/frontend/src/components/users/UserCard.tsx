import type { Membership } from "../../types";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

export const UserCard = ({ membership }: { membership: Membership }) => (
  <Card className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold text-slate-900">{membership.user.name}</div>
        <div className="text-sm text-slate-500">{membership.user.email}</div>
      </div>
      <Badge>{membership.role}</Badge>
    </div>
  </Card>
);
