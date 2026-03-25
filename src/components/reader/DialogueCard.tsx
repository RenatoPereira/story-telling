import Image from "next/image";
import { motion } from "framer-motion";

import {
  resolveCharacterName,
  resolveCharacterPortrait,
  type DialogueBlock,
  type StoryCharacters,
} from "@/lib/story/types";
import { AnimatedText } from "@/components/reader/AnimatedText";
import styles from "./DialogueCard.module.css";

type DialogueCardProps = {
  block: DialogueBlock;
  characters: StoryCharacters;
  charsPerSecond: number;
  onTypingComplete: () => void;
};

export function DialogueCard({
  block,
  characters,
  charsPerSecond,
  onTypingComplete,
}: DialogueCardProps) {
  const panelClassName =
    `${styles.dialoguePanel} absolute bottom-8 left-1/2 w-[min(92vw,920px)] -translate-x-1/2 p-0 backdrop-blur-md`;
  const speakerName = resolveCharacterName(characters, block.speaker.characterId);
  const participants = [
    {
      key: `${block.id}-speaker`,
      side: block.speaker.side,
      isSpeaker: true,
      name: speakerName,
      portrait: resolveCharacterPortrait(characters, block.speaker),
    },
    ...(block.listeners ?? []).map((listener, index) => ({
      key: `${block.id}-listener-${index}`,
      side: listener.side,
      isSpeaker: false,
      name: resolveCharacterName(characters, listener.characterId),
      portrait: resolveCharacterPortrait(characters, listener),
    })),
  ];
  const leftParticipants = participants.filter((participant) => participant.side === "left");
  const rightParticipants = participants.filter(
    (participant) => participant.side === "right",
  );

  function renderParticipantStack(side: "left" | "right") {
    const sideParticipants = side === "left" ? leftParticipants : rightParticipants;

    return sideParticipants.map((participant, index) => {
      const horizontalOffset = index * 28;
      const verticalOffset = participant.isSpeaker ? 0 : Math.min(14 + index * 8, 44);

      return (
        <motion.figure
          key={participant.key}
          initial={{ x: side === "left" ? -24 : 24, opacity: 0 }}
          animate={{
            x: 0,
            opacity: participant.isSpeaker ? 1 : 0.5,
            scale: participant.isSpeaker ? 1 : 0.86,
          }}
          transition={{ duration: 0.28 }}
          className="absolute h-[min(54vw,520px)] w-[min(33vw,360px)] overflow-hidden shadow-2xl"
          style={{
            zIndex: sideParticipants.length - index,
            bottom: `${verticalOffset}px`,
            [side]: `${horizontalOffset}px`,
          }}
        >
          <Image
            src={participant.portrait}
            alt={`Personagem ${participant.name}`}
            fill
            className={`${side === "right" ? "scale-x-[-1] " : ""}object-cover`}
          />
        </motion.figure>
      );
    });
  }

  return (
    <section className="pointer-events-none fixed inset-0 z-30 min-h-[260px] border-t-px border-t-white">
      <div className="absolute bottom-[116px] left-[2.4vw] h-[min(58vw,560px)] w-[min(42vw,440px)]">
        {renderParticipantStack("left")}
      </div>
      <div className="absolute bottom-[116px] right-[2.4vw] h-[min(58vw,560px)] w-[min(42vw,440px)]">
        {renderParticipantStack("right")}
      </div>

      <motion.article
        key={block.id}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className={panelClassName}
      >
        <div className={styles.dialogueNameWrap}>
          <p className={`${styles.dialogueName} m-0`}>{speakerName}</p>
        </div>
        <div className={styles.dialogueTextWrap}>
          <AnimatedText
            key={block.id}
            text={block.text}
            charsPerSecond={charsPerSecond}
            className={`${styles.dialogueText} m-0 [&_em]:italic`}
            onComplete={onTypingComplete}
          />
        </div>
      </motion.article>
    </section>
  );
}
