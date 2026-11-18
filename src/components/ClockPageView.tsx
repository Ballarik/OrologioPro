"use client";

import { useEffect, useMemo, useState } from "react";
import { BannerSlot } from "@/components/BannerSlot";
import { ClockDisplay } from "@/components/ClockDisplay";
import { FullscreenButton } from "@/components/FullscreenButton";
import { MarqueeText } from "@/components/MarqueeText";
import {
  REAL_BANNERS,
  getFakeBannerById,
  type BannerConfig,
} from "@/config/banners";
import {
  BANNER_ROTATION_INTERVAL_MS,
  getClockColor,
} from "@/config/theme";
import { useLocalSettings } from "@/lib/useLocalSettings";

interface ClockPageViewProps {
  mode: "fake" | "real";
}

export function ClockPageView({ mode }: ClockPageViewProps) {
  const { settings, mounted } = useLocalSettings();
  const [rotation, setRotation] = useState<{ key: string; index: number }>({
    key: "",
    index: 0,
  });

  const banners: readonly BannerConfig[] = useMemo(() => {
    if (mode === "real") {
      return REAL_BANNERS;
    }
    return settings.selectedFakeBanners.map(getFakeBannerById);
  }, [mode, settings.selectedFakeBanners]);

  const bannersKey = banners.map((b) => b.id).join(",");

  useEffect(() => {
    if (banners.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setRotation((prev) => ({
        key: bannersKey,
        index:
          ((prev.key === bannersKey ? prev.index : 0) + 1) % banners.length,
      }));
    }, BANNER_ROTATION_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [bannersKey, banners.length]);

  const bannerIndex = rotation.key === bannersKey ? rotation.index : 0;
  const activeBanner = banners[bannerIndex % banners.length] ?? banners[0];
  const clockColor = getClockColor(settings.clockColorId);

  return (
    <main className="relative flex min-h-dvh w-full flex-col items-center gap-6 bg-[var(--app-bg)] px-4 pt-6 pb-4 text-[var(--app-text)] transition-colors duration-300 sm:px-8 sm:pt-8 sm:pb-6">
      <FullscreenButton />

      <div className="flex w-full max-w-6xl flex-1 items-center justify-center py-4">
        <ClockDisplay colorHex={clockColor.hex} mounted={mounted} />
      </div>

      <section
        className={`flex w-full max-w-[760px] shrink-0 flex-col items-center gap-0 transition-opacity duration-200 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Spazio pubblicitario"
      >
        <BannerSlot banner={activeBanner} />

        {mode === "fake" && <MarqueeText text={settings.scrollText} />}
      </section>
    </main>
  );
}
