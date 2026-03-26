import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useReaderSpeech } from "@/screens/reader/hooks/useReaderSpeech";

class MockSpeechSynthesisUtterance {
  text: string;
  lang = "";
  voice?: SpeechSynthesisVoice;
  onend: null | (() => void) = null;
  onerror: null | (() => void) = null;

  constructor(text: string) {
    this.text = text;
  }
}

class MockAudio {
  static instances: MockAudio[] = [];
  src = "";
  play = vi.fn<() => Promise<void>>();

  constructor(src?: string) {
    this.src = src ?? "";
    this.play.mockResolvedValue(undefined);
    MockAudio.instances.push(this);
  }
}

describe("useReaderSpeech", () => {
  const originalSpeechSynthesis = window.speechSynthesis;
  const originalUtterance = globalThis.SpeechSynthesisUtterance;
  const originalAudio = globalThis.Audio;
  const originalFetch = globalThis.fetch;

  it("uses browser TTS when available", async () => {
    const fetchMock = vi.fn();
    const cancel = vi.fn();
    const speak = vi.fn((utterance: MockSpeechSynthesisUtterance) => {
      utterance.onend?.();
    });

    Object.defineProperty(window, "speechSynthesis", {
      value: {
        cancel,
        getVoices: () => [{ name: "alloy", lang: "pt-BR" }],
        speak,
      },
      configurable: true,
    });
    globalThis.SpeechSynthesisUtterance =
      MockSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance;
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(() =>
      useReaderSpeech({
        speechText: "fala de teste",
        audioVoice: "alloy",
      }),
    );

    await act(async () => {
      await result.current.speakCurrentContent();
    });

    expect(speak).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.audioError).toBeNull();
    expect(result.current.isAudioLoading).toBe(false);
  });

  it("falls back to cloud TTS when browser TTS fails", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ audioBase64: "ZmFrZQ==", mimeType: "audio/mpeg" }),
    }));
    const speak = vi.fn((utterance: MockSpeechSynthesisUtterance) => {
      utterance.onerror?.();
    });

    MockAudio.instances = [];
    Object.defineProperty(window, "speechSynthesis", {
      value: {
        cancel: vi.fn(),
        getVoices: () => [],
        speak,
      },
      configurable: true,
    });
    globalThis.SpeechSynthesisUtterance =
      MockSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance;
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    globalThis.Audio = MockAudio as unknown as typeof Audio;

    const { result } = renderHook(() =>
      useReaderSpeech({
        speechText: "fallback",
        audioVoice: "alloy",
      }),
    );

    await act(async () => {
      await result.current.speakCurrentContent();
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(MockAudio.instances[0]?.src).toContain("data:audio/mpeg;base64,");
    expect(result.current.audioError).toBeNull();
  });

  it("exposes error when browser and cloud TTS both fail", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: false,
      json: async () => ({ error: "provider down" }),
    }));
    const speak = vi.fn((utterance: MockSpeechSynthesisUtterance) => {
      utterance.onerror?.();
    });

    Object.defineProperty(window, "speechSynthesis", {
      value: {
        cancel: vi.fn(),
        getVoices: () => [],
        speak,
      },
      configurable: true,
    });
    globalThis.SpeechSynthesisUtterance =
      MockSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance;
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(() =>
      useReaderSpeech({
        speechText: "falha total",
        audioVoice: "alloy",
      }),
    );

    await act(async () => {
      await result.current.speakCurrentContent();
    });

    await waitFor(() => {
      expect(result.current.audioError).toBe("Nao foi possivel tocar o audio agora.");
    });
    expect(result.current.isAudioLoading).toBe(false);
  });

  afterEach(() => {
    Object.defineProperty(window, "speechSynthesis", {
      value: originalSpeechSynthesis,
      configurable: true,
    });
    globalThis.SpeechSynthesisUtterance = originalUtterance;
    globalThis.Audio = originalAudio;
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });
});
