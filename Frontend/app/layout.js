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
  title: "Medzoos | Medicines, Doctors & Lab Tests in Pakistan",
  description:
    "Medzoos connects patients in Pakistan with healthcare providers for medicines, doctor consultations, appointments and laboratory services through one convenient platform.",
  applicationName: "Medzoos",
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
  openGraph: {
    title: "Medzoos | Medicines, Doctors & Lab Tests in Pakistan",
    description:
      "Medzoos connects patients in Pakistan with healthcare providers for medicines, doctor consultations, appointments and laboratory services through one convenient platform.",
    type: "website",
    locale: "en_PK",
    siteName: "Medzoos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medzoos | Medicines, Doctors & Lab Tests in Pakistan",
    description:
      "Medzoos connects patients in Pakistan with healthcare providers for medicines, doctor consultations, appointments and laboratory services through one convenient platform.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSerifDisplay.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full scroll-smooth`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[var(--color-surface-base)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
