export type BackgroundMode = "light" | "dark";

export interface ClockColorOption {
  id: string;
  name: string;
  hex: string;
}

/**
 * Ten distinct clock colors calibrated to maintain strong readability
 * against both the light (#FFFFFF) and dark (#09090B) backgrounds,
 * while remaining clearly distinct from both background tones.
 */
export const CLOCK_COLORS: readonly ClockColorOption[] = [
  { id: "blu", name: "Blu", hex: "#3B82F6" },
  { id: "rosso", name: "Rosso", hex: "#EF4444" },
  { id: "verde-smeraldo", name: "Verde Smeraldo", hex: "#059669" },
  { id: "ambra", name: "Ambra", hex: "#D97706" },
  { id: "viola", name: "Viola", hex: "#8B5CF6" },
  { id: "azzurro", name: "Azzurro", hex: "#0284C7" },
  { id: "magenta", name: "Magenta", hex: "#DB2777" },
  { id: "arancione", name: "Arancione", hex: "#EA580C" },
  { id: "turchese", name: "Turchese", hex: "#0D9488" },
  { id: "verde-lime", name: "Verde Lime", hex: "#65A30D" },
] as const;

export type ClockColorId = (typeof CLOCK_COLORS)[number]["id"];

export interface BackgroundPalette {
  id: BackgroundMode;
  label: string;
  bg: string;
  surface: string;
  surfaceSubtle: string;
  border: string;
  text: string;
  mutedText: string;
}

export const BACKGROUND_MODES: Record<BackgroundMode, BackgroundPalette> = {
  light: {
    id: "light",
    label: "Chiaro",
    bg: "#FFFFFF",
    surface: "#F4F4F5",
    surfaceSubtle: "#FAFAFA",
    border: "#E4E4E7",
    text: "#18181B",
    mutedText: "#71717A",
  },
  dark: {
    id: "dark",
    label: "Scuro",
    bg: "#09090B",
    surface: "#141418",
    surfaceSubtle: "#111115",
    border: "#27272A",
    text: "#FAFAFA",
    mutedText: "#A1A1AA",
  },
};

export const DEFAULT_CLOCK_COLOR_ID: ClockColorId = "blu";
export const DEFAULT_BACKGROUND_MODE: BackgroundMode = "light";
export const MAX_SCROLL_TEXT_LENGTH = 5000;
export const DEFAULT_SCROLL_TEXT =
  "Benvenuto su OrologioPro — Per personalizzare questo testo scorrevole, scegliere i banner pubblicitari, il colore dell'orologio e lo sfondo chiaro/scuro, visita /settings su questo dispositivo.";
export const BANNER_ROTATION_INTERVAL_MS = 5 * 60 * 1000;

export function getClockColor(id: string): ClockColorOption {
  return CLOCK_COLORS.find((color) => color.id === id) ?? CLOCK_COLORS[0];
}
