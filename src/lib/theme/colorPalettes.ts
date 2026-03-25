export const colorPalettes = {
  moonlight: {
    label: "Moonlight",
    colors: {
      appBg: "#090d1a",
      appFg: "#f4f6ff",
      panel: "rgb(10 14 24 / 82%)",
      panelStrong: "rgb(7 10 18 / 90%)",
      muted: "#c7cff5",
      accent: "#8fb2ff",
      danger: "#ffb4b4",
      overlay: "rgb(0 0 0 / 52%)",
    },
  },
  sepia: {
    label: "Sepia",
    colors: {
      appBg: "#231a12",
      appFg: "#f7eddc",
      panel: "rgb(44 33 24 / 82%)",
      panelStrong: "rgb(36 26 19 / 90%)",
      muted: "#dfceb1",
      accent: "#f2be7d",
      danger: "#ffb7a8",
      overlay: "rgb(20 12 6 / 50%)",
    },
  },
  forest: {
    label: "Forest",
    colors: {
      appBg: "#0f1f1a",
      appFg: "#eafbf1",
      panel: "rgb(17 37 29 / 82%)",
      panelStrong: "rgb(12 29 23 / 90%)",
      muted: "#bad8ca",
      accent: "#8de4b5",
      danger: "#ffb8c5",
      overlay: "rgb(0 0 0 / 54%)",
    },
  },
  ocean: {
    label: "Ocean",
    colors: {
      appBg: "#0d1a2c",
      appFg: "#edf5ff",
      panel: "rgb(18 35 60 / 82%)",
      panelStrong: "rgb(14 28 49 / 90%)",
      muted: "#bdd3f5",
      accent: "#8cc6ff",
      danger: "#ffb4b4",
      overlay: "rgb(0 0 0 / 54%)",
    },
  },
  sunrise: {
    label: "Sunrise",
    colors: {
      appBg: "#2b1418",
      appFg: "#fff1e7",
      panel: "rgb(53 28 32 / 82%)",
      panelStrong: "rgb(43 22 26 / 90%)",
      muted: "#efc7be",
      accent: "#ffb58c",
      danger: "#ffceae",
      overlay: "rgb(0 0 0 / 55%)",
    },
  },
} as const;

export type ColorPaletteId = keyof typeof colorPalettes;

export const defaultColorPalette: ColorPaletteId = "moonlight";
