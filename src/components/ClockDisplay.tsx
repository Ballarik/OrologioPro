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
  dateLabel: string;
}

const IT_WEEKDAYS = [
  "Domenica",
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
] as const;

const IT_MONTHS = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
] as const;

function formatTime24(date: Date): TimeParts {
  const weekday = IT_WEEKDAYS[date.getDay()];
  const day = date.getDate();
  const month = IT_MONTHS[date.getMonth()];
  const year = date.getFullYear();

  return {
    hours: String(date.getHours()).padStart(2, "0"),
    minutes: String(date.getMinutes()).padStart(2, "0"),
    seconds: String(date.getSeconds()).padStart(2, "0"),
    dateLabel: `${weekday} ${day} ${month} ${year}`,
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
  const display = time ?? {
    hours: "00",
    minutes: "00",
    seconds: "00",
    dateLabel: "\u00A0",
  };

  const fontSize =
    size === "hero"
      ? "clamp(3.5rem, min(17.5vw, 32dvh), 13.5rem)"
      : "clamp(2.5rem, 7.5vw, 4.5rem)";

  const dateSizeClass =
    size === "hero"
      ? "mb-2 text-base sm:mb-3 sm:text-2xl md:text-3xl"
      : "mb-1 text-xs sm:text-sm";

  return (
    <div
      className={`flex flex-col items-center select-none transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <p
        className={`text-center font-semibold tracking-wide transition-colors duration-300 ${dateSizeClass}`}
        style={{ color: colorHex, opacity: 0.85 }}
      >
        {display.dateLabel}
      </p>

      <time
        aria-label="Orologio 24 ore"
        className="inline-flex items-baseline justify-center leading-none font-bold tracking-[-0.03em] tabular-nums transition-colors duration-300"
        style={{ color: colorHex, fontSize }}
      >
        <span className="inline-block w-[2.1ch] text-center">
          {display.hours}
        </span>
        <span className="inline-block px-[0.06em] opacity-85">:</span>
        <span className="inline-block w-[2.1ch] text-center">
          {display.minutes}
        </span>
        <span className="inline-block px-[0.06em] opacity-85">:</span>
        <span className="inline-block w-[2.1ch] text-center">
          {display.seconds}
        </span>
      </time>
    </div>
  );
}
