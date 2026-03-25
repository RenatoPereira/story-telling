import type {
  StoryBook,
  StoryChapter,
  StoryCharacter,
  StoryCharacters,
  StoryScene,
} from "@/lib/story/types";

import book from "@/content/o-nome-do-vento/book.json";
import bast from "@/content/o-nome-do-vento/characters/bast.json";
import cob from "@/content/o-nome-do-vento/characters/cob.json";
import garotoRannish from "@/content/o-nome-do-vento/characters/garoto-rannish.json";
import kote from "@/content/o-nome-do-vento/characters/kote.json";
import chapter1 from "@/content/o-nome-do-vento/chapters/chapter-1/chapter.json";
import scene1 from "@/content/o-nome-do-vento/chapters/chapter-1/scenes/scene-1.json";
import chapter2 from "@/content/o-nome-do-vento/chapters/chapter-2/chapter.json";
import scene2 from "@/content/o-nome-do-vento/chapters/chapter-2/scenes/scene-2.json";
import scene3 from "@/content/o-nome-do-vento/chapters/chapter-2/scenes/scene-3.json";
import scene4 from "@/content/o-nome-do-vento/chapters/chapter-2/scenes/scene-4.json";
import scene5 from "@/content/o-nome-do-vento/chapters/chapter-2/scenes/scene-5.json";

type CharacterFile = StoryCharacter & {
  id: string;
};

type ChapterFile = {
  id: string;
  title: string;
  sceneIds: string[];
};

function buildCharacters(
  characterIds: string[],
  files: CharacterFile[],
): StoryCharacters {
  const byId = new Map(files.map((file) => [file.id, file]));
  return Object.fromEntries(
    characterIds.map((id) => {
      const file = byId.get(id);
      if (!file) {
        throw new Error(`Personagem nao encontrado para id: ${id}`);
      }
      return [
        id,
        {
          name: file.name,
          defaultPortraitImage: file.defaultPortraitImage,
          portraits: file.portraits,
        } satisfies StoryCharacter,
      ];
    }),
  );
}

function buildChapters(chapterIds: string[], files: ChapterFile[]): StoryChapter[] {
  const scenes: StoryScene[] = [scene1, scene2, scene3, scene4, scene5];
  const scenesById = new Map(scenes.map((scene) => [scene.id, scene]));
  const chaptersById = new Map(files.map((file) => [file.id, file]));

  return chapterIds.map((chapterId) => {
    const chapterFile = chaptersById.get(chapterId);
    if (!chapterFile) {
      throw new Error(`Capitulo nao encontrado para id: ${chapterId}`);
    }

    return {
      id: chapterFile.id,
      title: chapterFile.title,
      scenes: chapterFile.sceneIds.map((sceneId) => {
        const scene = scenesById.get(sceneId);
        if (!scene) {
          throw new Error(`Cena nao encontrada para id: ${sceneId}`);
        }
        return scene;
      }),
    };
  });
}

export const storyBookData: StoryBook = {
  bookId: book.bookId,
  bookTitle: book.bookTitle,
  characters: buildCharacters(book.characterIds, [kote, bast, cob, garotoRannish]),
  chapters: buildChapters(book.chapterIds, [chapter1, chapter2]),
};
