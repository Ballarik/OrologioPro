import type { BannerConfig } from "@/config/banners";

interface BannerSlotProps {
  banner: BannerConfig;
  compact?: boolean;
}

export function BannerSlot({ banner, compact = false }: BannerSlotProps) {
  const heightClass = compact
    ? "min-h-[76px] sm:min-h-[84px]"
    : "min-h-[96px] sm:min-h-[124px]";

  if (banner.imageSrc) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] ${heightClass}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={banner.imageSrc}
          alt={banner.alt}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-4 transition-colors duration-300 ${heightClass}`}
      role="region"
      aria-label={banner.alt}
    >
      {/* Left subtle placeholder graphic matching sketch proportions */}
      <div
        aria-hidden="true"
        className="hidden shrink-0 items-center gap-3 sm:flex"
      >
        <div className="h-9 w-9 rounded-md border border-[var(--app-border)] bg-[var(--app-bg)] opacity-70" />
        <div className="flex flex-col gap-1.5">
          <div className="h-2 w-14 rounded-full bg-[var(--app-muted)] opacity-25" />
          <div className="h-2 w-10 rounded-full bg-[var(--app-muted)] opacity-15" />
        </div>
      </div>

      {/* Centered clear banner text */}
      <span className="mx-auto text-center text-base font-semibold tracking-wide text-[var(--app-text)] sm:text-xl">
        {banner.label}
      </span>

      {/* Right subtle placeholder graphic matching sketch proportions */}
      <div
        aria-hidden="true"
        className="hidden shrink-0 items-center gap-3 sm:flex"
      >
        <div className="flex flex-col items-end gap-1.5">
          <div className="h-2 w-12 rounded-full bg-[var(--app-muted)] opacity-25" />
          <div className="h-2 w-8 rounded-full bg-[var(--app-muted)] opacity-15" />
        </div>
        <div className="h-10 w-10 rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] opacity-70" />
      </div>
    </div>
  );
}
