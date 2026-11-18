export type FakeBannerId = "fake-1" | "fake-2" | "fake-3" | "fake-4";
export type RealBannerId = "real-1" | "real-2";

export interface BannerConfig {
  id: string;
  label: string;
  kind: "fake" | "real";
  /** Optional path under /public (e.g. "/banners/fake-1.png") once real images are added. */
  imageSrc: string | null;
  alt: string;
}

export const FAKE_BANNERS: readonly (BannerConfig & { id: FakeBannerId })[] = [
  {
    id: "fake-1",
    label: "pubblicità finta 1",
    kind: "fake",
    imageSrc: null,
    alt: "Pubblicità finta 1",
  },
  {
    id: "fake-2",
    label: "pubblicità finta 2",
    kind: "fake",
    imageSrc: null,
    alt: "Pubblicità finta 2",
  },
  {
    id: "fake-3",
    label: "pubblicità finta 3",
    kind: "fake",
    imageSrc: null,
    alt: "Pubblicità finta 3",
  },
  {
    id: "fake-4",
    label: "pubblicità finta 4",
    kind: "fake",
    imageSrc: null,
    alt: "Pubblicità finta 4",
  },
] as const;

export const REAL_BANNERS: readonly (BannerConfig & { id: RealBannerId })[] = [
  {
    id: "real-1",
    label: "pubblicità vera 1",
    kind: "real",
    imageSrc: null,
    alt: "Pubblicità vera 1",
  },
  {
    id: "real-2",
    label: "pubblicità vera 2",
    kind: "real",
    imageSrc: null,
    alt: "Pubblicità vera 2",
  },
] as const;

export const DEFAULT_FAKE_BANNERS: FakeBannerId[] = ["fake-1"];

export function getFakeBannerById(id: FakeBannerId): BannerConfig {
  return FAKE_BANNERS.find((banner) => banner.id === id) ?? FAKE_BANNERS[0];
}
