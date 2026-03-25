import type { StoryBlock, StoryBook } from "@/lib/story/types";

const DEFAULT_CHARS_PER_SECOND = 30;
const MIN_CHARS_PER_SECOND = 1;

function parseConfiguredCharsPerSecond(rawValue: string | undefined): number {
  if (!rawValue) {
    return DEFAULT_CHARS_PER_SECOND;
  }

  const parsedValue = Number.parseInt(rawValue, 10);
  if (!Number.isFinite(parsedValue) || parsedValue < MIN_CHARS_PER_SECOND) {
    return DEFAULT_CHARS_PER_SECOND;
  }

  return parsedValue;
}

export function getConfiguredCharsPerSecond(): number {
  return parseConfiguredCharsPerSecond(process.env.READER_CHARS_PER_SECOND);
}

function overrideBlockCharsPerSecond(block: StoryBlock, charsPerSecond: number): StoryBlock {
  return {
    ...block,
    charsPerSecond,
  };
}

export function applyGlobalCharsPerSecond(
  storyBook: StoryBook,
  charsPerSecond: number,
): StoryBook {
  return {
    ...storyBook,
    chapters: storyBook.chapters.map((chapter) => ({
      ...chapter,
      scenes: chapter.scenes.map((scene) => ({
        ...scene,
        blocks: scene.blocks.map((block) =>
          overrideBlockCharsPerSecond(block, charsPerSecond),
        ),
      })),
    })),
  };
}
