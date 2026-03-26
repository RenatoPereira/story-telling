"use client";

import type { PropsWithChildren } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Modal.module.css";

type ModalProps = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
}>;

export function Modal({ open, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={`${styles.overlay} fixed inset-0 z-[90] overflow-y-auto`}
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.main
            className={styles.content}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {children}
          </motion.main>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
