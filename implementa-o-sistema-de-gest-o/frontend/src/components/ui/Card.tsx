import clsx from "clsx";
import type { HTMLAttributes } from "react";

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx(
      "rounded-2xl border border-white/70 bg-white/95 shadow-panel backdrop-blur",
      className,
    )}
    {...props}
  />
);
