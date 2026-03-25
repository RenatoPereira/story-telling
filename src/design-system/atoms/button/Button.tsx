import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button({ children, className, ...props }: ButtonProps) {
  const baseClassName =
    "rounded-full border border-white/15 bg-[var(--app-panel)] px-4 py-2 text-sm font-semibold text-[var(--app-fg)] backdrop-blur-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <button
      type="button"
      {...props}
      className={className ? `${baseClassName} ${className}` : baseClassName}
    >
      {children}
    </button>
  );
}
