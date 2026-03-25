import {
  resolveCharacterName,
  type StoryBlock,
  type StoryBook,
  type StoryCharacters,
  type StoryScene,
} from "@/lib/story/types";

export function clampSceneIndex(index: number, scenesLength: number): number {
  if (scenesLength <= 0) {
    return 0;
  }

  if (index < 0) {
    return 0;
  }

  if (index >= scenesLength) {
    return scenesLength - 1;
  }

  return index;
}

export function clampBlockIndex(index: number, blocksLength: number): number {
  if (blocksLength <= 0) {
    return 0;
  }

  if (index < 0) {
    return 0;
  }

  if (index >= blocksLength) {
    return blocksLength - 1;
  }

  return index;
}

export function getCurrentBlock(
  scene: StoryScene,
  blockIndex: number,
): StoryBlock | null {
  if (blockIndex < 0 || blockIndex >= scene.blocks.length) {
    return null;
  }

  return scene.blocks[blockIndex];
}

export function buildSceneSpeechText(
  scene: StoryScene,
  characters: StoryCharacters = {},
): string {
  return scene.blocks
    .map((block) =>
      block.type === "dialogue"
        ? `${resolveCharacterName(characters, block.speaker.characterId)}: ${block.text}`
        : block.text,
    )
    .join("\n\n");
}

export function getBookScenes(storyBook: StoryBook): StoryScene[] {
  return storyBook.chapters.flatMap((chapter) => chapter.scenes);
}

export type StoryBlockPosition = {
  sceneIndex: number;
  blockIndex: number;
};

export function findBlockPositionById(
  storyBook: StoryBook,
  blockId: string | null | undefined,
): StoryBlockPosition | null {
  if (!blockId) {
    return null;
  }

  const scenes = getBookScenes(storyBook);
  for (let sceneIndex = 0; sceneIndex < scenes.length; sceneIndex += 1) {
    const scene = scenes[sceneIndex];
    const blockIndex = scene.blocks.findIndex((block) => block.id === blockId);
    if (blockIndex >= 0) {
      return { sceneIndex, blockIndex };
    }
  }

  return null;
}

export type PlaybackStatus =
  | "idle"
  | "playing"
  | "waiting_continue"
  | "completed";

export function resolveNextStatus(params: {
  autoplay: boolean;
  isLastBlock: boolean;
}): PlaybackStatus {
  if (params.isLastBlock) {
    return "completed";
  }

  return params.autoplay ? "playing" : "waiting_continue";
}
