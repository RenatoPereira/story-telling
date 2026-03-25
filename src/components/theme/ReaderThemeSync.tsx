"use client";

import { useEffect } from "react";

import { useReaderSettings } from "@/lib/config/useReaderSettings";
import { colorPalettes } from "@/lib/theme/colorPalettes";

export function ReaderThemeSync() {
  const settings = useReaderSettings();

  useEffect(() => {
    const root = document.documentElement;
    const palette = colorPalettes[settings.colorPalette];

    root.style.setProperty("--app-bg", palette.colors.appBg);
    root.style.setProperty("--app-fg", palette.colors.appFg);
    root.style.setProperty("--app-panel", palette.colors.panel);
    root.style.setProperty("--app-panel-strong", palette.colors.panelStrong);
    root.style.setProperty("--app-muted", palette.colors.muted);
    root.style.setProperty("--app-accent", palette.colors.accent);
    root.style.setProperty("--app-danger", palette.colors.danger);
    root.style.setProperty("--app-overlay", palette.colors.overlay);
    root.style.setProperty("--font-scale", String(settings.fontScale));

    root.dataset.accessibilityMode = settings.accessibilityMode;
  }, [settings]);

  return null;
}
