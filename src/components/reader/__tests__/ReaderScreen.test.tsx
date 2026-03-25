import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ReaderScreen } from "@/screens/reader/ReaderScreen";
import type { StoryBook } from "@/lib/story/types";

const storyFixture: StoryBook = {
  bookId: "book-1",
  bookTitle: "Livro teste",
  characters: {
    kvothe: {
      name: "Kvothe",
      defaultPortraitImage: "/assets/characters/kvothe-neutral.svg",
      portraits: {
        neutral: "/assets/characters/kvothe-neutral.svg",
      },
    },
  },
  chapters: [
    {
      id: "chapter-1",
      title: "Capitulo teste",
      scenes: [
        {
          id: "scene-1",
          title: "Cena 1",
          backgroundImage: "/assets/backgrounds/estalagem.svg",
          audio: {
            enabled: true,
            defaultVoice: "alloy",
            ambientTrack: "/assets/audio/scene-1-ambient.mp3",
          },
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
                side: "left",
                imageKey: "neutral",
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
    const autoplayToggle = screen.getByRole("button", { name: "Alternar autoplay" });
    expect(autoplayToggle).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(autoplayToggle);
    expect(screen.getByRole("button", { name: "Alternar autoplay" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
