"use client";

import { useEffect } from "react";

type UseReaderKeyboardNavigationParams = {
  canContinue: boolean;
  continueFlow: () => void;
  nextBlock: () => void;
  previousBlock: () => void;
};

export function useReaderKeyboardNavigation({
  canContinue,
  continueFlow,
  nextBlock,
  previousBlock,
}: UseReaderKeyboardNavigationParams) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement) {
        const tag = event.target.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea") {
          return;
        }
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextBlock();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousBlock();
      }

      if (event.key === " " && canContinue) {
        event.preventDefault();
        continueFlow();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canContinue, continueFlow, nextBlock, previousBlock]);
}
