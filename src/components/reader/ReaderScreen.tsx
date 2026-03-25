"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AnimatedText } from "@/components/reader/AnimatedText";
import { BackgroundStage } from "@/components/reader/BackgroundStage";
import { DialogueCard } from "@/components/reader/DialogueCard";
import { ReaderHistoryModal } from "@/components/reader/history-modal/ReaderHistoryModal";
import { useReaderScreenController } from "@/components/reader/ReaderScreen.logic";
import { Button } from "@/design-system/atoms/button/Button";
import { useReaderSettings } from "@/lib/config/useReaderSettings";
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

  return (
    <div className="relative min-h-screen text-[var(--app-fg)]">
      <BackgroundStage
        src={controller.currentBackground}
        alt={controller.currentSceneTitle}
      />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1240px] flex-col px-4 pb-64 pt-4 md:px-8">
        <section className="mx-auto mt-2 w-full max-w-[1120px] rounded-md border border-[#c5ab7a]/40 bg-black/45 px-3 py-2 shadow-xl backdrop-blur-md md:px-5">
          <p className="mb-1 text-xs uppercase tracking-[0.16em] text-[#d8c7a2]">
            {storyBook.bookTitle}
          </p>
          <div className="flex items-center justify-between gap-3">
            <div className="min-h-8 flex-1">
              {isContextBlock ? (
                <AnimatedText
                  key={`${block.id}-top`}
                  text={block.text}
                  charsPerSecond={controller.effectiveCharsPerSecond}
                  className="m-0 text-center text-lg leading-relaxed text-[#f9f1dc] md:text-2xl"
                  onComplete={controller.onTypingComplete}
                />
              ) : (
                <p className="m-0 text-center text-base text-[#e9dcc1] md:text-xl">
                  {storyBook.bookTitle} - {controller.currentSceneTitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setHistoryOpen(true)} className="px-3 py-1.5 text-xs">
                History
              </Button>
              <Link
                className="rounded-full border border-white/15 bg-[var(--app-panel)] px-3 py-1.5 text-xs font-semibold text-[var(--app-fg)] backdrop-blur-md"
                href="/settings"
              >
                Settings
              </Link>
            </div>
          </div>
        </section>

        {isContextBlock ? (
          <section className="pointer-events-none mt-8 flex flex-1 items-center justify-center">
            <p className="rounded-md border border-[#c5ab7a]/25 bg-black/35 px-4 py-2 text-sm tracking-wide text-[#f3e6c8] backdrop-blur-sm">
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

        <section className="pointer-events-auto fixed inset-x-0 bottom-5 z-40 mx-auto flex w-[min(1120px,95vw)] items-center justify-between gap-3 rounded-xl border border-[#c5ab7a]/35 bg-black/55 px-3 py-2 shadow-2xl backdrop-blur-md">
          <Button onClick={() => controller.setAutoplay(!controller.autoplay)}>
            {controller.autoplay ? "Autoplay: ligado" : "Autoplay: desligado"}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              onClick={controller.previousBlock}
              disabled={!controller.canGoPrevious}
              className="px-3"
              aria-label="Bloco anterior"
            >
              ◀
            </Button>
            <Button
              onClick={controller.continueFlow}
              disabled={!controller.canContinue}
              className="px-3"
              aria-label="Continuar"
            >
              ▶
            </Button>
            <Button
              onClick={controller.nextBlock}
              disabled={!controller.canGoNext}
              className="px-3"
              aria-label="Proximo bloco"
            >
              ▶▶
            </Button>
            <Button onClick={speakCurrentContent} disabled={isAudioLoading}>
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
