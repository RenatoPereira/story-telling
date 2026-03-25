import type {
  StoryBlock,
  StoryBook,
  StoryCharacter,
  StoryScene,
} from "@/lib/story/types";

export type StoryContentManager = ReturnType<typeof createStoryContentManager>;

export function createStoryContentManager(storyBook: StoryBook) {
  const characterById = new Map<string, StoryCharacter>(
    Object.entries(storyBook.characters),
  );
  const sceneById = new Map<string, StoryScene>();
  const blockBySceneAndId = new Map<string, StoryBlock>();

  for (const chapter of storyBook.chapters) {
    for (const scene of chapter.scenes) {
      sceneById.set(scene.id, scene);
      for (const block of scene.blocks) {
        blockBySceneAndId.set(`${scene.id}:${block.id}`, block);
      }
    }
  }

  return {
    getCharacterById(characterId: string): StoryCharacter | null {
      return characterById.get(characterId) ?? null;
    },
    getSceneById(sceneId: string): StoryScene | null {
      return sceneById.get(sceneId) ?? null;
    },
    getSceneBlockById(sceneId: string, blockId: string): StoryBlock | null {
      return blockBySceneAndId.get(`${sceneId}:${blockId}`) ?? null;
    },
  };
}
