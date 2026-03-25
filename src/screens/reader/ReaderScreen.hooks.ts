"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ReplaceFn = (href: string, options?: { scroll?: boolean }) => void;

type UseReaderKeyboardNavigationParams = {
  canContinue: boolean;
  continueFlow: () => void;
  nextBlock: () => void;
  previousBlock: () => void;
};

type UseAmbientSceneAudioParams = {
  ambientTrack: string;
  isSceneAudioEnabled: boolean;
  ambientAudioEnabled: boolean;
  ambientAudioVolume: number;
};

type UseReaderSpeechParams = {
  speechText: string;
  audioVoice: string;
};

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

export function useReaderSpeech({ speechText, audioVoice }: UseReaderSpeechParams) {
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        return;
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakWithBrowserTts = useCallback(
    async (text: string, preferredVoice: string) => {
      if (
        typeof window === "undefined" ||
        typeof window.SpeechSynthesisUtterance === "undefined" ||
        !("speechSynthesis" in window)
      ) {
        throw new Error("Browser TTS indisponivel.");
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";

      const availableVoices = window.speechSynthesis.getVoices();
      const normalizedPreferredVoice = preferredVoice.trim().toLowerCase();
      const selectedVoice =
        availableVoices.find(
          (voice) => voice.name.trim().toLowerCase() === normalizedPreferredVoice,
        ) ??
        availableVoices.find((voice) =>
          voice.lang.toLowerCase().startsWith("pt"),
        );

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      }

      await new Promise<void>((resolve, reject) => {
        utterance.onend = () => resolve();
        utterance.onerror = () => reject(new Error("Falha no browser TTS."));
        window.speechSynthesis.speak(utterance);
      });
    },
    [],
  );

  const speakWithCloudTts = useCallback(async (text: string, voice: string) => {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice,
      }),
    });

    const payload = (await response.json()) as
      | { audioBase64: string; mimeType: string }
      | { error: string };

    if (!response.ok || "error" in payload) {
      throw new Error("Falha ao gerar audio.");
    }

    const audio = new Audio(`data:${payload.mimeType};base64,${payload.audioBase64}`);
    await audio.play();
  }, []);

  const speakCurrentContent = useCallback(async () => {
    setAudioError(null);
    setIsAudioLoading(true);

    try {
      await speakWithBrowserTts(speechText, audioVoice);
    } catch {
      try {
        await speakWithCloudTts(speechText, audioVoice);
      } catch {
        setAudioError("Nao foi possivel tocar o audio agora.");
      }
    } finally {
      setIsAudioLoading(false);
    }
  }, [audioVoice, speakWithBrowserTts, speakWithCloudTts, speechText]);

  return {
    isAudioLoading,
    audioError,
    speakCurrentContent,
  };
}
