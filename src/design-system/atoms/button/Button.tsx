import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styles from "./Button.module.css";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button({ children, className, ...props }: ButtonProps) {
  const baseClassName =
    `${styles.baseColors} rounded-full border px-4 py-2 text-sm font-semibold backdrop-blur-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50`;

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
