"use client";

import { Modal } from "@/design-system/atoms/modal/Modal";
import { Button } from "@/design-system/atoms/button/Button";
import type { StoryBlock } from "@/lib/story/types";

export type ReaderHistoryEntry = {
  blockId: string;
  sceneTitle: string;
  block: StoryBlock;
};

type ReaderHistoryModalProps = {
  open: boolean;
  entries: ReaderHistoryEntry[];
  onClose: () => void;
  onOpenBlock: (blockId: string) => void;
};

export function ReaderHistoryModal({
  open,
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
              ? `${entry.sceneTitle} - ${entry.block.speaker.characterName}`
              : `${entry.sceneTitle} - Contexto`;
          return (
            <li key={entry.blockId} className="rounded-xl bg-white/8 p-3">
              <p className="text-sm text-[var(--app-muted)]">{meta}</p>
              <p className="mt-1 text-[0.97rem] leading-relaxed">{entry.block.text}</p>
              <Button onClick={() => onOpenBlock(entry.blockId)}>Abrir bloco</Button>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
