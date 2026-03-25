"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { BackgroundStage } from "@/components/reader/BackgroundStage";
import { DialogueCard } from "@/components/reader/DialogueCard";
import { ReaderHistoryModal } from "@/components/reader/history-modal/ReaderHistoryModal";
import { ReaderContextPanel } from "@/components/reader/screen/ReaderContextPanel";
import { ReaderHeader } from "@/components/reader/screen/ReaderHeader";
import type { StoryBook } from "@/lib/story/types";
import {
  updateReaderSettings,
  useReaderSettings,
} from "@/stores/reader-settings";
import { useReaderScreenController } from "@/screens/reader/ReaderScreen.logic";
import styles from "./ReaderScreen.module.css";

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
  const [ambientAudioError, setAmbientAudioError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  const controller = useReaderScreenController({
    storyBook,
    initialBlockId,
    settings,
    onAutoplayChange: (value) => updateReaderSettings({ autoplay: value }),
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

  useEffect(() => {
    const ambientAudio = new Audio();
    ambientAudio.loop = true;
    ambientAudio.preload = "auto";
    ambientAudioRef.current = ambientAudio;

    return () => {
      ambientAudio.pause();
      ambientAudio.removeAttribute("src");
      ambientAudio.load();
      ambientAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const ambientAudio = ambientAudioRef.current;
    if (!ambientAudio) {
      return;
    }

    const canPlayAmbientAudio =
      settings.ambientAudioEnabled &&
      controller.isCurrentSceneAudioEnabled &&
      controller.currentAmbientTrack.length > 0;

    ambientAudio.volume = settings.ambientAudioVolume;

    if (!canPlayAmbientAudio) {
      ambientAudio.pause();
      setAmbientAudioError(null);
      return;
    }

    const nextTrackUrl = new URL(
      controller.currentAmbientTrack,
      window.location.origin,
    ).href;
    const didTrackChange = ambientAudio.src !== nextTrackUrl;

    if (didTrackChange) {
      ambientAudio.src = nextTrackUrl;
      ambientAudio.currentTime = 0;
    }

    const playPromise = ambientAudio.play();
    if (playPromise) {
      playPromise
        .then(() => {
          setAmbientAudioError(null);
        })
        .catch(() => {
          setAmbientAudioError(
            "A musica ambiente foi bloqueada. Permita audio no navegador para reproduzir.",
          );
        });
    }
  }, [
    controller.currentAmbientTrack,
    controller.isCurrentSceneAudioEnabled,
    settings.ambientAudioEnabled,
    settings.ambientAudioVolume,
  ]);

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
    <div className={`${styles.root} relative min-h-screen`}>
      <BackgroundStage
        src={controller.currentBackground}
        alt={controller.currentSceneTitle}
      />

      <ReaderHeader
        chapterTitle={controller.currentChapterTitle}
        autoplay={controller.autoplay}
        canGoPrevious={controller.canGoPrevious}
        canContinue={controller.canContinue}
        canGoNext={controller.canGoNext}
        isAudioLoading={isAudioLoading}
        onOpenHistory={() => setHistoryOpen(true)}
        onToggleAutoplay={() => controller.setAutoplay(!controller.autoplay)}
        onPrevious={controller.previousBlock}
        onContinue={controller.continueFlow}
        onNext={controller.nextBlock}
        onSpeak={speakCurrentContent}
      />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] w-full max-w-[1240px] flex-col px-[var(--safe-area-side)] pb-32">
        {isContextBlock ? (
          <ReaderContextPanel
            blockId={block.id}
            text={block.text}
            charsPerSecond={controller.effectiveCharsPerSecond}
            onTypingComplete={controller.onTypingComplete}
          />
        ) : (
          <DialogueCard
            block={block}
            characters={storyBook.characters}
            charsPerSecond={controller.effectiveCharsPerSecond}
            onTypingComplete={controller.onTypingComplete}
          />
        )}

        {controller.completionMessage ? <p className="sr-only">{controller.completionMessage}</p> : null}
        <p className="sr-only">{storyBook.bookTitle}</p>
        {audioError ? (
          <p className="sr-only">{audioError}</p>
        ) : null}
        {ambientAudioError ? (
          <p className="sr-only">{ambientAudioError}</p>
        ) : null}
      </main>

      <ReaderHistoryModal
        open={historyOpen}
        characters={storyBook.characters}
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
