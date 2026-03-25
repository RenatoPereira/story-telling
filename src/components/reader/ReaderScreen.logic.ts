"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  findBlockPositionById,
  getBookScenes,
  getCurrentBlock,
  type PlaybackStatus,
} from "@/lib/story/readerEngine";
import type { ReaderSettings } from "@/lib/config/readerSettings";
import type { StoryBlock, StoryBook } from "@/lib/story/types";

type ReaderController = {
  currentSceneIndex: number;
  currentBlockIndex: number;
  currentBlockId: string;
  currentBlock: StoryBlock;
  currentSceneTitle: string;
  currentBackground: string;
  currentAudioVoice: string;
  currentSpeechText: string;
  effectiveCharsPerSecond: number;
  onTypingComplete: () => void;
  autoplay: boolean;
  playbackStatus: PlaybackStatus;
  canContinue: boolean;
  canGoPrevious: boolean;
  canGoNext: boolean;
  historyEntries: Array<{
    blockId: string;
    sceneTitle: string;
    block: StoryBlock;
  }>;
  completionMessage: string | null;
  setAutoplay: (value: boolean) => void;
  continueFlow: () => void;
  nextBlock: () => void;
  previousBlock: () => void;
  jumpToBlockId: (blockId: string) => void;
};

type ReaderControllerParams = {
  storyBook: StoryBook;
  initialBlockId?: string | null;
  settings: ReaderSettings;
};

export function useReaderScreenController({
  storyBook,
  initialBlockId,
  settings,
}: ReaderControllerParams): ReaderController {
  const timeline = useMemo(
    () =>
      getBookScenes(storyBook).flatMap((scene, sceneIndex) =>
        scene.blocks.map((_, blockIndex) => ({
          sceneIndex,
          blockIndex,
        })),
      ),
    [storyBook],
  );
  const flatScenes = useMemo(() => getBookScenes(storyBook), [storyBook]);

  const initialPosition = useMemo(
    () => findBlockPositionById(storyBook, initialBlockId) ?? timeline[0],
    [initialBlockId, storyBook, timeline],
  );
  const initialTimelineIndex = useMemo(
    () =>
      Math.max(
        0,
        timeline.findIndex(
          (entry) =>
            entry.sceneIndex === initialPosition.sceneIndex &&
            entry.blockIndex === initialPosition.blockIndex,
        ),
      ),
    [initialPosition.blockIndex, initialPosition.sceneIndex, timeline],
  );

  const [currentTimelineIndex, setCurrentTimelineIndex] =
    useState(initialTimelineIndex);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>("playing");
  const [autoplay, setAutoplayState] = useState(settings.autoplay);
  const [typingDone, setTypingDone] = useState(false);
  const [historyIndexes, setHistoryIndexes] = useState<number[]>([
    initialTimelineIndex,
  ]);
  const blockStartedAtRef = useRef(0);

  const currentPosition = timeline[currentTimelineIndex];
  const currentScene = flatScenes[currentPosition.sceneIndex];
  const currentBlock = getCurrentBlock(currentScene, currentPosition.blockIndex);

  useEffect(() => {
    blockStartedAtRef.current = Date.now();
  }, [currentTimelineIndex]);

  if (!currentBlock) {
    throw new Error("Nao foi possivel resolver o bloco atual da timeline.");
  }

  const effectiveCharsPerSecond = Math.max(
    1,
    Math.round(currentBlock.charsPerSecond * settings.textSpeedMultiplier),
  );
  const blockDelayMultiplier =
    currentBlock.type === "dialogue"
      ? settings.dialogueDelayMultiplier
      : settings.contextDelayMultiplier;
  const effectiveMinDurationMs = Math.max(
    120,
    Math.round(currentBlock.minDurationMs * blockDelayMultiplier),
  );

  const canContinue = playbackStatus === "waiting_continue";
  const canGoPrevious = currentTimelineIndex > 0;
  const canGoNext = currentTimelineIndex < timeline.length - 1;

  const goToTimelineIndex = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0) {
        return;
      }

      if (nextIndex >= timeline.length) {
        setPlaybackStatus("completed");
        return;
      }

      setCurrentTimelineIndex(nextIndex);
      setTypingDone(false);
      setPlaybackStatus("playing");
      setHistoryIndexes((current) =>
        current.includes(nextIndex) ? current : [...current, nextIndex],
      );
    },
    [timeline.length],
  );

  const nextBlock = useCallback(() => {
    goToTimelineIndex(currentTimelineIndex + 1);
  }, [currentTimelineIndex, goToTimelineIndex]);

  const previousBlock = useCallback(() => {
    goToTimelineIndex(currentTimelineIndex - 1);
  }, [currentTimelineIndex, goToTimelineIndex]);

  const continueFlow = useCallback(() => {
    if (!canContinue) {
      return;
    }
    nextBlock();
  }, [canContinue, nextBlock]);

  const jumpToBlockId = useCallback(
    (blockId: string) => {
      const position = findBlockPositionById(storyBook, blockId);
      if (!position) {
        return;
      }
      const index = timeline.findIndex(
        (entry) =>
          entry.sceneIndex === position.sceneIndex &&
          entry.blockIndex === position.blockIndex,
      );
      if (index >= 0) {
        goToTimelineIndex(index);
      }
    },
    [goToTimelineIndex, storyBook, timeline],
  );

  const onTypingComplete = useCallback(() => {
    setTypingDone(true);
  }, []);

  useEffect(() => {
    if (!typingDone || playbackStatus !== "playing") {
      return;
    }

    const elapsedMs = Date.now() - blockStartedAtRef.current;
    const remainingMs = Math.max(effectiveMinDurationMs - elapsedMs, 0);

    const timeoutId = window.setTimeout(() => {
      if (autoplay) {
        nextBlock();
        return;
      }
      setPlaybackStatus("waiting_continue");
    }, remainingMs);

    return () => window.clearTimeout(timeoutId);
  }, [autoplay, effectiveMinDurationMs, nextBlock, playbackStatus, typingDone]);

  const completionMessage = useMemo(() => {
    if (playbackStatus === "completed") {
      return "Leitura da timeline concluida.";
    }
    if (playbackStatus === "waiting_continue") {
      return "Concluido - pronto para proximo.";
    }
    return null;
  }, [playbackStatus]);

  const setAutoplay = useCallback(
    (value: boolean) => {
      setAutoplayState(value);
      if (value && playbackStatus === "waiting_continue") {
        nextBlock();
      }
    },
    [nextBlock, playbackStatus],
  );

  const historyEntries = useMemo(
    () =>
      historyIndexes.map((timelineIndex) => {
        const position = timeline[timelineIndex];
        const scene = flatScenes[position.sceneIndex];
        const block = scene.blocks[position.blockIndex];
        return {
          blockId: block.id,
          sceneTitle: scene.title,
          block,
        };
      }),
    [flatScenes, historyIndexes, timeline],
  );

  return {
    currentSceneIndex: currentPosition.sceneIndex,
    currentBlockIndex: currentPosition.blockIndex,
    currentBlockId: currentBlock.id,
    currentBlock,
    currentSceneTitle: currentScene.title,
    currentBackground: currentScene.backgroundImage,
    currentAudioVoice: currentScene.audio.defaultVoice,
    currentSpeechText:
      currentBlock.type === "dialogue"
        ? `${currentBlock.speaker.characterName}: ${currentBlock.text}`
        : currentBlock.text,
    effectiveCharsPerSecond,
    onTypingComplete,
    autoplay,
    playbackStatus,
    canContinue,
    canGoPrevious,
    canGoNext,
    historyEntries,
    completionMessage,
    setAutoplay,
    continueFlow,
    nextBlock,
    previousBlock,
    jumpToBlockId,
  };
}
