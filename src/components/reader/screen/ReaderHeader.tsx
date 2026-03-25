"use client";

import Link from "next/link";
import {
  FiClock,
  FiPause,
  FiPlay,
  FiSettings,
  FiSkipBack,
  FiSkipForward,
  FiVolume2,
} from "react-icons/fi";

import { Button } from "@/design-system/atoms/button/Button";
import { styleConfig } from "@/lib/theme/styleConfig";
import styles from "./ReaderHeader.module.css";

type ReaderHeaderProps = {
  chapterTitle: string;
  autoplay: boolean;
  canGoPrevious: boolean;
  canContinue: boolean;
  canGoNext: boolean;
  isAudioLoading: boolean;
  onOpenHistory: () => void;
  onToggleAutoplay: () => void;
  onPrevious: () => void;
  onContinue: () => void;
  onNext: () => void;
  onSpeak: () => void;
};

export function ReaderHeader({
  chapterTitle,
  autoplay,
  canGoPrevious,
  canContinue,
  canGoNext,
  isAudioLoading,
  onOpenHistory,
  onToggleAutoplay,
  onPrevious,
  onContinue,
  onNext,
  onSpeak,
}: ReaderHeaderProps) {
  const buttonClassName =
    `${styles.headerButton} grid h-10 w-10 place-items-center rounded-full backdrop-blur-md transition disabled:cursor-not-allowed disabled:opacity-45 !p-0`;

  return (
    <header
      className={`${styles.headerGradient} relative z-20 min-h-24 w-full pt-2`}
    >
      <div
        className={`${styles.headerContainer} mx-auto grid w-full grid-cols-[1fr_auto_1fr] items-center px-[var(--safe-area-side)]`}
      >
        <div className="flex items-center gap-2">
          <Button
            onClick={onOpenHistory}
            className={buttonClassName}
            aria-label="Abrir historico"
            title="Historico"
          >
            <FiClock size={styleConfig.iconography.md} />
          </Button>
          <Link
            className={buttonClassName}
            href="/settings"
            aria-label="Abrir configuracoes"
            title="Configuracoes"
          >
            <FiSettings size={styleConfig.iconography.md} />
          </Link>
        </div>

        <h1 className={`${styles.chapterTitle} m-0 text-center`}>
          {chapterTitle}
        </h1>

        <div className="flex items-center justify-self-end gap-2">
          <Button
            onClick={onToggleAutoplay}
            className={buttonClassName}
            aria-label="Alternar autoplay"
            aria-pressed={autoplay}
            title={autoplay ? "Autoplay ligado" : "Autoplay desligado"}
          >
            {autoplay ? (
              <FiPause size={styleConfig.iconography.md} />
            ) : (
              <FiPlay size={styleConfig.iconography.md} />
            )}
          </Button>
          <Button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className={buttonClassName}
            aria-label="Bloco anterior"
            title="Bloco anterior"
          >
            <FiSkipBack size={styleConfig.iconography.md} />
          </Button>
          <Button
            onClick={onContinue}
            disabled={!canContinue}
            className={buttonClassName}
            aria-label="Continuar"
            title="Continuar"
          >
            <FiPlay size={styleConfig.iconography.md} />
          </Button>
          <Button
            onClick={onNext}
            disabled={!canGoNext}
            className={buttonClassName}
            aria-label="Proximo bloco"
            title="Proximo bloco"
          >
            <FiSkipForward size={styleConfig.iconography.md} />
          </Button>
          <Button
            onClick={onSpeak}
            disabled={isAudioLoading}
            className={buttonClassName}
            aria-label="Ouvir dialogo atual"
            title={isAudioLoading ? "Gerando audio" : "Ouvir dialogo atual"}
          >
            <FiVolume2 size={styleConfig.iconography.md} />
          </Button>
        </div>
      </div>
    </header>
  );
}
