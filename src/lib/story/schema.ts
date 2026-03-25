import { z } from "zod";

export const voiceProfileSchema = z.object({
  provider: z.literal("openai"),
  voice: z.string().min(1),
});

export const dialogueSpeakerSchema = z.object({
  characterId: z.string().min(1),
  characterName: z.string().min(1),
  emotion: z.string().min(1),
  side: z.enum(["left", "right"]),
  portraitImage: z.string().min(1),
});

export const contextBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("context"),
  text: z.string().min(1),
  minDurationMs: z.number().int().positive(),
  charsPerSecond: z.number().int().positive(),
});

export const dialogueBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("dialogue"),
  text: z.string().min(1),
  minDurationMs: z.number().int().positive(),
  charsPerSecond: z.number().int().positive(),
  speaker: dialogueSpeakerSchema,
  voiceProfile: voiceProfileSchema.optional(),
});

export const storyBlockSchema = z.discriminatedUnion("type", [
  contextBlockSchema,
  dialogueBlockSchema,
]);

export const storySceneSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  backgroundImage: z.string().min(1),
  audio: z.object({
    enabled: z.boolean(),
    defaultVoice: z.string().min(1),
  }),
  blocks: z.array(storyBlockSchema).min(1),
});

export const storyChapterSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  scenes: z.array(storySceneSchema).min(1),
});

export const storyBookSchema = z
  .object({
    bookId: z.string().min(1),
    bookTitle: z.string().min(1),
    chapters: z.array(storyChapterSchema).min(1),
  })
  .superRefine((value, ctx) => {
    const ids = new Set<string>();
    for (const chapter of value.chapters) {
      for (const scene of chapter.scenes) {
        for (const block of scene.blocks) {
          if (ids.has(block.id)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `ID de bloco duplicado: ${block.id}`,
            });
            return;
          }
          ids.add(block.id);
        }
      }
    }
  });

export type StoryBookInput = z.infer<typeof storyBookSchema>;
