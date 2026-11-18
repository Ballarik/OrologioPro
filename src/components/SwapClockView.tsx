"use client";

import { useEffect, useState } from "react";
import { ClockPageView } from "@/components/ClockPageView";
import { SWAP_FAKE_DURATION_MS, SWAP_REAL_DURATION_MS } from "@/config/theme";

const SWAP_CYCLE_DURATION_MS = SWAP_REAL_DURATION_MS + SWAP_FAKE_DURATION_MS;

export function SwapClockView() {
  const [activeMode, setActiveMode] = useState<"real" | "fake">("real");

  useEffect(() => {
    const startedAt = Date.now();

    const intervalId = window.setInterval(() => {
      const positionInCycle =
        (Date.now() - startedAt) % SWAP_CYCLE_DURATION_MS;
      const nextMode =
        positionInCycle < SWAP_REAL_DURATION_MS ? "real" : "fake";
      setActiveMode((prev) => (prev === nextMode ? prev : nextMode));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return <ClockPageView mode={activeMode} />;
}
