"use client";

import Link from "next/link";
import { useState } from "react";
import { BannerSlot } from "@/components/BannerSlot";
import { ClockDisplay } from "@/components/ClockDisplay";
import { MarqueeText } from "@/components/MarqueeText";
import {
  FAKE_BANNERS,
  getFakeBannerById,
  type FakeBannerId,
} from "@/config/banners";
import {
  BACKGROUND_MODES,
  CLOCK_COLORS,
  DEFAULT_SCROLL_TEXT,
  MAX_SCROLL_TEXT_LENGTH,
  getClockColor,
  type BackgroundMode,
  type ClockColorId,
} from "@/config/theme";
import { DEFAULT_SETTINGS } from "@/lib/settingsStorage";
import { useLocalSettings } from "@/lib/useLocalSettings";

export function SettingsView() {
  const { settings, updateSettings, mounted } = useLocalSettings();
  const [minBannerHint, setMinBannerHint] = useState(false);

  const activeClockColor = getClockColor(settings.clockColorId);
  const activeBackground = BACKGROUND_MODES[settings.backgroundMode];
  const previewBanner = getFakeBannerById(settings.selectedFakeBanners[0]);

  const handleTextChange = (value: string) => {
    updateSettings((prev) => ({
      ...prev,
      scrollText: value.slice(0, MAX_SCROLL_TEXT_LENGTH),
    }));
  };

  const handleToggleBanner = (bannerId: FakeBannerId) => {
    setMinBannerHint(false);
    updateSettings((prev) => {
      const exists = prev.selectedFakeBanners.includes(bannerId);
      if (exists) {
        if (prev.selectedFakeBanners.length === 1) {
          setMinBannerHint(true);
          return prev;
        }
        return {
          ...prev,
          selectedFakeBanners: prev.selectedFakeBanners.filter(
            (id) => id !== bannerId
          ),
        };
      }
      return {
        ...prev,
        selectedFakeBanners: [...prev.selectedFakeBanners, bannerId],
      };
    });
  };

  const handleSelectColor = (clockColorId: ClockColorId) => {
    updateSettings((prev) => ({ ...prev, clockColorId }));
  };

  const handleSelectBackground = (backgroundMode: BackgroundMode) => {
    updateSettings((prev) => ({ ...prev, backgroundMode }));
  };

  const handleResetAll = () => {
    setMinBannerHint(false);
    updateSettings({
      ...DEFAULT_SETTINGS,
      selectedFakeBanners: [...DEFAULT_SETTINGS.selectedFakeBanners],
    });
  };

  return (
    <main className="min-h-dvh w-full bg-[var(--app-bg)] px-4 py-8 text-[var(--app-text)] transition-colors duration-300 sm:px-6 sm:py-12">
      <div
        className={`mx-auto flex w-full max-w-3xl flex-col gap-10 transition-opacity duration-200 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <header className="flex flex-col gap-3 border-b border-[var(--app-border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Impostazioni OrologioPro
            </h1>
            <p className="text-sm text-[var(--app-muted)]">
              Le modifiche valgono solo su questo browser/dispositivo e vengono
              salvate automaticamente in locale.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3.5 py-2 text-sm font-medium text-[var(--app-text)] transition hover:opacity-80"
            >
              Apri /
            </Link>
            <Link
              href="/sicuro"
              className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3.5 py-2 text-sm font-medium text-[var(--app-text)] transition hover:opacity-80"
            >
              Apri /sicuro
            </Link>
          </div>
        </header>

        {/* 1. Testo scorrevole */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <label
              htmlFor="scroll-text-input"
              className="text-base font-semibold sm:text-lg"
            >
              Testo che scorre sotto la pubblicità (MAX {MAX_SCROLL_TEXT_LENGTH})
            </label>
            <span className="text-xs font-medium tabular-nums text-[var(--app-muted)]">
              {settings.scrollText.length} / {MAX_SCROLL_TEXT_LENGTH}
            </span>
          </div>

          <textarea
            id="scroll-text-input"
            value={settings.scrollText}
            onChange={(e) => handleTextChange(e.target.value)}
            maxLength={MAX_SCROLL_TEXT_LENGTH}
            rows={4}
            placeholder="Scrivi qui il testo che scorrerà sotto il banner su / (lascia vuoto per nasconderlo)..."
            className="w-full resize-y rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm leading-relaxed text-[var(--app-text)] placeholder:text-[var(--app-muted)] focus:border-blue-500 focus:outline-none sm:text-base"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--app-muted)]">
            <span>
              Appare solo nella pagina principale (<code>/</code>) come
              sottotitolo scorrevole.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleTextChange("")}
                className="font-medium underline-offset-4 hover:underline"
              >
                Cancella testo
              </button>
              <button
                type="button"
                onClick={() => handleTextChange(DEFAULT_SCROLL_TEXT)}
                className="font-medium underline-offset-4 hover:underline"
              >
                Testo istruzioni predefinito
              </button>
            </div>
          </div>
        </section>

        {/* 2. Scelta pubblicità finte */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold sm:text-lg">
              Scegli una pubblicità finta
            </h2>
            <p className="text-sm text-[var(--app-muted)]">
              Seleziona uno o più banner per <code>/</code>. Se ne selezioni più
              di uno, si alternano ogni 5 minuti.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            {FAKE_BANNERS.map((banner) => {
              const orderIndex = settings.selectedFakeBanners.indexOf(
                banner.id
              );
              const isSelected = orderIndex !== -1;

              return (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => handleToggleBanner(banner.id)}
                  aria-pressed={isSelected}
                  className={`group relative w-full rounded-2xl p-1 text-left transition ${
                    isSelected
                      ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-[var(--app-bg)]"
                      : "opacity-75 hover:opacity-100"
                  }`}
                >
                  <BannerSlot banner={banner} compact />
                  <span
                    className={`absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm transition ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "border border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-muted)]"
                    }`}
                  >
                    {isSelected
                      ? settings.selectedFakeBanners.length > 1
                        ? `Selezionata #${orderIndex + 1}`
                        : "Selezionata"
                      : "Seleziona"}
                  </span>
                </button>
              );
            })}
          </div>

          {minBannerHint && (
            <p className="text-sm font-medium text-[#D97706]">
              Deve rimanere almeno una pubblicità finta selezionata.
            </p>
          )}
        </section>

        {/* 3. Sfondo e 10 colori orologio */}
        <section className="flex flex-col gap-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-subtle)] p-5 sm:p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold sm:text-lg">
              Colore dell&apos;orologio e Sfondo
            </h2>
            <p className="text-sm text-[var(--app-muted)]">
              Queste scelte valgono sia per <code>/</code> che per{" "}
              <code>/sicuro</code> su questo dispositivo.
            </p>
          </div>

          {/* Sfondo Chiaro / Scuro */}
          <div className="flex flex-col gap-2.5">
            <span className="text-sm font-medium">Sfondo</span>
            <div className="grid grid-cols-2 gap-3">
              {(["light", "dark"] as const).map((modeKey) => {
                const modeOption = BACKGROUND_MODES[modeKey];
                const isSelected = settings.backgroundMode === modeKey;

                return (
                  <button
                    key={modeKey}
                    type="button"
                    onClick={() => handleSelectBackground(modeKey)}
                    aria-pressed={isSelected}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-500/30"
                        : "border-[var(--app-border)] hover:border-[var(--app-muted)]"
                    }`}
                    style={{
                      backgroundColor: modeOption.bg,
                      color: modeOption.text,
                    }}
                  >
                    <span className="text-sm font-semibold">
                      {modeOption.label}
                    </span>
                    <span
                      className={`h-4 w-4 rounded-full border ${
                        isSelected
                          ? "border-blue-500 bg-blue-500"
                          : "border-current opacity-40"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 10 Colori orologio */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Colore dell&apos;orologio (10 colori)
              </span>
              <span className="text-xs font-medium text-[var(--app-muted)]">
                Attivo: {activeClockColor.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
              {CLOCK_COLORS.map((color) => {
                const isSelected = settings.clockColorId === color.id;

                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => handleSelectColor(color.id)}
                    aria-pressed={isSelected}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition ${
                      isSelected
                        ? "border-blue-500 bg-[var(--app-bg)] ring-2 ring-blue-500/30"
                        : "border-[var(--app-border)] bg-[var(--app-bg)] hover:border-[var(--app-muted)]"
                    }`}
                  >
                    <span
                      className="h-5 w-5 shrink-0 rounded-full border border-black/10"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    />
                    <span className="truncate text-xs font-medium text-[var(--app-text)]">
                      {color.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Anteprima dal vivo */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold sm:text-lg">
              Anteprima dal vivo (<code>/</code>)
            </h2>
            <span className="text-xs text-[var(--app-muted)]">
              Sfondo: {activeBackground.label} • Colore: {activeClockColor.name}
              {settings.selectedFakeBanners.length > 1
                ? ` • Rotazione ${settings.selectedFakeBanners.length} banner (5 min)`
                : ""}
            </span>
          </div>

          <div
            className="flex min-h-[260px] flex-col items-center justify-between gap-6 rounded-2xl border border-[var(--app-border)] px-5 pt-8 pb-4 transition-colors duration-300 sm:min-h-[300px]"
            style={{
              backgroundColor: activeBackground.bg,
              color: activeBackground.text,
            }}
          >
            <div className="flex flex-1 items-center justify-center">
              <ClockDisplay
                colorHex={activeClockColor.hex}
                size="preview"
                mounted={mounted}
              />
            </div>
            <div className="flex w-full max-w-xl shrink-0 flex-col items-center gap-1.5">
              <BannerSlot banner={previewBanner} compact />
              <MarqueeText text={settings.scrollText} />
            </div>
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--app-border)] pt-6">
          <p className="text-xs text-[var(--app-muted)]">
            Archiviazione locale attiva (<code>localStorage</code>). Nessun dato
            viene inviato al server.
          </p>
          <button
            type="button"
            onClick={handleResetAll}
            className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3.5 py-2 text-xs font-semibold text-[var(--app-text)] transition hover:opacity-80"
          >
            Ripristina impostazioni predefinite
          </button>
        </footer>
      </div>
    </main>
  );
}
