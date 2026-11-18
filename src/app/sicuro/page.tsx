import type { Metadata } from "next";
import { ClockPageView } from "@/components/ClockPageView";

export const metadata: Metadata = {
  title: "OrologioPro — Sicuro",
};

export default function SicuroPage() {
  return <ClockPageView mode="real" />;
}
