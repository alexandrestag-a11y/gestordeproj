import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

export const Button = ({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={clsx(
      "rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60",
      className,
    )}
    {...props}
  />
);
