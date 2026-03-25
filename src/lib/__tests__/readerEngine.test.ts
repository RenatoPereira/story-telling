import { describe, expect, it } from "vitest";

import {
  buildSceneSpeechText,
  clampBlockIndex,
  clampSceneIndex,
  getCurrentBlock,
  resolveNextStatus,
} from "@/lib/story/readerEngine";
import type { StoryCharacters, StoryScene } from "@/lib/story/types";

const charactersFixture: StoryCharacters = {
  kvothe: {
    name: "Kvothe",
    defaultPortraitImage: "/assets/characters/kvothe-neutral.svg",
    portraits: {
      neutral: "/assets/characters/kvothe-neutral.svg",
    },
  },
};

const sceneFixture: StoryScene = {
  id: "scene-test",
  title: "Cena teste",
  backgroundImage: "/assets/backgrounds/test.svg",
  audio: {
    enabled: true,
    defaultVoice: "alloy",
    ambientTrack: "/assets/audio/scene-test.mp3",
  },
  blocks: [
    {
      id: "context-1",
      type: "context",
      text: "Narracao inicial.",
      minDurationMs: 1000,
      charsPerSecond: 30,
    },
    {
      id: "dialogue-1",
      type: "dialogue",
      text: "Primeira fala",
      minDurationMs: 900,
      charsPerSecond: 34,
      speaker: {
        characterId: "kvothe",
        side: "left",
        imageKey: "neutral",
      },
      voiceProfile: { provider: "openai", voice: "alloy" },
    },
  ],
};

describe("readerEngine", () => {
  it("clamps scene index inside bounds", () => {
    expect(clampSceneIndex(-2, 3)).toBe(0);
    expect(clampSceneIndex(2, 3)).toBe(2);
    expect(clampSceneIndex(8, 3)).toBe(2);
  });

  it("clamps block index and resolves current block", () => {
    expect(clampBlockIndex(-5, 2)).toBe(0);
    expect(clampBlockIndex(8, 2)).toBe(1);
    expect(getCurrentBlock(sceneFixture, 1)?.type).toBe("dialogue");
    expect(getCurrentBlock(sceneFixture, 9)).toBeNull();
  });

  it("builds speech text with context and dialogue blocks", () => {
    const speech = buildSceneSpeechText(sceneFixture, charactersFixture);
    expect(speech).toContain("Narracao inicial.");
    expect(speech).toContain("Kvothe: Primeira fala");
  });

  it("resolves next status for autoplay and completion", () => {
    expect(resolveNextStatus({ autoplay: true, isLastBlock: false })).toBe(
      "playing",
    );
    expect(resolveNextStatus({ autoplay: false, isLastBlock: false })).toBe(
      "waiting_continue",
    );
    expect(resolveNextStatus({ autoplay: true, isLastBlock: true })).toBe(
      "completed",
    );
  });
});
