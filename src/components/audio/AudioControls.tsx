"use client";

import styles from "./AudioControls.module.css";

type AudioControlsProps = {
  disabled?: boolean;
  loading?: boolean;
  onSpeak: () => void;
};

export function AudioControls({
  disabled = false,
  loading = false,
  onSpeak,
}: AudioControlsProps) {
  return (
    <button
      type="button"
      onClick={onSpeak}
      disabled={disabled || loading}
      className={`${styles.button} rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {loading ? "Gerando audio..." : "Ouvir narracao"}
    </button>
  );
}
