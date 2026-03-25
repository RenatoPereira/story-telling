"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

import {
  READER_SETTINGS_STORAGE_KEY,
  defaultReaderSettings,
  sanitizeReaderSettings,
  type ReaderSettings,
} from "@/stores/reader-settings/settings";

type ReaderSettingsStore = ReaderSettings & {
  patchSettings: (patch: Partial<ReaderSettings>) => void;
  replaceSettings: (nextSettings: ReaderSettings) => void;
};

function pickReaderSettings(state: ReaderSettingsStore): ReaderSettings {
  return {
    textSpeedMultiplier: state.textSpeedMultiplier,
    dialogueDelayMultiplier: state.dialogueDelayMultiplier,
    contextDelayMultiplier: state.contextDelayMultiplier,
    autoplay: state.autoplay,
    fontScale: state.fontScale,
    ambientAudioEnabled: state.ambientAudioEnabled,
    ambientAudioVolume: state.ambientAudioVolume,
    accessibilityMode: state.accessibilityMode,
    colorPalette: state.colorPalette,
  };
}

const useReaderSettingsStore = create<ReaderSettingsStore>()(
  persist(
    (set) => ({
      ...defaultReaderSettings,
      patchSettings: (patch) =>
        set((currentState) =>
          sanitizeReaderSettings({
            ...pickReaderSettings(currentState),
            ...patch,
          }),
        ),
      replaceSettings: (nextSettings) =>
        set(() => sanitizeReaderSettings(nextSettings)),
    }),
    {
      name: READER_SETTINGS_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => pickReaderSettings(state),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...sanitizeReaderSettings((persistedState as Partial<ReaderSettings>) ?? {}),
      }),
    },
  ),
);

export function useReaderSettings(): ReaderSettings {
  return useReaderSettingsStore(useShallow(pickReaderSettings));
}

export function updateReaderSettings(patch: Partial<ReaderSettings>): void {
  useReaderSettingsStore.getState().patchSettings(patch);
}

export function saveReaderSettings(nextSettings: ReaderSettings): void {
  useReaderSettingsStore.getState().replaceSettings(nextSettings);
}
