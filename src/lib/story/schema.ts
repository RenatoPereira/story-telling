import { z } from "zod";

export const voiceProfileSchema = z.object({
  provider: z.literal("openai"),
  voice: z.string().min(1),
});

export const storyCharacterSchema = z.object({
  name: z.string().min(1),
  defaultPortraitImage: z.string().min(1),
  portraits: z.record(z.string().min(1), z.string().min(1)),
});

export const dialogueParticipantSchema = z.object({
  characterId: z.string().min(1),
  side: z.enum(["left", "right"]),
  imageKey: z.string().min(1).optional(),
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
  speaker: dialogueParticipantSchema,
  listeners: z.array(dialogueParticipantSchema).optional(),
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
    ambientTrack: z.string().min(1),
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
    characters: z
      .record(z.string().min(1), storyCharacterSchema)
      .refine((value) => Object.keys(value).length > 0, {
        message: "E necessario informar ao menos um personagem.",
      }),
    chapters: z.array(storyChapterSchema).min(1),
  })
  .superRefine((value, ctx) => {
    const ids = new Set<string>();
    const characterIds = new Set(Object.keys(value.characters));
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

          if (block.type === "dialogue") {
            if (!characterIds.has(block.speaker.characterId)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Personagem inexistente no speaker: ${block.speaker.characterId}`,
              });
              return;
            }
            for (const listener of block.listeners ?? []) {
              if (!characterIds.has(listener.characterId)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: `Personagem inexistente no listener: ${listener.characterId}`,
                });
                return;
              }
            }
          }
        }
      }
    }
  });

export type StoryBookInput = z.infer<typeof storyBookSchema>;
