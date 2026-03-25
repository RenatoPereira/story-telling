"use client";

import type { PropsWithChildren } from "react";
import { Button } from "@/design-system/atoms/button/Button";
import styles from "./Modal.module.css";

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
      className={`${styles.overlay} fixed inset-0 z-[90] flex items-center justify-center p-6`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`${styles.panel} max-h-[82vh] w-[min(92vw,780px)] overflow-auto rounded-2xl p-4 shadow-2xl backdrop-blur-md`}
      >
        <Button onClick={onClose} className="mb-3">
          Fechar
        </Button>
        {children}
      </div>
    </div>
  );
}
