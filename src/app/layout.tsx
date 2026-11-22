import type { Metadata } from "next";
import { Inter, Oxanium, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-face",
});

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-oxanium-face",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono-face",
});

export const metadata: Metadata = {
  title: "solpr.dev",
  description: "Private transfers on Solana, powered by Solana Privacy Rings.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${oxanium.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
