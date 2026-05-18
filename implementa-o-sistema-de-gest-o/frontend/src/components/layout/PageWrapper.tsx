import type { ReactNode } from "react";

export const PageWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex-1 overflow-auto">{children}</div>
);
