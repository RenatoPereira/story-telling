export type VoiceProfile = {
  provider: "openai";
  voice: string;
};

export type DialogueSpeaker = {
  characterId: string;
  characterName: string;
  emotion: string;
  side: "left" | "right";
  portraitImage: string;
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
  speaker: DialogueSpeaker;
  text: string;
  voiceProfile?: VoiceProfile;
};

export type StoryBlock = ContextBlock | DialogueBlock;

export type SceneAudio = {
  enabled: boolean;
  defaultVoice: string;
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
  chapters: StoryChapter[];
};
