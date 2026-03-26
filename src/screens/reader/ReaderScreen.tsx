"use client";

import { useState } from "react";
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
import {
  useAmbientSceneAudio,
  useReaderKeyboardNavigation,
  useReaderSpeech,
  useSyncBlockIdWithUrl,
} from "@/screens/reader/ReaderScreen.hooks";
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

  const [historyOpen, setHistoryOpen] = useState(false);

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

  useSyncBlockIdWithUrl(controller.currentBlockId, pathname, router.replace);

  useReaderKeyboardNavigation({
    canContinue,
    continueFlow,
    nextBlock,
    previousBlock,
  });

  const { ambientAudioError } = useAmbientSceneAudio({
    ambientTrack: controller.currentAmbientTrack,
    isSceneAudioEnabled: controller.isCurrentSceneAudioEnabled,
    ambientAudioEnabled: settings.ambientAudioEnabled,
    ambientAudioVolume: settings.ambientAudioVolume,
  });

  const { audioError, isAudioLoading, speakCurrentContent } = useReaderSpeech({
    speechText: controller.currentSpeechText,
    audioVoice: controller.currentAudioVoice,
  });

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
