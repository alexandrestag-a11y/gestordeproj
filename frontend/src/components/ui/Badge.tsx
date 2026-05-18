import clsx from "clsx";
import type { HTMLAttributes } from "react";

export const Badge = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={clsx(
      "inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700",
      className,
    )}
    {...props}
  />
);
