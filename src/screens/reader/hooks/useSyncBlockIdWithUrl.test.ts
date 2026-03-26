import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useSyncBlockIdWithUrl } from "@/screens/reader/hooks/useSyncBlockIdWithUrl";

describe("useSyncBlockIdWithUrl", () => {
  it("updates blockId query param while preserving existing params", () => {
    window.history.pushState({}, "", "/?chapter=1");
    const replace = vi.fn();

    const { rerender } = renderHook(
      ({ currentBlockId }) =>
        useSyncBlockIdWithUrl(currentBlockId, "/reader", replace),
      {
        initialProps: { currentBlockId: "scene-1-block-1" },
      },
    );

    expect(replace).toHaveBeenCalledWith("/reader?chapter=1&blockId=scene-1-block-1", {
      scroll: false,
    });

    rerender({ currentBlockId: "scene-1-block-2" });

    expect(replace).toHaveBeenLastCalledWith(
      "/reader?chapter=1&blockId=scene-1-block-2",
      { scroll: false },
    );
  });
});
