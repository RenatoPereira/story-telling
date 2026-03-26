"use client";

import { useEffect } from "react";

type ReplaceFn = (href: string, options?: { scroll?: boolean }) => void;

export function useSyncBlockIdWithUrl(
  currentBlockId: string,
  pathname: string,
  replace: ReplaceFn,
) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("blockId", currentBlockId);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [currentBlockId, pathname, replace]);
}
