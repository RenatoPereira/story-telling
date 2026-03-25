export type VoiceProfile = {
  provider: "openai";
  voice: string;
};

export type StoryCharacter = {
  name: string;
  defaultPortraitImage: string;
  portraits: Record<string, string>;
};

export type StoryCharacters = Record<string, StoryCharacter>;

export type DialogueParticipant = {
  characterId: string;
  side: "left" | "right";
  imageKey?: string;
};

export type StoryBlockBase = {
  id: string;
  minDurationMs: number;
  charsPerSecond: number;
};

export type ContextBlock = StoryBlockBase & {
  type: "context";
  text: string;
};

export type DialogueBlock = StoryBlockBase & {
  type: "dialogue";
  speaker: DialogueParticipant;
  text: string;
  voiceProfile?: VoiceProfile;
  listeners?: DialogueParticipant[];
};

export type StoryBlock = ContextBlock | DialogueBlock;

export type SceneAudio = {
  enabled: boolean;
  defaultVoice: string;
  ambientTrack: string;
};

export type StoryScene = {
  id: string;
  title: string;
  backgroundImage: string;
  audio: SceneAudio;
  blocks: StoryBlock[];
};

export type StoryChapter = {
  id: string;
  title: string;
  scenes: StoryScene[];
};

export type StoryBook = {
  bookId: string;
  bookTitle: string;
  characters: StoryCharacters;
  chapters: StoryChapter[];
};

const FALLBACK_CHARACTER_IMAGE = "/assets/characters/cronista-neutral.svg";

export function resolveCharacterName(
  characters: StoryCharacters,
  characterId: string,
): string {
  return characters[characterId]?.name ?? characterId;
}

export function resolveCharacterPortrait(
  characters: StoryCharacters,
  participant: Pick<DialogueParticipant, "characterId" | "imageKey">,
): string {
  const character = characters[participant.characterId];
  if (!character) {
    return FALLBACK_CHARACTER_IMAGE;
  }
  if (participant.imageKey && character.portraits[participant.imageKey]) {
    return character.portraits[participant.imageKey];
  }
  return character.defaultPortraitImage;
}
