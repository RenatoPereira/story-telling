"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FiClock,
  FiPause,
  FiPlay,
  FiSettings,
  FiSkipBack,
  FiSkipForward,
} from "react-icons/fi";

import { AnimatedText } from "@/components/reader/AnimatedText";
import { BackgroundStage } from "@/components/reader/BackgroundStage";
import { DialogueCard } from "@/components/reader/DialogueCard";
import { ReaderHistoryModal } from "@/components/reader/history-modal/ReaderHistoryModal";
import { useReaderScreenController } from "@/components/reader/ReaderScreen.logic";
import { Button } from "@/design-system/atoms/button/Button";
import { useReaderSettings } from "@/lib/config/useReaderSettings";
import { styleConfig } from "@/lib/theme/styleConfig";
import type { StoryBook } from "@/lib/story/types";

type ReaderScreenProps = {
  storyBook: StoryBook;
  initialBlockId?: string | null;
};

export function ReaderScreen({ storyBook, initialBlockId }: ReaderScreenProps) {
  const router = useRouter();
  const pathname = usePathname();
  const settings = useReaderSettings();

  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const controller = useReaderScreenController({
    storyBook,
    initialBlockId,
    settings,
  });
  const canContinue = controller.canContinue;
  const continueFlow = controller.continueFlow;
  const nextBlock = controller.nextBlock;
  const previousBlock = controller.previousBlock;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("blockId", controller.currentBlockId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [controller.currentBlockId, pathname, router]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement) {
        const tag = event.target.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea") {
          return;
        }
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextBlock();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousBlock();
      }

      if (event.key === " " && canContinue) {
        event.preventDefault();
        continueFlow();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canContinue, continueFlow, nextBlock, previousBlock]);

  async function speakCurrentContent() {
    setAudioError(null);
    setIsAudioLoading(true);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: controller.currentSpeechText,
          voice: controller.currentAudioVoice,
        }),
      });

      const payload = (await response.json()) as
        | { audioBase64: string; mimeType: string }
        | { error: string };

      if (!response.ok || "error" in payload) {
        throw new Error("Falha ao gerar audio.");
      }

      const audio = new Audio(
        `data:${payload.mimeType};base64,${payload.audioBase64}`,
      );
      await audio.play();
    } catch {
      setAudioError("Nao foi possivel tocar o audio agora.");
    } finally {
      setIsAudioLoading(false);
    }
  }

  const block = controller.currentBlock;
  const isContextBlock = block.type === "context";
  const iconSizeMd = styleConfig.iconography.md;
  const iconSizeLg = styleConfig.iconography.lg;

  return (
    <div className="relative min-h-screen text-[var(--app-fg)]">
      <BackgroundStage
        src={controller.currentBackground}
        alt={controller.currentSceneTitle}
      />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1240px] flex-col px-[var(--safe-area-side)] pb-32 pt-4">
        <header
          className="mx-auto mb-4 flex w-full max-w-[1120px] items-center justify-between rounded-md border border-[#c5ab7a]/40 bg-black/45 shadow-xl backdrop-blur-md"
          style={{
            height: styleConfig.layout.headerHeightPx,
            gap: styleConfig.layout.headerGapPx,
            paddingInline: styleConfig.layout.headerPaddingX,
          }}
        >
          <h1
            className="m-0 text-center text-[#f6e7c5]"
            style={{
              fontSize: styleConfig.typography.chapterTitle.fontSizePx,
              fontWeight: styleConfig.typography.chapterTitle.fontWeight,
              lineHeight: `${styleConfig.typography.chapterTitle.lineHeightPx}px`,
            }}
          >
            {controller.currentChapterTitle}
          </h1>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setHistoryOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 text-[14px] font-medium leading-5 uppercase"
            >
              <FiClock size={iconSizeMd} />
              Historico
            </Button>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[var(--app-panel)] px-3 py-2 text-[14px] font-medium leading-5 uppercase text-[var(--app-fg)] backdrop-blur-md"
              href="/settings"
            >
              <FiSettings size={iconSizeMd} />
              Config
            </Link>
          </div>
        </header>

        <section className="mx-auto w-full max-w-[1120px] rounded-md bg-black/45 shadow-xl backdrop-blur-md">
          <p className="mb-1 text-xs uppercase tracking-[0.16em] text-[#d8c7a2]">
            {storyBook.bookTitle}
          </p>
          <div
            className="px-5"
            style={{
              minHeight: styleConfig.layout.narratorBarMinHeightPx,
              paddingBlock: styleConfig.layout.narratorPaddingY,
              paddingInline: styleConfig.layout.narratorPaddingX,
            }}
          >
            <p
              className="m-0 text-[var(--app-accent)]"
              style={{
                fontSize: styleConfig.typography.narratorLabel.fontSizePx,
                fontWeight: styleConfig.typography.narratorLabel.fontWeight,
                lineHeight: `${styleConfig.typography.narratorLabel.lineHeightPx}px`,
              }}
            >
              Narrador:
            </p>
            {isContextBlock ? (
              <AnimatedText
                key={`${block.id}-top`}
                text={block.text}
                charsPerSecond={controller.effectiveCharsPerSecond}
                className="m-0 text-[#f9f1dc]"
                onComplete={controller.onTypingComplete}
                style={{
                  fontSize: styleConfig.typography.narratorText.fontSizePx,
                  fontWeight: styleConfig.typography.narratorText.fontWeight,
                  lineHeight: `${styleConfig.typography.narratorText.lineHeightPx}px`,
                }}
              />
            ) : (
              <p
                className="m-0 text-[#e9dcc1]"
                style={{
                  fontSize: styleConfig.typography.narratorText.fontSizePx,
                  fontWeight: styleConfig.typography.narratorText.fontWeight,
                  lineHeight: `${styleConfig.typography.narratorText.lineHeightPx}px`,
                }}
              >
                {controller.currentSceneTitle}
              </p>
            )}
          </div>
        </section>

        {isContextBlock ? (
          <section className="pointer-events-none mt-8 flex flex-1 items-center justify-center">
            <p className="rounded-md bg-black/35 px-4 py-2 text-sm tracking-wide text-[#f3e6c8] backdrop-blur-sm">
              {controller.currentSceneTitle}
            </p>
          </section>
        ) : (
          <DialogueCard
            block={block}
            charsPerSecond={controller.effectiveCharsPerSecond}
            onTypingComplete={controller.onTypingComplete}
          />
        )}

        <section
          className="pointer-events-auto fixed inset-x-0 bottom-0 z-40 mx-auto flex w-[min(1120px,95vw)] items-center justify-between rounded-t-xl bg-black/55 shadow-2xl backdrop-blur-md"
          style={{
            height: styleConfig.layout.bottomHeightPx,
            paddingBlock: styleConfig.layout.bottomPaddingY,
            paddingInline: styleConfig.layout.bottomPaddingX,
            gap: styleConfig.layout.bottomGapPx,
          }}
        >
          <Button
            onClick={() => controller.setAutoplay(!controller.autoplay)}
            className="inline-flex items-center gap-2 text-[14px] font-medium leading-5"
          >
            {controller.autoplay ? <FiPause size={iconSizeMd} /> : <FiPlay size={iconSizeMd} />}
            {controller.autoplay ? "Autoplay: ligado" : "Autoplay: desligado"}
          </Button>

          <div className="flex items-center gap-3">
            <Button
              onClick={controller.previousBlock}
              disabled={!controller.canGoPrevious}
              className="inline-flex items-center gap-2 px-3 text-[14px] font-medium leading-5"
              aria-label="Bloco anterior"
            >
              <FiSkipBack size={iconSizeLg} />
            </Button>
            <Button
              onClick={controller.continueFlow}
              disabled={!controller.canContinue}
              className="inline-flex items-center gap-2 px-3 text-[14px] font-medium leading-5"
              aria-label="Continuar"
            >
              <FiPlay size={iconSizeLg} />
              Continuar
            </Button>
            <Button
              onClick={controller.nextBlock}
              disabled={!controller.canGoNext}
              className="inline-flex items-center gap-2 px-3 text-[14px] font-medium leading-5"
              aria-label="Proximo bloco"
            >
              <FiSkipForward size={iconSizeLg} />
            </Button>
            <Button
              onClick={speakCurrentContent}
              disabled={isAudioLoading}
              className="text-[12px] font-medium leading-4"
            >
              {isAudioLoading ? "Audio..." : "Voice"}
            </Button>
          </div>
        </section>

        {controller.completionMessage ? <p className="sr-only">{controller.completionMessage}</p> : null}
        {audioError ? (
          <p className="sr-only">{audioError}</p>
        ) : null}
      </main>

      <ReaderHistoryModal
        open={historyOpen}
        entries={controller.historyEntries}
        onClose={() => setHistoryOpen(false)}
        onOpenBlock={(blockId) => {
          controller.jumpToBlockId(blockId);
          setHistoryOpen(false);
        }}
      />
    </div>
  );
}
