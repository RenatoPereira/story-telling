import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ReaderScreen } from "@/components/reader/ReaderScreen";
import type { StoryBook } from "@/lib/story/types";

const storyFixture: StoryBook = {
  bookId: "book-1",
  bookTitle: "Livro teste",
  chapters: [
    {
      id: "chapter-1",
      title: "Capitulo teste",
      scenes: [
        {
          id: "scene-1",
          title: "Cena 1",
          backgroundImage: "/assets/backgrounds/estalagem.svg",
          audio: { enabled: true, defaultVoice: "alloy" },
          blocks: [
            {
              id: "block-context-1",
              type: "context",
              text: "Oi",
              minDurationMs: 50,
              charsPerSecond: 80,
            },
            {
              id: "block-dialogue-1",
              type: "dialogue",
              text: "Falando agora",
              minDurationMs: 50,
              charsPerSecond: 80,
              speaker: {
                characterId: "kvothe",
                characterName: "Kvothe",
                emotion: "neutral",
                side: "left",
                portraitImage: "/assets/characters/kvothe-neutral.svg",
              },
              voiceProfile: { provider: "openai", voice: "alloy" },
            },
          ],
        },
      ],
    },
  ],
};

describe("ReaderScreen", () => {
  it("renders and toggles autoplay mode", () => {
    render(<ReaderScreen storyBook={storyFixture} />);

    expect(screen.getByText("Livro teste")).toBeVisible();
    expect(screen.getByRole("button", { name: "Autoplay: ligado" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Autoplay: ligado" }));
    expect(screen.getByRole("button", { name: "Autoplay: desligado" })).toBeVisible();
  });
});
