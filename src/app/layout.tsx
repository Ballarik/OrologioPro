import type { Metadata } from "next";
import { SETTINGS_STORAGE_KEY } from "@/lib/settingsStorage";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrologioPro",
  description: "Orologio digitale 24 ore con banner pubblicitari e sottotitoli.",
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var raw = window.localStorage.getItem(${JSON.stringify(SETTINGS_STORAGE_KEY)});
    if (!raw) return;
    var parsed = JSON.parse(raw);
    if (parsed && (parsed.backgroundMode === "dark" || parsed.backgroundMode === "light")) {
      document.documentElement.dataset.theme = parsed.backgroundMode;
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="transition-colors duration-300">{children}</body>
    </html>
  );
}
