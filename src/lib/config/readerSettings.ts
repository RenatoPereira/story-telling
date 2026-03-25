import {
  colorPalettes,
  defaultColorPalette,
  type ColorPaletteId,
} from "@/lib/theme/colorPalettes";

export type ReaderSettings = {
  textSpeedMultiplier: number;
  dialogueDelayMultiplier: number;
  contextDelayMultiplier: number;
  autoplay: boolean;
  fontScale: number;
  accessibilityMode: "default" | "high-contrast" | "reduced-motion";
  colorPalette: ColorPaletteId;
};

export const READER_SETTINGS_STORAGE_KEY = "story-telling.reader.settings";
export const READER_SETTINGS_EVENT = "reader-settings-updated";

export const defaultReaderSettings: ReaderSettings = {
  textSpeedMultiplier: 1,
  dialogueDelayMultiplier: 1,
  contextDelayMultiplier: 1,
  autoplay: true,
  fontScale: 1,
  accessibilityMode: "default",
  colorPalette: defaultColorPalette,
};

function clampMultiplier(value: number): number {
  return Math.min(3, Math.max(0.25, value));
}

function clampFontScale(value: number): number {
  return Math.min(1.6, Math.max(0.85, value));
}

export function sanitizeReaderSettings(
  value: Partial<ReaderSettings>,
): ReaderSettings {
  const allowedAccessibilityModes = new Set<
    ReaderSettings["accessibilityMode"]
  >(["default", "high-contrast", "reduced-motion"]);
  const isPaletteValid =
    !!value.colorPalette && Object.hasOwn(colorPalettes, value.colorPalette);

  return {
    textSpeedMultiplier: clampMultiplier(
      value.textSpeedMultiplier ?? defaultReaderSettings.textSpeedMultiplier,
    ),
    dialogueDelayMultiplier: clampMultiplier(
      value.dialogueDelayMultiplier ??
        defaultReaderSettings.dialogueDelayMultiplier,
    ),
    contextDelayMultiplier: clampMultiplier(
      value.contextDelayMultiplier ?? defaultReaderSettings.contextDelayMultiplier,
    ),
    autoplay: value.autoplay ?? defaultReaderSettings.autoplay,
    fontScale: clampFontScale(value.fontScale ?? defaultReaderSettings.fontScale),
    accessibilityMode: allowedAccessibilityModes.has(
      value.accessibilityMode ?? "default",
    )
      ? (value.accessibilityMode as ReaderSettings["accessibilityMode"])
      : defaultReaderSettings.accessibilityMode,
    colorPalette: isPaletteValid
      ? (value.colorPalette as ColorPaletteId)
      : defaultReaderSettings.colorPalette,
  };
}

export function loadReaderSettings(): ReaderSettings {
  if (typeof window === "undefined") {
    return defaultReaderSettings;
  }

  const rawValue = window.localStorage.getItem(READER_SETTINGS_STORAGE_KEY);
  if (!rawValue) {
    return defaultReaderSettings;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<ReaderSettings>;
    return sanitizeReaderSettings(parsed);
  } catch {
    return defaultReaderSettings;
  }
}

export function saveReaderSettings(nextSettings: ReaderSettings): void {
  if (typeof window === "undefined") {
    return;
  }

  const safeSettings = sanitizeReaderSettings(nextSettings);
  window.localStorage.setItem(
    READER_SETTINGS_STORAGE_KEY,
    JSON.stringify(safeSettings),
  );
  window.dispatchEvent(
    new CustomEvent<ReaderSettings>(READER_SETTINGS_EVENT, {
      detail: safeSettings,
    }),
  );
}
