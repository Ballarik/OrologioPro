"use client";

import { useEffect, useRef, useState } from "react";

interface MarqueeTextProps {
  text: string;
}

const SCROLL_SPEED_PX_PER_SEC = 85;

export function MarqueeText({ text }: MarqueeTextProps) {
  const trimmed = text.trim();
  const containerRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLSpanElement>(null);
  const [metrics, setMetrics] = useState<{
    containerWidth: number;
    durationSec: number;
  }>({
    containerWidth: 0,
    durationSec: 12,
  });

  useEffect(() => {
    if (!trimmed) return;

    const measure = () => {
      const container = containerRef.current;
      const copy = copyRef.current;
      if (!container || !copy) return;

      const containerWidth = container.clientWidth;
      const copyWidth = Math.max(copy.offsetWidth, containerWidth);
      const durationSec = Math.max(8, copyWidth / SCROLL_SPEED_PX_PER_SEC);

      setMetrics({ containerWidth, durationSec });
    };

    measure();

    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    if (copyRef.current) observer.observe(copyRef.current);

    return () => observer.disconnect();
  }, [trimmed]);

  if (!trimmed) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden py-0"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
      }}
      aria-live="off"
    >
      <div
        className="animate-orologio-marquee flex w-max items-center whitespace-nowrap text-[11px] leading-tight font-medium text-[var(--app-subtitle)] sm:text-xs"
        style={{
          animationDuration: `${metrics.durationSec.toFixed(2)}s`,
        }}
      >
        <span
          ref={copyRef}
          className="inline-block pr-16"
          style={{
            minWidth:
              metrics.containerWidth > 0
                ? `${metrics.containerWidth}px`
                : undefined,
          }}
        >
          {trimmed}
        </span>
        <span
          aria-hidden="true"
          className="inline-block pr-16"
          style={{
            minWidth:
              metrics.containerWidth > 0
                ? `${metrics.containerWidth}px`
                : undefined,
          }}
        >
          {trimmed}
        </span>
      </div>
    </div>
  );
}
