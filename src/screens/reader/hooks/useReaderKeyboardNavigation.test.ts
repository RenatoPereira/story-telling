import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useReaderKeyboardNavigation } from "@/screens/reader/hooks/useReaderKeyboardNavigation";

describe("useReaderKeyboardNavigation", () => {
  it("triggers block navigation and continue actions with keyboard", () => {
    const nextBlock = vi.fn();
    const previousBlock = vi.fn();
    const continueFlow = vi.fn();

    renderHook(() =>
      useReaderKeyboardNavigation({
        canContinue: true,
        continueFlow,
        nextBlock,
        previousBlock,
      }),
    );

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));

    expect(nextBlock).toHaveBeenCalledTimes(1);
    expect(previousBlock).toHaveBeenCalledTimes(1);
    expect(continueFlow).toHaveBeenCalledTimes(1);
  });

  it("ignores space when continuation is blocked and ignores input targets", () => {
    const nextBlock = vi.fn();
    const previousBlock = vi.fn();
    const continueFlow = vi.fn();

    renderHook(() =>
      useReaderKeyboardNavigation({
        canContinue: false,
        continueFlow,
        nextBlock,
        previousBlock,
      }),
    );

    window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    expect(continueFlow).not.toHaveBeenCalled();

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

    expect(nextBlock).not.toHaveBeenCalled();
    expect(previousBlock).not.toHaveBeenCalled();

    input.remove();
  });
});
