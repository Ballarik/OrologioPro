import type { Metadata } from "next";
import { SwapClockView } from "@/components/SwapClockView";

export const metadata: Metadata = {
  title: "OrologioPro — Swap",
};

export default function SwapPage() {
  return <SwapClockView />;
}
