"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  DEFAULT_SETTINGS,
  loadLocalSettings,
  saveLocalSettings,
  subscribeLocalSettings,
  type LocalSettings,
} from "@/lib/settingsStorage";

const emptySubscribe = () => () => {};
const getServerSnapshot = () => DEFAULT_SETTINGS;

export function useLocalSettings() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const settings = useSyncExternalStore(
    subscribeLocalSettings,
    loadLocalSettings,
    getServerSnapshot
  );

  useEffect(() => {
    document.documentElement.dataset.theme = settings.backgroundMode;
  }, [settings.backgroundMode]);

  const updateSettings = useCallback(
    (updater: LocalSettings | ((prev: LocalSettings) => LocalSettings)) => {
      const current = loadLocalSettings();
      const next = typeof updater === "function" ? updater(current) : updater;
      saveLocalSettings(next);
    },
    []
  );

  return { settings, updateSettings, mounted };
}
