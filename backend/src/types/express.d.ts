import type { Membership } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        memberships?: Membership[];
      };
    }
  }
}

export {};
