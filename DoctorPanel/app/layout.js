import { DM_Serif_Display, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif-display",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  title: "Doctor Portal | Medzoos",
  description: "Manage appointments, patients, and telehealth consultations.",
  icons: {
    icon: [
      { url: "/favicon-32.png?v=9", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48.png?v=9", type: "image/png", sizes: "48x48" },
      { url: "/favicon.ico?v=9", sizes: "16x16 32x32" },
      { url: "/icon.png?v=9", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon-32.png?v=9",
    apple: [{ url: "/apple-touch-icon.png?v=9", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSerifDisplay.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[var(--color-surface-base)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
