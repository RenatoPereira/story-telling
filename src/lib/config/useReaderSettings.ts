"use client";

import { useSyncExternalStore } from "react";

import {
  READER_SETTINGS_EVENT,
  READER_SETTINGS_STORAGE_KEY,
  defaultReaderSettings,
  loadReaderSettings,
  type ReaderSettings,
} from "@/lib/config/readerSettings";

let cachedSnapshot: ReaderSettings = defaultReaderSettings;
let didHydrateSnapshot = false;

function readSnapshotFromStorage(): ReaderSettings {
  if (typeof window === "undefined") {
    return defaultReaderSettings;
  }

  const nextSnapshot = loadReaderSettings();
  const currentSerialized = JSON.stringify(cachedSnapshot);
  const nextSerialized = JSON.stringify(nextSnapshot);

  if (currentSerialized !== nextSerialized) {
    cachedSnapshot = nextSnapshot;
  }

  return cachedSnapshot;
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onReaderSettingsEvent = () => {
    readSnapshotFromStorage();
    onStoreChange();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === READER_SETTINGS_STORAGE_KEY) {
      readSnapshotFromStorage();
      onStoreChange();
    }
  };

  window.addEventListener(READER_SETTINGS_EVENT, onReaderSettingsEvent);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(READER_SETTINGS_EVENT, onReaderSettingsEvent);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): ReaderSettings {
  if (!didHydrateSnapshot) {
    cachedSnapshot = readSnapshotFromStorage();
    didHydrateSnapshot = true;
  }
  return cachedSnapshot;
}

function getServerSnapshot(): ReaderSettings {
  return defaultReaderSettings;
}

export function useReaderSettings(): ReaderSettings {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
