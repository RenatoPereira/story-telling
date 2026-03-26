import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useAmbientSceneAudio } from "@/screens/reader/hooks/useAmbientSceneAudio";

class MockAudio {
  static instances: MockAudio[] = [];

  loop = false;
  preload = "";
  volume = 1;
  currentTime = 0;
  src = "";
  pause = vi.fn();
  removeAttribute = vi.fn();
  load = vi.fn();
  play = vi.fn<() => Promise<void>>();

  constructor() {
    MockAudio.instances.push(this);
  }
}

describe("useAmbientSceneAudio", () => {
  const originalAudio = globalThis.Audio;

  it("returns blocked error when playback fails", async () => {
    MockAudio.instances = [];
    globalThis.Audio = MockAudio as unknown as typeof Audio;

    const { result } = renderHook(() =>
      useAmbientSceneAudio({
        ambientTrack: "/assets/audio/test.wav",
        isSceneAudioEnabled: true,
        ambientAudioEnabled: true,
        ambientAudioVolume: 0.4,
      }),
    );

    const instance = MockAudio.instances[0];
    instance.play.mockRejectedValueOnce(new Error("blocked"));

    window.dispatchEvent(new Event("pointerdown"));

    await waitFor(() => {
      expect(result.current.ambientAudioError).toBe(
        "A musica ambiente foi bloqueada. Permita audio no navegador para reproduzir.",
      );
    });
  });

  it("pauses when ambient audio should not play", () => {
    MockAudio.instances = [];
    globalThis.Audio = MockAudio as unknown as typeof Audio;

    renderHook(() =>
      useAmbientSceneAudio({
        ambientTrack: "",
        isSceneAudioEnabled: false,
        ambientAudioEnabled: false,
        ambientAudioVolume: 0.2,
      }),
    );

    const instance = MockAudio.instances[0];
    expect(instance.pause).toHaveBeenCalled();
  });

  it("sets track url and clears blocking state when playback succeeds", async () => {
    MockAudio.instances = [];
    globalThis.Audio = MockAudio as unknown as typeof Audio;

    const { result } = renderHook(() =>
      useAmbientSceneAudio({
        ambientTrack: "/assets/audio/test.wav",
        isSceneAudioEnabled: true,
        ambientAudioEnabled: true,
        ambientAudioVolume: 0.6,
      }),
    );

    const instance = MockAudio.instances[0];
    instance.play.mockResolvedValue(undefined);

    window.dispatchEvent(new Event("keydown"));

    await waitFor(() => {
      expect(instance.src).toContain("/assets/audio/test.wav");
      expect(instance.volume).toBe(0.6);
      expect(result.current.ambientAudioError).toBeNull();
    });
  });

  it("cleans up audio element on unmount", () => {
    MockAudio.instances = [];
    globalThis.Audio = MockAudio as unknown as typeof Audio;

    const { unmount } = renderHook(() =>
      useAmbientSceneAudio({
        ambientTrack: "/assets/audio/test.wav",
        isSceneAudioEnabled: true,
        ambientAudioEnabled: true,
        ambientAudioVolume: 0.4,
      }),
    );

    const instance = MockAudio.instances[0];
    unmount();

    expect(instance.pause).toHaveBeenCalled();
    expect(instance.removeAttribute).toHaveBeenCalledWith("src");
    expect(instance.load).toHaveBeenCalled();
  });

  afterEach(() => {
    globalThis.Audio = originalAudio;
    vi.restoreAllMocks();
  });
});
