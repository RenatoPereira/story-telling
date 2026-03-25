"use client";

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
      className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Gerando audio..." : "Ouvir narracao"}
    </button>
  );
}
