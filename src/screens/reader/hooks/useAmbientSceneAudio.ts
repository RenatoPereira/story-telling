"use client";

import { useEffect, useRef, useState } from "react";

type UseAmbientSceneAudioParams = {
  ambientTrack: string;
  isSceneAudioEnabled: boolean;
  ambientAudioEnabled: boolean;
  ambientAudioVolume: number;
};

export function useAmbientSceneAudio({
  ambientTrack,
  isSceneAudioEnabled,
  ambientAudioEnabled,
  ambientAudioVolume,
}: UseAmbientSceneAudioParams) {
  const [isAmbientAudioBlocked, setIsAmbientAudioBlocked] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const shouldAttemptAmbientAudio =
    ambientAudioEnabled && isSceneAudioEnabled && ambientTrack.length > 0;

  useEffect(() => {
    const markInteraction = () => setHasUserInteracted(true);
    window.addEventListener("pointerdown", markInteraction, { once: true });
    window.addEventListener("keydown", markInteraction, { once: true });
    window.addEventListener("touchstart", markInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", markInteraction);
      window.removeEventListener("keydown", markInteraction);
      window.removeEventListener("touchstart", markInteraction);
    };
  }, []);

  useEffect(() => {
    const ambientAudio = new Audio();
    ambientAudio.loop = true;
    ambientAudio.preload = "auto";
    ambientAudioRef.current = ambientAudio;

    return () => {
      ambientAudio.pause();
      ambientAudio.removeAttribute("src");
      ambientAudio.load();
      ambientAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const ambientAudio = ambientAudioRef.current;
    if (!ambientAudio) {
      return;
    }

    ambientAudio.volume = ambientAudioVolume;

    if (!shouldAttemptAmbientAudio) {
      ambientAudio.pause();
      return;
    }

    const nextTrackUrl = new URL(ambientTrack, window.location.origin).href;
    const didTrackChange = ambientAudio.src !== nextTrackUrl;

    if (didTrackChange) {
      ambientAudio.src = nextTrackUrl;
      ambientAudio.currentTime = 0;
    }

    const playPromise = ambientAudio.play();
    if (playPromise) {
      playPromise
        .then(() => {
          setIsAmbientAudioBlocked(false);
        })
        .catch(() => {
          setIsAmbientAudioBlocked(true);
        });
    }
  }, [
    ambientTrack,
    ambientAudioEnabled,
    ambientAudioVolume,
    hasUserInteracted,
    isSceneAudioEnabled,
    shouldAttemptAmbientAudio,
  ]);

  return {
    ambientAudioError:
      shouldAttemptAmbientAudio && isAmbientAudioBlocked
        ? "A musica ambiente foi bloqueada. Permita audio no navegador para reproduzir."
        : null,
  };
}
