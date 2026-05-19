import type { Membership } from "@prisma/client";
import { HttpError } from "../utils/errors";

const roleRank: Record<string, number> = {
  viewer: 1,
  member: 2,
  admin: 3,
};

export const getMembership = (
  memberships: Membership[] | undefined,
  companyId: string,
) => memberships?.find((membership) => membership.companyId === companyId);

export const ensureCompanyRole = (
  memberships: Membership[] | undefined,
  companyId: string,
  minimumRole: "viewer" | "member" | "admin" = "viewer",
) => {
  const membership = getMembership(memberships, companyId);

  if (!membership) {
    throw new HttpError(403, "Access denied for this company");
  }

  if (roleRank[membership.role] < roleRank[minimumRole]) {
    throw new HttpError(403, "Insufficient permissions");
  }

  return membership;
};
