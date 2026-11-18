"use client";

import { useEffect, useState } from "react";
import { ClockPageView } from "@/components/ClockPageView";
import { SWAP_INTERVAL_MS } from "@/config/theme";

export function SwapClockView() {
  const [activeMode, setActiveMode] = useState<"real" | "fake">("real");

  useEffect(() => {
    const startedAt = Date.now();

    const intervalId = window.setInterval(() => {
      const cycleIndex = Math.floor((Date.now() - startedAt) / SWAP_INTERVAL_MS);
      const nextMode = cycleIndex % 2 === 0 ? "real" : "fake";
      setActiveMode((prev) => (prev === nextMode ? prev : nextMode));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return <ClockPageView mode={activeMode} />;
}
