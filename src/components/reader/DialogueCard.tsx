import Image from "next/image";
import { motion } from "framer-motion";

import type { DialogueBlock } from "@/lib/story/types";
import { AnimatedText } from "@/components/reader/AnimatedText";

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
    "absolute bottom-20 left-1/2 w-[min(94vw,1120px)] -translate-x-1/2 rounded-md border border-[#c5ab7a]/55 bg-black/62 p-3 text-[var(--app-fg)] shadow-2xl backdrop-blur-md";
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
      >
        <div className="mb-2 inline-flex rounded-sm border border-[#c5ab7a]/65 bg-black/45 px-3 py-1">
          <p className="m-0 text-xl font-semibold text-[#f6e5be]">
            {block.speaker.characterName}
          </p>
        </div>
        <div className="rounded-sm border border-[#c5ab7a]/40 bg-black/45 px-3 py-3">
          <AnimatedText
            key={block.id}
            text={block.text}
            charsPerSecond={charsPerSecond}
            className="m-0 text-lg leading-[1.5] text-[#f9f1dc] md:text-3xl"
            onComplete={onTypingComplete}
          />
        </div>
      </motion.article>
    </section>
  );
}
