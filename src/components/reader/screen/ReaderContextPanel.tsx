"use client";

import { AnimatedText } from "@/components/reader/AnimatedText";
import styles from "./ReaderContextPanel.module.css";

type ReaderContextPanelProps = {
  blockId: string;
  text: string;
  charsPerSecond: number;
  onTypingComplete: () => void;
};

export function ReaderContextPanel({
  blockId,
  text,
  charsPerSecond,
  onTypingComplete,
}: ReaderContextPanelProps) {
  return (
    <section className="pointer-events-none mt-8 flex flex-1 items-center justify-center">
      <div
        className={`${styles.contextPanel} w-[min(90vw,880px)] backdrop-blur-sm tracking-wide`}
      >
        <AnimatedText
          key={`${blockId}-top`}
          text={text}
          charsPerSecond={charsPerSecond}
          className={`${styles.contextText} m-0`}
          onComplete={onTypingComplete}
        />
      </div>
    </section>
  );
}
