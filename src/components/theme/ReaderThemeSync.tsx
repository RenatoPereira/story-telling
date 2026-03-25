"use client";

import { useEffect } from "react";

import { useReaderSettings } from "@/stores/reader-settings";
import { colorPalettes } from "@/lib/theme/colorPalettes";
import { styleConfig } from "@/lib/theme/styleConfig";

export function ReaderThemeSync() {
  const settings = useReaderSettings();

  useEffect(() => {
    const root = document.documentElement;
    const palette = colorPalettes[settings.colorPalette];
    const toPx = (value: number) => `${value}px`;

    root.style.setProperty("--app-bg", palette.colors.appBg);
    root.style.setProperty("--app-fg", palette.colors.appFg);
    root.style.setProperty("--app-panel", palette.colors.panel);
    root.style.setProperty("--app-panel-strong", palette.colors.panelStrong);
    root.style.setProperty("--app-muted", palette.colors.muted);
    root.style.setProperty("--app-accent", palette.colors.accent);
    root.style.setProperty("--app-danger", palette.colors.danger);
    root.style.setProperty("--app-overlay", palette.colors.overlay);
    root.style.setProperty("--font-scale", String(settings.fontScale));
    root.style.setProperty(
      "--safe-area-side",
      `${styleConfig.base.safeAreaSidePx}px`,
    );
    root.style.setProperty(
      "--header-height",
      toPx(styleConfig.layout.headerHeightPx),
    );
    root.style.setProperty(
      "--bottom-height",
      toPx(styleConfig.layout.bottomHeightPx),
    );

    root.style.setProperty(
      "--reader-font-chapter-title-size",
      toPx(styleConfig.typography.chapterTitle.fontSizePx),
    );
    root.style.setProperty(
      "--reader-font-chapter-title-line-height",
      toPx(styleConfig.typography.chapterTitle.lineHeightPx),
    );
    root.style.setProperty(
      "--reader-font-chapter-title-weight",
      String(styleConfig.typography.chapterTitle.fontWeight),
    );
    root.style.setProperty(
      "--reader-font-narrator-text-size",
      toPx(styleConfig.typography.narratorText.fontSizePx),
    );
    root.style.setProperty(
      "--reader-font-narrator-text-line-height",
      toPx(styleConfig.typography.narratorText.lineHeightPx),
    );
    root.style.setProperty(
      "--reader-font-narrator-text-weight",
      String(styleConfig.typography.narratorText.fontWeight),
    );
    root.style.setProperty(
      "--reader-font-dialogue-name-size",
      toPx(styleConfig.typography.dialogueName.fontSizePx),
    );
    root.style.setProperty(
      "--reader-font-dialogue-name-line-height",
      toPx(styleConfig.typography.dialogueName.lineHeightPx),
    );
    root.style.setProperty(
      "--reader-font-dialogue-name-weight",
      String(styleConfig.typography.dialogueName.fontWeight),
    );
    root.style.setProperty(
      "--reader-font-dialogue-text-size",
      toPx(styleConfig.typography.dialogueText.fontSizePx),
    );
    root.style.setProperty(
      "--reader-font-dialogue-text-line-height",
      toPx(styleConfig.typography.dialogueText.lineHeightPx),
    );
    root.style.setProperty(
      "--reader-font-dialogue-text-weight",
      String(styleConfig.typography.dialogueText.fontWeight),
    );
    root.style.setProperty(
      "--reader-layout-dialogue-radius",
      toPx(styleConfig.layout.dialogueRadiusPx),
    );
    root.style.setProperty(
      "--reader-layout-dialogue-padding-x",
      toPx(styleConfig.layout.dialoguePaddingX),
    );
    root.style.setProperty(
      "--reader-layout-dialogue-padding-y",
      toPx(styleConfig.layout.dialoguePaddingY),
    );
    root.style.setProperty(
      "--reader-layout-narrator-padding-x",
      toPx(styleConfig.layout.narratorPaddingX),
    );
    root.style.setProperty(
      "--reader-layout-narrator-padding-y",
      toPx(styleConfig.layout.narratorPaddingY),
    );
    root.style.setProperty(
      "--reader-layout-header-padding-x",
      toPx(styleConfig.layout.headerPaddingX),
    );

    root.dataset.accessibilityMode = settings.accessibilityMode;
  }, [settings]);

  return null;
}
