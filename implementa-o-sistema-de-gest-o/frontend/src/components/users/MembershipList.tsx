import type { Membership } from "../../types";
import { UserCard } from "./UserCard";

export const MembershipList = ({ memberships }: { memberships: Membership[] }) => (
  <div className="space-y-3">
    {memberships.map((membership) => (
      <UserCard key={membership.id} membership={membership} />
    ))}
  </div>
);
