"use client";

import type { PropsWithChildren } from "react";
import { Button } from "@/design-system/atoms/button/Button";

type ModalProps = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
}>;

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[82vh] w-[min(92vw,780px)] overflow-auto rounded-2xl bg-[var(--app-panel-strong)] p-4 text-[var(--app-fg)] shadow-2xl backdrop-blur-md">
        <Button onClick={onClose} className="mb-3">
          Fechar
        </Button>
        {children}
      </div>
    </div>
  );
}
