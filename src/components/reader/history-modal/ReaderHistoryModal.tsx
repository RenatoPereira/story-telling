"use client";

import { Modal } from "@/design-system/atoms/modal/Modal";
import { Button } from "@/design-system/atoms/button/Button";
import {
  resolveCharacterName,
  type StoryBlock,
  type StoryCharacters,
} from "@/lib/story/types";
import styles from "./ReaderHistoryModal.module.css";

export type ReaderHistoryEntry = {
  blockId: string;
  chapterTitle: string;
  sceneTitle: string;
  block: StoryBlock;
};

type ReaderHistoryModalProps = {
  open: boolean;
  characters: StoryCharacters;
  entries: ReaderHistoryEntry[];
  onClose: () => void;
  onOpenBlock: (blockId: string) => void;
};

export function ReaderHistoryModal({
  open,
  characters,
  entries,
  onClose,
  onOpenBlock,
}: ReaderHistoryModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="mb-4 mt-1 text-xl font-bold">Historico de leitura</h2>
      <ul className="grid list-none gap-3 p-0">
        {entries.map((entry) => {
          const meta =
            entry.block.type === "dialogue"
              ? `${entry.chapterTitle} / ${entry.sceneTitle} - ${resolveCharacterName(
                  characters,
                  entry.block.speaker.characterId,
                )}`
              : `${entry.chapterTitle} / ${entry.sceneTitle} - Contexto`;
          return (
            <li key={entry.blockId} className={`${styles.entryItem} rounded-xl p-3`}>
              <p className={`${styles.entryMeta} text-sm`}>{meta}</p>
              <p className="mt-1 text-[0.97rem] leading-relaxed">{entry.block.text}</p>
              <Button onClick={() => onOpenBlock(entry.blockId)}>Abrir bloco</Button>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
