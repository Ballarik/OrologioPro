import {
  DEFAULT_FAKE_BANNERS,
  FAKE_BANNERS,
  type FakeBannerId,
} from "@/config/banners";
import {
  CLOCK_COLORS,
  DEFAULT_BACKGROUND_MODE,
  DEFAULT_CLOCK_COLOR_ID,
  DEFAULT_SCROLL_TEXT,
  MAX_SCROLL_TEXT_LENGTH,
  type BackgroundMode,
  type ClockColorId,
} from "@/config/theme";

export const SETTINGS_STORAGE_KEY = "orologiopro_settings_v1";
const SETTINGS_CHANGE_EVENT = "orologiopro-settings-change";

export interface LocalSettings {
  scrollText: string;
  selectedFakeBanners: FakeBannerId[];
  clockColorId: ClockColorId;
  backgroundMode: BackgroundMode;
}

export const DEFAULT_SETTINGS: LocalSettings = {
  scrollText: DEFAULT_SCROLL_TEXT,
  selectedFakeBanners: [...DEFAULT_FAKE_BANNERS],
  clockColorId: DEFAULT_CLOCK_COLOR_ID,
  backgroundMode: DEFAULT_BACKGROUND_MODE,
};

const VALID_FAKE_IDS = new Set<string>(FAKE_BANNERS.map((b) => b.id));
const VALID_COLOR_IDS = new Set<string>(CLOCK_COLORS.map((c) => c.id));

export function sanitizeSettings(raw: unknown): LocalSettings {
  if (!raw || typeof raw !== "object") {
    return {
      ...DEFAULT_SETTINGS,
      selectedFakeBanners: [...DEFAULT_SETTINGS.selectedFakeBanners],
    };
  }

  const record = raw as Record<string, unknown>;

  const scrollText =
    typeof record.scrollText === "string"
      ? record.scrollText.slice(0, MAX_SCROLL_TEXT_LENGTH)
      : DEFAULT_SCROLL_TEXT;

  const rawBanners = Array.isArray(record.selectedFakeBanners)
    ? record.selectedFakeBanners
    : [];
  const dedupedBanners: FakeBannerId[] = [];
  for (const item of rawBanners) {
    if (
      typeof item === "string" &&
      VALID_FAKE_IDS.has(item) &&
      !dedupedBanners.includes(item as FakeBannerId)
    ) {
      dedupedBanners.push(item as FakeBannerId);
    }
  }
  const selectedFakeBanners =
    dedupedBanners.length > 0 ? dedupedBanners : [...DEFAULT_FAKE_BANNERS];

  const clockColorId =
    typeof record.clockColorId === "string" &&
    VALID_COLOR_IDS.has(record.clockColorId)
      ? (record.clockColorId as ClockColorId)
      : DEFAULT_CLOCK_COLOR_ID;

  const backgroundMode: BackgroundMode =
    record.backgroundMode === "dark" || record.backgroundMode === "light"
      ? record.backgroundMode
      : DEFAULT_BACKGROUND_MODE;

  return {
    scrollText,
    selectedFakeBanners,
    clockColorId,
    backgroundMode,
  };
}

let cachedRaw: string | null | undefined;
let cachedSettings: LocalSettings = DEFAULT_SETTINGS;

export function loadLocalSettings(): LocalSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedSettings;
    }

    cachedRaw = raw;
    if (!raw) {
      cachedSettings = DEFAULT_SETTINGS;
      return cachedSettings;
    }

    cachedSettings = sanitizeSettings(JSON.parse(raw));
    return cachedSettings;
  } catch {
    return cachedSettings;
  }
}

export function saveLocalSettings(next: LocalSettings): LocalSettings {
  const sanitized = sanitizeSettings(next);
  if (typeof window === "undefined") {
    return sanitized;
  }

  try {
    const serialized = JSON.stringify(sanitized);
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, serialized);
    cachedRaw = serialized;
    cachedSettings = sanitized;
    document.documentElement.dataset.theme = sanitized.backgroundMode;
    window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT));
  } catch {
    // Ignore storage quota or private-mode errors gracefully.
  }

  return sanitized;
}

export function subscribeLocalSettings(onChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === SETTINGS_STORAGE_KEY) {
      onChange();
    }
  };
  const handleCustom = () => onChange();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(SETTINGS_CHANGE_EVENT, handleCustom);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SETTINGS_CHANGE_EVENT, handleCustom);
  };
}
