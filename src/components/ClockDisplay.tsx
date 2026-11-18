"use client";

import { useEffect, useState } from "react";

interface ClockDisplayProps {
  colorHex: string;
  size?: "hero" | "preview";
  mounted?: boolean;
}

interface TimeParts {
  hours: string;
  minutes: string;
  seconds: string;
}

function formatTime24(date: Date): TimeParts {
  return {
    hours: String(date.getHours()).padStart(2, "0"),
    minutes: String(date.getMinutes()).padStart(2, "0"),
    seconds: String(date.getSeconds()).padStart(2, "0"),
  };
}

export function ClockDisplay({
  colorHex,
  size = "hero",
  mounted = true,
}: ClockDisplayProps) {
  const [time, setTime] = useState<TimeParts | null>(null);

  useEffect(() => {
    const update = () => {
      setTime(formatTime24(new Date()));
    };

    update();
    const intervalId = window.setInterval(update, 200);
    return () => window.clearInterval(intervalId);
  }, []);

  const isVisible = mounted && time !== null;
  const display = time ?? { hours: "00", minutes: "00", seconds: "00" };

  const sizeClass =
    size === "hero"
      ? "text-[clamp(3.5rem,15vw,10.5rem)] leading-none"
      : "text-[clamp(2.25rem,7vw,4rem)] leading-none";

  return (
    <time
      aria-label="Orologio 24 ore"
      className={`inline-flex items-baseline justify-center font-bold tracking-[-0.03em] tabular-nums select-none transition-colors duration-300 ${sizeClass} ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ color: colorHex }}
    >
      <span className="inline-block w-[2.1ch] text-center">{display.hours}</span>
      <span className="inline-block px-[0.06em] opacity-85">:</span>
      <span className="inline-block w-[2.1ch] text-center">
        {display.minutes}
      </span>
      <span className="inline-block px-[0.06em] opacity-85">:</span>
      <span className="inline-block w-[2.1ch] text-center">
        {display.seconds}
      </span>
    </time>
  );
}
