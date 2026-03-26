"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiArrowUpRight, FiX } from "react-icons/fi";

import { Modal } from "@/design-system/atoms/modal/Modal";
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
      {open ? (
        <HistoryEntries
          characters={characters}
          entries={entries}
          onClose={onClose}
          onOpenBlock={onOpenBlock}
        />
      ) : null}
    </Modal>
  );
}

type HistoryEntriesProps = {
  characters: StoryCharacters;
  entries: ReaderHistoryEntry[];
  onClose: () => void;
  onOpenBlock: (blockId: string) => void;
};

function HistoryEntries({
  characters,
  entries,
  onClose,
  onOpenBlock,
}: HistoryEntriesProps) {
  const orderedEntries = useMemo(() => [...entries].reverse(), [entries]);
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(5, orderedEntries.length),
  );
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const hasMoreEntries = visibleCount < orderedEntries.length;

  useEffect(() => {
    if (!hasMoreEntries) {
      return;
    }

    const node = loadMoreRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (intersectionEntries) => {
        if (intersectionEntries[0]?.isIntersecting) {
          setVisibleCount((currentCount) =>
            Math.min(currentCount + 3, orderedEntries.length),
          );
        }
      },
      { rootMargin: "120px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMoreEntries, orderedEntries.length]);

  return (
    <section className={styles.historyRoot}>
      <div className={styles.stickyHeader}>
        <h2 className="m-0 text-xl font-bold">Historico de leitura</h2>
        <button
          type="button"
          onClick={onClose}
          className={styles.iconButton}
          aria-label="Fechar historico"
          title="Fechar"
        >
          <FiX size={20} />
        </button>
      </div>

      <ul className={styles.entriesList}>
        {orderedEntries.slice(0, visibleCount).map((entry) => {
          const speakerLabel =
            entry.block.type === "dialogue"
              ? `Personagem: ${resolveCharacterName(
                  characters,
                  entry.block.speaker.characterId,
                )}`
              : "Narrador";

          const locationLabel = `${entry.chapterTitle} / ${entry.sceneTitle}`;

          return (
            <li key={entry.blockId} className={styles.entryItem}>
              <button
                type="button"
                className={styles.entryButton}
                onClick={() => onOpenBlock(entry.blockId)}
                aria-label={`Abrir bloco: ${locationLabel}`}
                title="Abrir bloco"
              >
                <div className={styles.entryHead}>
                  <p className={`${styles.entryMeta} m-0 text-sm`}>{locationLabel}</p>
                  <FiArrowUpRight
                    size={18}
                    className={styles.entryActionIcon}
                    aria-hidden
                  />
                </div>
                <p className={`${styles.entrySpeaker} m-0`}>{speakerLabel}</p>
                <p className="mt-2 text-[0.97rem] leading-relaxed">{entry.block.text}</p>
              </button>
            </li>
          );
        })}
      </ul>
      {hasMoreEntries ? (
        <div ref={loadMoreRef} className={styles.loader}>
          Carregando mais...
        </div>
      ) : null}
    </section>
  );
}
