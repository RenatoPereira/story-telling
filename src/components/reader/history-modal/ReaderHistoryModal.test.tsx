import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import type { HTMLAttributes, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { StoryCharacters } from "@/lib/story/types";
import {
  ReaderHistoryModal,
  type ReaderHistoryEntry,
} from "@/components/reader/history-modal/ReaderHistoryModal";

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
  motion: {
    div: (props: HTMLAttributes<HTMLDivElement>) => <div {...props} />,
    main: (props: HTMLAttributes<HTMLElement>) => <main {...props} />,
  },
}));

type ObserverRecord = {
  callback: IntersectionObserverCallback;
};

const observerRecords: ObserverRecord[] = [];

const characters: StoryCharacters = {
  kvothe: {
    name: "Kvothe",
    defaultPortraitImage: "/assets/characters/kvothe-neutral.svg",
    portraits: { neutral: "/assets/characters/kvothe-neutral.svg" },
  },
};

const entries: ReaderHistoryEntry[] = [
  {
    blockId: "block-1",
    chapterTitle: "Capitulo 1",
    sceneTitle: "Cena 1",
    block: {
      id: "block-1",
      type: "dialogue",
      text: "Texto 1",
      minDurationMs: 100,
      charsPerSecond: 60,
      speaker: { characterId: "kvothe", side: "left", imageKey: "neutral" },
    },
  },
  {
    blockId: "block-2",
    chapterTitle: "Capitulo 1",
    sceneTitle: "Cena 2",
    block: {
      id: "block-2",
      type: "dialogue",
      text: "Texto 2",
      minDurationMs: 100,
      charsPerSecond: 60,
      speaker: { characterId: "kvothe", side: "left", imageKey: "neutral" },
    },
  },
  {
    blockId: "block-3",
    chapterTitle: "Capitulo 1",
    sceneTitle: "Cena 3",
    block: {
      id: "block-3",
      type: "dialogue",
      text: "Texto 3",
      minDurationMs: 100,
      charsPerSecond: 60,
      speaker: { characterId: "kvothe", side: "left", imageKey: "neutral" },
    },
  },
  {
    blockId: "block-4",
    chapterTitle: "Capitulo 1",
    sceneTitle: "Cena 4",
    block: {
      id: "block-4",
      type: "dialogue",
      text: "Texto 4",
      minDurationMs: 100,
      charsPerSecond: 60,
      speaker: { characterId: "kvothe", side: "left", imageKey: "neutral" },
    },
  },
  {
    blockId: "block-5",
    chapterTitle: "Capitulo 1",
    sceneTitle: "Cena 5",
    block: {
      id: "block-5",
      type: "dialogue",
      text: "Texto 5",
      minDurationMs: 100,
      charsPerSecond: 60,
      speaker: { characterId: "kvothe", side: "left", imageKey: "neutral" },
    },
  },
  {
    blockId: "block-6",
    chapterTitle: "Capitulo 1",
    sceneTitle: "Cena 6",
    block: {
      id: "block-6",
      type: "dialogue",
      text: "Texto 6",
      minDurationMs: 100,
      charsPerSecond: 60,
      speaker: { characterId: "kvothe", side: "left", imageKey: "neutral" },
    },
  },
  {
    blockId: "block-7",
    chapterTitle: "Capitulo 1",
    sceneTitle: "Cena 7",
    block: {
      id: "block-7",
      type: "dialogue",
      text: "Texto 7",
      minDurationMs: 100,
      charsPerSecond: 60,
      speaker: { characterId: "kvothe", side: "left", imageKey: "neutral" },
    },
  },
  {
    blockId: "block-8",
    chapterTitle: "Capitulo 1",
    sceneTitle: "Cena 8",
    block: {
      id: "block-8",
      type: "context",
      text: "Texto 8",
      minDurationMs: 100,
      charsPerSecond: 60,
    },
  },
];

beforeEach(() => {
  observerRecords.length = 0;

  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "0px";
    readonly thresholds = [];
    private callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
      observerRecords.push({ callback });
    }

    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
  }

  vi.stubGlobal(
    "IntersectionObserver",
    MockIntersectionObserver as unknown as typeof IntersectionObserver,
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ReaderHistoryModal", () => {
  it("renders latest entries first and supports item actions", () => {
    const onClose = vi.fn();
    const onOpenBlock = vi.fn();

    render(
      <ReaderHistoryModal
        open
        characters={characters}
        entries={entries}
        onClose={onClose}
        onOpenBlock={onOpenBlock}
      />,
    );

    expect(screen.getByText("Texto 8")).toBeVisible();
    expect(screen.queryByText("Texto 3")).not.toBeInTheDocument();
    expect(screen.getByText("Narrador")).toBeVisible();
    expect(screen.getAllByText("Personagem: Kvothe").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByText("Texto 8"));
    expect(onOpenBlock).toHaveBeenCalledWith("block-8");

    fireEvent.click(screen.getByRole("button", { name: "Fechar historico" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("loads more entries when intersection observer fires", async () => {
    render(
      <ReaderHistoryModal
        open
        characters={characters}
        entries={entries}
        onClose={vi.fn()}
        onOpenBlock={vi.fn()}
      />,
    );

    expect(observerRecords.length).toBeGreaterThan(0);
    expect(screen.queryByText("Texto 3")).not.toBeInTheDocument();

    act(() => {
      const latestObserver = observerRecords[observerRecords.length - 1];
      latestObserver.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Texto 3")).toBeVisible();
    });
  });
});
