"use client";

import { useCallback, useEffect, useState } from "react";

type UseReaderSpeechParams = {
  speechText: string;
  audioVoice: string;
};

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
