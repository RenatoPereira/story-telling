import Image from "next/image";
import { motion } from "framer-motion";

import type { DialogueBlock } from "@/lib/story/types";
import { AnimatedText } from "@/components/reader/AnimatedText";
import { styleConfig } from "@/lib/theme/styleConfig";

type DialogueCardProps = {
  block: DialogueBlock;
  charsPerSecond: number;
  onTypingComplete: () => void;
};

export function DialogueCard({
  block,
  charsPerSecond,
  onTypingComplete,
}: DialogueCardProps) {
  const panelClassName =
    "absolute bottom-20 left-1/2 w-[min(94vw,980px)] -translate-x-1/2 rounded-[8px] bg-black/62 p-0 text-[var(--app-fg)] shadow-2xl backdrop-blur-md";
  const isLeftSpeaker = block.speaker.side === "left";

  return (
    <section className="pointer-events-none fixed inset-0 z-30 min-h-[260px]">
      <motion.figure
        key={`${block.id}-left`}
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: isLeftSpeaker ? 1 : 0.35 }}
        transition={{ duration: 0.28 }}
        className="absolute bottom-[138px] left-[1.5vw] h-[min(52vw,500px)] w-[min(32vw,340px)] overflow-hidden rounded-xl shadow-2xl"
      >
        <Image
          src={block.speaker.portraitImage}
          alt={`Personagem ${block.speaker.characterName}`}
          fill
          className="object-cover"
        />
      </motion.figure>

      <motion.figure
        key={`${block.id}-right`}
        initial={{ x: 24, opacity: 0 }}
        animate={{ x: 0, opacity: !isLeftSpeaker ? 1 : 0.25 }}
        transition={{ duration: 0.28 }}
        className="absolute bottom-[138px] right-[1.5vw] h-[min(52vw,500px)] w-[min(32vw,340px)] overflow-hidden rounded-xl shadow-2xl"
      >
        <Image
          src={block.speaker.portraitImage}
          alt={`Personagem ${block.speaker.characterName}`}
          fill
          className="scale-x-[-1] object-cover"
        />
      </motion.figure>

      <motion.article
        key={block.id}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className={panelClassName}
        style={{ borderRadius: styleConfig.layout.dialogueRadiusPx }}
      >
        <div
          style={{
            paddingInline: styleConfig.layout.dialoguePaddingX,
            paddingTop: styleConfig.layout.dialoguePaddingY,
          }}
        >
          <p
            className="m-0 text-[#f6e5be]"
            style={{
              fontSize: styleConfig.typography.dialogueName.fontSizePx,
              fontWeight: styleConfig.typography.dialogueName.fontWeight,
              lineHeight: `${styleConfig.typography.dialogueName.lineHeightPx}px`,
            }}
          >
            {block.speaker.characterName}
          </p>
        </div>
        <div
          style={{
            paddingInline: styleConfig.layout.dialoguePaddingX,
            paddingBottom: styleConfig.layout.dialoguePaddingY,
            paddingTop: 8,
          }}
        >
          <AnimatedText
            key={block.id}
            text={block.text}
            charsPerSecond={charsPerSecond}
            className="m-0 text-[#f9f1dc] [&_em]:italic"
            onComplete={onTypingComplete}
            style={{
              fontSize: styleConfig.typography.dialogueText.fontSizePx,
              fontWeight: styleConfig.typography.dialogueText.fontWeight,
              lineHeight: `${styleConfig.typography.dialogueText.lineHeightPx}px`,
            }}
          />
        </div>
      </motion.article>
    </section>
  );
}
