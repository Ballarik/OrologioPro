"use client";

import { useEffect, useState } from "react";

interface WebkitDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
}

interface WebkitElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

function getFullscreenElement(): Element | null {
  if (typeof document === "undefined") return null;
  const doc = document as WebkitDocument;
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const sync = () => {
      setIsFullscreen(Boolean(getFullscreenElement()));
    };

    sync();
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  const handleToggle = async () => {
    try {
      if (getFullscreenElement()) {
        const doc = document as WebkitDocument;
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        }
        return;
      }

      const root = document.documentElement as WebkitElement;
      if (root.requestFullscreen) {
        await root.requestFullscreen();
      } else if (root.webkitRequestFullscreen) {
        await root.webkitRequestFullscreen();
      }
    } catch {
      // Ignore fullscreen rejections (e.g. unsupported browser or blocked gesture).
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isFullscreen ? "Esci da schermo intero" : "Schermo intero"}
      title={isFullscreen ? "Esci da schermo intero" : "Schermo intero"}
      className="fixed top-4 right-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)] opacity-75 transition hover:text-[var(--app-text)] hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-blue-500"
    >
      {isFullscreen ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M8 3v3a2 2 0 0 1-2 2H3" />
          <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
          <path d="M3 16h3a2 2 0 0 1 2 2v3" />
          <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M8 3H5a2 2 0 0 0-2 2v3" />
          <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
          <path d="M3 16v3a2 2 0 0 0 2 2h3" />
          <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
      )}
    </button>
  );
}
