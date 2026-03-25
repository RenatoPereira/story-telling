import type {
  StoryBook,
  StoryChapter,
  StoryCharacter,
  StoryCharacters,
  StoryScene,
} from "@/lib/story/types";
import { storyCharacterSchema, storySceneSchema } from "@/lib/story/schema";

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

type BookFile = {
  bookId: string;
  bookTitle: string;
  characterIds: string[];
  chapterIds: string[];
};

function parseBookFile(value: unknown): BookFile {
  if (!value || typeof value !== "object") {
    throw new Error("Arquivo do livro invalido.");
  }

  const candidate = value as Partial<BookFile>;
  const hasValidStringArray = (items: unknown): items is string[] =>
    Array.isArray(items) && items.every((item) => typeof item === "string");

  if (
    typeof candidate.bookId !== "string" ||
    typeof candidate.bookTitle !== "string" ||
    !hasValidStringArray(candidate.characterIds) ||
    !hasValidStringArray(candidate.chapterIds)
  ) {
    throw new Error("Metadados do livro invalidos.");
  }

  return candidate as BookFile;
}

function parseCharacterFile(value: unknown): CharacterFile {
  if (!value || typeof value !== "object") {
    throw new Error("Arquivo de personagem invalido.");
  }

  const candidate = value as Partial<CharacterFile>;
  if (typeof candidate.id !== "string") {
    throw new Error("Personagem sem id valido.");
  }

  return {
    id: candidate.id,
    ...storyCharacterSchema.parse(value),
  };
}

function parseChapterFile(value: unknown): ChapterFile {
  if (!value || typeof value !== "object") {
    throw new Error("Arquivo de capitulo invalido.");
  }

  const candidate = value as Partial<ChapterFile>;
  const hasValidSceneIds =
    Array.isArray(candidate.sceneIds) &&
    candidate.sceneIds.every((id) => typeof id === "string");

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.title !== "string" ||
    !hasValidSceneIds
  ) {
    throw new Error("Metadados de capitulo invalidos.");
  }

  return candidate as ChapterFile;
}

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
  const scenes: StoryScene[] = [scene1, scene2, scene3, scene4, scene5].map(
    (scene) => storySceneSchema.parse(scene),
  );
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

const parsedBook = parseBookFile(book);
const parsedCharacters = [kote, bast, cob, garotoRannish].map(parseCharacterFile);
const parsedChapters = [chapter1, chapter2].map(parseChapterFile);

export const storyBookData: StoryBook = {
  bookId: parsedBook.bookId,
  bookTitle: parsedBook.bookTitle,
  characters: buildCharacters(parsedBook.characterIds, parsedCharacters),
  chapters: buildChapters(parsedBook.chapterIds, parsedChapters),
};
