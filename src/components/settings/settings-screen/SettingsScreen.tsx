"use client";

import Link from "next/link";
import { useMemo } from "react";

import {
  saveReaderSettings,
} from "@/lib/config/readerSettings";
import { useReaderSettings } from "@/lib/config/useReaderSettings";
import { colorPalettes } from "@/lib/theme/colorPalettes";

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
    }),
    [settings],
  );

  return (
    <main className="min-h-screen bg-[var(--app-bg)] px-4 py-8 text-[var(--app-fg)]">
      <section className="mx-auto max-w-3xl rounded-2xl bg-[var(--app-panel)] p-5 backdrop-blur-md">
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
              saveReaderSettings({
                ...settings,
                textSpeedMultiplier: Number(event.target.value),
              })
            }
          />
          <span className="text-xs text-[var(--app-muted)]">{values.textSpeed}</span>
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
              saveReaderSettings({
                ...settings,
                dialogueDelayMultiplier: Number(event.target.value),
              })
            }
          />
          <span className="text-xs text-[var(--app-muted)]">
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
              saveReaderSettings({
                ...settings,
                contextDelayMultiplier: Number(event.target.value),
              })
            }
          />
          <span className="text-xs text-[var(--app-muted)]">
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
              saveReaderSettings({
                ...settings,
                fontScale: Number(event.target.value),
              })
            }
          />
          <span className="text-xs text-[var(--app-muted)]">{values.fontScale}</span>
        </div>

        <div className="mb-4 grid gap-2">
          <label className="text-sm" htmlFor="accessibility-mode">
            Modo de acessibilidade
          </label>
          <select
            id="accessibility-mode"
            value={settings.accessibilityMode}
            className="rounded-md bg-[var(--app-panel-strong)] px-3 py-2"
            onChange={(event) =>
              saveReaderSettings({
                ...settings,
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
            className="rounded-md bg-[var(--app-panel-strong)] px-3 py-2"
            onChange={(event) =>
              saveReaderSettings({
                ...settings,
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
              saveReaderSettings({
                ...settings,
                autoplay: event.target.checked,
              })
            }
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="text-[var(--app-accent)] underline" href="/">
            Voltar para leitura
          </Link>
        </div>
      </section>
    </main>
  );
}
