"use client";

import Link from "next/link";
import { useMemo } from "react";

import { colorPalettes } from "@/lib/theme/colorPalettes";
import {
  updateReaderSettings,
  useReaderSettings,
} from "@/stores/reader-settings";
import styles from "./SettingsScreen.module.css";

function toDisplayValue(value: number): string {
  return `${value.toFixed(2)}x`;
}

export function SettingsScreen() {
  const settings = useReaderSettings();

  const values = useMemo(
    () => ({
      textSpeed: toDisplayValue(settings.textSpeedMultiplier),
      dialogueDelay: toDisplayValue(settings.dialogueDelayMultiplier),
      contextDelay: toDisplayValue(settings.contextDelayMultiplier),
      fontScale: toDisplayValue(settings.fontScale),
      ambientVolume: `${Math.round(settings.ambientAudioVolume * 100)}%`,
    }),
    [settings],
  );

  return (
    <main className={`${styles.main} min-h-screen px-4 py-8`}>
      <section className={`${styles.panel} mx-auto max-w-3xl rounded-2xl p-5 backdrop-blur-md`}>
        <h1 className="mb-4 text-2xl font-bold">Configuracoes de leitura</h1>

        <div className="mb-4 grid gap-2">
          <label className="text-sm" htmlFor="text-speed">
            Velocidade de aparicao do texto
          </label>
          <input
            id="text-speed"
            type="range"
            min="0.25"
            max="3"
            step="0.05"
            value={settings.textSpeedMultiplier}
            onChange={(event) =>
              updateReaderSettings({
                textSpeedMultiplier: Number(event.target.value),
              })
            }
          />
          <span className={`${styles.mutedText} text-xs`}>{values.textSpeed}</span>
        </div>

        <div className="mb-4 grid gap-2">
          <label className="text-sm" htmlFor="dialogue-delay">
            Velocidade de troca de dialogos
          </label>
          <input
            id="dialogue-delay"
            type="range"
            min="0.25"
            max="3"
            step="0.05"
            value={settings.dialogueDelayMultiplier}
            onChange={(event) =>
              updateReaderSettings({
                dialogueDelayMultiplier: Number(event.target.value),
              })
            }
          />
          <span className={`${styles.mutedText} text-xs`}>
            {values.dialogueDelay}
          </span>
        </div>

        <div className="mb-4 grid gap-2">
          <label className="text-sm" htmlFor="context-delay">
            Velocidade de troca de contextos
          </label>
          <input
            id="context-delay"
            type="range"
            min="0.25"
            max="3"
            step="0.05"
            value={settings.contextDelayMultiplier}
            onChange={(event) =>
              updateReaderSettings({
                contextDelayMultiplier: Number(event.target.value),
              })
            }
          />
          <span className={`${styles.mutedText} text-xs`}>
            {values.contextDelay}
          </span>
        </div>

        <div className="mb-4 grid gap-2">
          <label className="text-sm" htmlFor="font-scale">
            Tamanho de fonte global
          </label>
          <input
            id="font-scale"
            type="range"
            min="0.85"
            max="1.6"
            step="0.05"
            value={settings.fontScale}
            onChange={(event) =>
              updateReaderSettings({
                fontScale: Number(event.target.value),
              })
            }
          />
          <span className={`${styles.mutedText} text-xs`}>{values.fontScale}</span>
        </div>

        <div className="mb-4 grid gap-2">
          <label className="text-sm" htmlFor="accessibility-mode">
            Modo de acessibilidade
          </label>
          <select
            id="accessibility-mode"
            value={settings.accessibilityMode}
            className={`${styles.selectSurface} rounded-md px-3 py-2`}
            onChange={(event) =>
              updateReaderSettings({
                accessibilityMode: event.target.value as
                  | "default"
                  | "high-contrast"
                  | "reduced-motion",
              })
            }
          >
            <option value="default">Padrao</option>
            <option value="high-contrast">Alto contraste</option>
            <option value="reduced-motion">Reducao de movimento</option>
          </select>
        </div>

        <div className="mb-4 grid gap-2">
          <label className="text-sm" htmlFor="color-system">
            Sistema de cores (5 opcoes)
          </label>
          <select
            id="color-system"
            value={settings.colorPalette}
            className={`${styles.selectSurface} rounded-md px-3 py-2`}
            onChange={(event) =>
              updateReaderSettings({
                colorPalette: event.target.value as keyof typeof colorPalettes,
              })
            }
          >
            {Object.entries(colorPalettes).map(([id, palette]) => (
              <option key={id} value={id}>
                {palette.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2 grid gap-2">
          <label className="text-sm" htmlFor="autoplay">
            Autoplay habilitado por padrao
          </label>
          <input
            id="autoplay"
            type="checkbox"
            checked={settings.autoplay}
            onChange={(event) =>
              updateReaderSettings({
                autoplay: event.target.checked,
              })
            }
          />
        </div>

        <div className="mb-4 mt-4 grid gap-2">
          <label className="text-sm" htmlFor="ambient-audio-enabled">
            Permitir musica ambiente na leitura
          </label>
          <input
            id="ambient-audio-enabled"
            type="checkbox"
            checked={settings.ambientAudioEnabled}
            onChange={(event) =>
              updateReaderSettings({
                ambientAudioEnabled: event.target.checked,
              })
            }
          />
        </div>

        <div className="mb-2 grid gap-2">
          <label className="text-sm" htmlFor="ambient-audio-volume">
            Volume da musica ambiente
          </label>
          <input
            id="ambient-audio-volume"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.ambientAudioVolume}
            disabled={!settings.ambientAudioEnabled}
            onChange={(event) =>
              updateReaderSettings({
                ambientAudioVolume: Number(event.target.value),
              })
            }
          />
          <span className={`${styles.mutedText} text-xs`}>{values.ambientVolume}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link className={`${styles.backLink} underline`} href="/">
            Voltar para leitura
          </Link>
        </div>
      </section>
    </main>
  );
}
